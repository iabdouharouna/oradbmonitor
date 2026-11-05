from __future__ import annotations

import logging
import re
import threading
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

try:
    import oracledb
except ImportError:
    oracledb = None


ROOT = Path(__file__).resolve().parent
logger = logging.getLogger("deynao")
app = FastAPI(title="Deynao Oracle Monitor", version="1.0.0")
_lock = threading.RLock()
_transaction_samples: dict[str, tuple[float, float]] = {}


@dataclass(frozen=True)
class OracleConfig:
    host: str
    port: int
    service: str
    username: str
    password: str
    sysdba: bool = False
    environment: str = "TEST"
    name: str = ""

    def public(self) -> dict[str, str | int]:
        return {
            "name": self.name or self.service,
            "host": self.host,
            "port": str(self.port),
            "service": self.service,
            "username": self.username,
            "environment": self.environment,
            "auto": False,
            "lastUsed": "à l'instant",
            "hostname": "Oracle",
        }


_oracle: OracleConfig | None = None


class ConnectionRequest(BaseModel):
    host: str = Field(min_length=1, max_length=255)
    port: int = Field(default=1521, ge=1, le=65535)
    service: str = Field(min_length=1, max_length=128)
    username: str = Field(min_length=1, max_length=128)
    password: str = Field(min_length=1, max_length=1024)
    environment: str = Field(default="TEST", pattern="^(DEV|TEST|PROD)$")
    name: str = Field(default="", max_length=128)
    sysdba: bool = False


def _safe_identifier(value: str, label: str) -> str:
    if not re.fullmatch(r"[A-Za-z0-9._$#-]+", value):
        raise HTTPException(status_code=422, detail=f"Valeur invalide pour {label}.")
    return value


def _connect(config: OracleConfig):
    if oracledb is None:
        raise HTTPException(
            status_code=503,
            detail="Le pilote Oracle n’est pas installé pour cette version de Python. Utilisez Python 3.11 à 3.13 puis réinstallez requirements.txt.",
        )
    dsn = oracledb.makedsn(config.host, config.port, service_name=config.service)
    options: dict[str, Any] = {}
    if config.sysdba:
        options["mode"] = oracledb.AUTH_MODE_SYSDBA
    connection = oracledb.connect(user=config.username, password=config.password, dsn=dsn, **options)
    try:
        connection.client_identifier = "Deynao"
        connection.module = "Deynao"
        connection.action = "Supervision"
    except Exception:
        logger.debug("Identification de la session Deynao non appliquée", exc_info=True)
    return connection


def _candidate(request: ConnectionRequest) -> OracleConfig:
    host = request.host.strip()
    if not host or any(char.isspace() for char in host):
        raise HTTPException(status_code=422, detail="Nom d’hôte Oracle invalide.")
    service = _safe_identifier(request.service.strip(), "service Oracle")
    username = request.username.strip()
    if not username:
        raise HTTPException(status_code=422, detail="Le nom d’utilisateur Oracle est requis.")
    return OracleConfig(
        host, request.port, service, username, request.password,
        request.sysdba, request.environment, request.name.strip(),
    )


def _verify_connection(candidate: OracleConfig) -> None:
    if oracledb is None:
        raise HTTPException(
            status_code=503,
            detail="Le pilote Oracle n’est pas installé pour cette version de Python. Utilisez Python 3.11 à 3.13 puis réinstallez requirements.txt.",
        )
    connection = None
    try:
        connection = _connect(candidate)
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1 FROM dual")
            cursor.fetchone()
    except oracledb.Error as exc:
        logger.warning(
            "Échec du test de connexion Oracle (%s:%s/%s)",
            candidate.host, candidate.port, candidate.service,
        )
        raise HTTPException(
            status_code=502,
            detail="Connexion Oracle impossible. Vérifiez l’hôte, le port, le service, les identifiants et les droits réseau.",
        ) from exc
    finally:
        if connection is not None:
            connection.close()


def _fetch_all(connection: Any, sql: str) -> list[dict[str, Any]]:
    with connection.cursor() as cursor:
        cursor.execute(sql)
        columns = [item[0].lower() for item in cursor.description or ()]
        return [dict(zip(columns, row)) for row in cursor.fetchall()]


def _fetch_one(connection: Any, sql: str) -> dict[str, Any]:
    rows = _fetch_all(connection, sql)
    return rows[0] if rows else {}


def _metric(label: str, value: Any, foot: str, tone: str = "blue") -> dict[str, str]:
    return {"label": label, "value": str(value) if value is not None else "—", "foot": foot, "tone": tone}


def _number_or_none(value: Any) -> float | None:
    if value is None:
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def _format_bytes(value: float | None) -> str:
    if value is None:
        return "—"
    if value >= 1024**3:
        return f"{value / 1024**3:.2f} GB"
    if value >= 1024**2:
        return f"{value / 1024**2:.2f} MB"
    return f"{value / 1024:.2f} KB"


def _fetch_optional(
    connection: Any,
    sql: str,
    label: str,
) -> tuple[list[dict[str, Any]], bool]:
    try:
        return _fetch_all(connection, sql), True
    except oracledb.Error as exc:
        logger.warning("Collecte Oracle indisponible pour %s: %s", label, exc)
        return [], False


_UNDO_TABLESPACE_NAME = re.compile(r"^[A-Za-z][A-Za-z0-9_$#]*$")


def _int_text(value: Any) -> str:
    number = _number_or_none(value)
    return "—" if number is None else str(int(number))


def _undo_metrics(connection: Any) -> list[dict[str, str]]:
    """Collecte l'état réel du tablespace UNDO ; chaque vue indisponible donne « — »."""
    param_rows, _ = _fetch_optional(connection, """
        SELECT name, value FROM v$parameter
        WHERE name IN ('undo_tablespace', 'undo_management')
    """, "paramètres UNDO")
    params = {str(row.get("name", "")).lower(): row.get("value") for row in param_rows}
    management = str(params.get("undo_management") or "").strip().upper() or "—"
    tablespace = str(params.get("undo_tablespace") or "").strip()
    if not tablespace:
        name_rows, _ = _fetch_optional(connection, """
            SELECT tablespace_name FROM dba_tablespaces
            WHERE contents = 'UNDO' ORDER BY tablespace_name
        """, "tablespace UNDO")
        tablespace = str(name_rows[0].get("tablespace_name") or "") if name_rows else ""
    known = bool(_UNDO_TABLESPACE_NAME.match(tablespace))

    file_count = used_bytes = total_bytes = max_bytes = autoextend = path = segments = None
    nospace_errors = snapshot_errors = None
    if known:
        file_rows, _ = _fetch_optional(connection, f"""
            SELECT COUNT(*) AS file_count,
                   NVL(SUM(bytes), 0) AS total_bytes,
                   NVL(SUM(CASE WHEN autoextensible = 'YES' THEN GREATEST(maxbytes, bytes) ELSE bytes END), 0) AS max_bytes,
                   NVL(SUM(CASE WHEN autoextensible = 'YES' THEN 1 ELSE 0 END), 0) AS autoextend_count,
                   MIN(file_name) AS first_file
            FROM dba_data_files WHERE tablespace_name = '{tablespace}'
        """, "fichiers UNDO")
        if file_rows:
            row = file_rows[0]
            file_count = _number_or_none(row.get("file_count"))
            total_bytes = _number_or_none(row.get("total_bytes"))
            max_bytes = _number_or_none(row.get("max_bytes"))
            extended = _number_or_none(row.get("autoextend_count")) or 0
            if file_count:
                autoextend = "OUI" if extended >= file_count else "PARTIEL" if extended > 0 else "NON"
                first_file = str(row.get("first_file") or "")
                path = first_file + (f" (+{int(file_count) - 1} autre(s))" if file_count > 1 else "")
        extent_rows, _ = _fetch_optional(connection, f"""
            SELECT NVL(SUM(bytes), 0) AS used_bytes FROM dba_undo_extents
            WHERE tablespace_name = '{tablespace}' AND status IN ('ACTIVE', 'UNEXPIRED')
        """, "extents UNDO")
        if extent_rows:
            used_bytes = _number_or_none(extent_rows[0].get("used_bytes"))
        segment_rows, _ = _fetch_optional(connection, f"""
            SELECT COUNT(*) AS segment_count FROM dba_rollback_segs
            WHERE tablespace_name = '{tablespace}' AND status = 'ONLINE'
        """, "segments UNDO")
        if segment_rows:
            segments = _number_or_none(segment_rows[0].get("segment_count"))
    stat_rows, _ = _fetch_optional(connection, """
        SELECT NVL(SUM(nospaceerrcnt), 0) AS nospace_errors,
               NVL(SUM(ssolderrcnt), 0) AS snapshot_errors
        FROM v$undostat WHERE begin_time >= SYSDATE - 1
    """, "statistiques UNDO")
    if stat_rows:
        nospace_errors = _number_or_none(stat_rows[0].get("nospace_errors"))
        snapshot_errors = _number_or_none(stat_rows[0].get("snapshot_errors"))

    return [
        _metric("Tablespace UNDO", tablespace if known else "—", "V$PARAMETER.UNDO_TABLESPACE", "blue"),
        _metric("Mode gestion UNDO", management, "V$PARAMETER.UNDO_MANAGEMENT", "blue"),
        _metric("Espace UNDO utilisé", _int_text(used_bytes), "DBA_UNDO_EXTENTS (octets, ACTIVE + UNEXPIRED)", "blue"),
        _metric("Espace UNDO total", _int_text(total_bytes), "DBA_DATA_FILES (octets)", "blue"),
        _metric("Capacité max UNDO", _int_text(max_bytes), "DBA_DATA_FILES.MAXBYTES (octets)", "blue"),
        _metric("Fichiers UNDO", _int_text(file_count), "DBA_DATA_FILES", "blue"),
        _metric("Autoextend UNDO", autoextend or "—", "DBA_DATA_FILES.AUTOEXTENSIBLE", "blue"),
        _metric("Chemin UNDO", path or "—", "DBA_DATA_FILES.FILE_NAME", "blue"),
        _metric("Segments UNDO actifs", _int_text(segments), "DBA_ROLLBACK_SEGS (ONLINE)", "blue"),
        _metric("Erreurs saturation UNDO", _int_text(nospace_errors), "V$UNDOSTAT.NOSPACEERRCNT (24 h)", "blue"),
        _metric("Erreurs ORA-01555 UNDO", _int_text(snapshot_errors), "V$UNDOSTAT.SSOLDERRCNT (24 h)", "blue"),
    ]


def _read_system_process_details(connection: Any) -> dict[str, Any]:
    process_rows, processes_available = _fetch_optional(connection, """
        SELECT b.name,
               b.description,
               NVL(p.pga_alloc_mem, 0) AS memory_bytes,
               CASE WHEN p.addr IS NULL THEN 0 ELSE 1 END AS is_running
        FROM v$bgprocess b
        LEFT JOIN v$process p ON p.addr = b.paddr
        WHERE b.name IS NOT NULL
          AND p.addr IS NOT NULL
        ORDER BY CASE
            WHEN b.name = 'PMON' THEN 10
            WHEN b.name = 'SMON' THEN 20
            WHEN b.name = 'LGWR' THEN 30
            WHEN b.name = 'DBW0' THEN 40
            WHEN b.name = 'CKPT' THEN 50
            WHEN b.name = 'MMON' THEN 60
            WHEN b.name = 'MMNL' THEN 70
            WHEN b.name = 'RECO' THEN 80
            WHEN b.name LIKE 'DBW%' THEN 45
            WHEN b.name LIKE 'ARC%' THEN 90
            ELSE 100
        END, b.name
    """, "détail des processus système Oracle")
    uptime_rows, uptime_available = _fetch_optional(connection, """
        SELECT ROUND((SYSDATE - startup_time) * 86400) AS uptime_seconds
        FROM v$instance
    """, "durée de disponibilité de l'instance Oracle")
    uptime_seconds = (
        _number_or_none(uptime_rows[0].get("uptime_seconds"))
        if uptime_available and uptime_rows
        else None
    )
    processes = [
        {
            "name": str(row.get("name") or "").strip(),
            "description": str(row.get("description") or "").strip(),
            "memory_bytes": int(_number_or_none(row.get("memory_bytes")) or 0),
            "running": _number_or_none(row.get("is_running")) == 1,
        }
        for row in process_rows
        if str(row.get("name") or "").strip()
        and _number_or_none(row.get("is_running")) == 1
    ]
    return {
        "processes": processes,
        "processes_available": processes_available,
        "uptime_seconds": uptime_seconds,
    }


def _session_account_label(username: str) -> str:
    if username.upper() in {"SYS", "SYSTEM"}:
        return "Compte Oracle système"
    if username.upper() == "DBSNMP":
        return "Compte de supervision Oracle"
    return "Session utilisateur Oracle"


def _session_program(value: Any) -> str:
    program = str(value or "").strip()
    if not program:
        return "—"
    program = program.replace("\\", "/").rsplit("/", 1)[-1]
    known = {
        "sql developer": "SQL Developer",
        "sqldeveloper": "SQL Developer",
        "sqldeveloper.exe": "SQL Developer",
        "sqlplus": "SQL*Plus",
        "sqlplus.exe": "SQL*Plus",
    }
    return known.get(program.lower(), program)


def _read_user_sessions(connection: Any) -> dict[str, Any]:
    excluded_rows, excluded_available = _fetch_optional(connection, """
        SELECT COUNT(*) AS excluded_count
        FROM v$session
        WHERE type = 'USER'
          AND (client_identifier = 'Deynao'
               OR module = 'Deynao'
               OR UPPER(NVL(program, ' ')) LIKE '%DEYNAO%')
    """, "sessions de supervision Deynao")
    session_rows, sessions_available = _fetch_optional(connection, """
        SELECT s.username,
               s.program,
               s.status,
               s.machine,
               s.sid,
               s.serial# AS serial_number,
               NVL(p.pga_alloc_mem, 0) AS memory_bytes,
               ROUND((SYSDATE - s.logon_time) * 86400) AS duration_seconds
        FROM v$session s
        LEFT JOIN v$process p ON p.addr = s.paddr
        WHERE s.type = 'USER'
          AND s.username IS NOT NULL
          AND NVL(s.client_identifier, ' ') <> 'Deynao'
          AND NVL(s.module, ' ') <> 'Deynao'
          AND UPPER(NVL(s.program, ' ')) NOT LIKE '%DEYNAO%'
        ORDER BY s.username, s.program
    """, "détail des sessions utilisateur Oracle")
    excluded_count = (
        int(_number_or_none(excluded_rows[0].get("excluded_count")) or 0)
        if excluded_available and excluded_rows
        else 0
    )
    sessions = []
    for row in session_rows:
        username = str(row.get("username") or "").strip()
        if not username:
            continue
        sessions.append({
            "username": username,
            "account_label": _session_account_label(username),
            "program": _session_program(row.get("program")),
            "status": str(row.get("status") or "").strip().upper(),
            "machine": str(row.get("machine") or "").strip(),
            "sid": int(_number_or_none(row.get("sid")) or 0),
            "serial_number": int(_number_or_none(row.get("serial_number")) or 0),
            "memory_bytes": int(_number_or_none(row.get("memory_bytes")) or 0),
            "duration_seconds": int(_number_or_none(row.get("duration_seconds")) or 0),
        })
    return {
        "user_sessions": sessions,
        "user_sessions_available": sessions_available,
        "excluded_sessions": excluded_count,
    }


def _read_performance_cpu(connection: Any) -> dict[str, Any]:
    metric_rows, metrics_available = _fetch_optional(connection, """
        SELECT metric_name, value, metric_unit
        FROM v$sysmetric
        WHERE group_id = 2 AND metric_name IN (
            'Average Active Sessions', 'Database CPU Time Ratio',
            'Database Wait Time Ratio', 'Database Time Per Sec',
            'SQL Service Response Time', 'CPU Usage Per Sec'
        )
    """, "métriques CPU avancées")
    metric_values = {
        row["metric_name"]: {
            "value": _number_or_none(row.get("value")),
            "unit": row.get("metric_unit"),
        }
        for row in metric_rows
    }

    cpu_count_row, cpu_count_available = _fetch_optional(connection, """
        SELECT value FROM v$osstat WHERE stat_name = 'NUM_CPUS'
    """, "nombre de CPU")
    cpu_count = _number_or_none(cpu_count_row[0].get("value")) if cpu_count_row else None
    aas = metric_values.get("Average Active Sessions", {}).get("value")

    wait_rows, waits_available = _fetch_optional(connection, """
        SELECT wait_class, time_waited_micro
        FROM v$system_wait_class
        WHERE wait_class <> 'Idle'
    """, "répartition des attentes")
    wait_totals = {
        "User I/O": 0.0,
        "Commit": 0.0,
        "Application": 0.0,
        "Other": 0.0,
        "Scheduler": 0.0,
        "Concurrency": 0.0,
    }
    known_wait_classes = {name.casefold(): name for name in wait_totals if name != "Other"}
    for row in wait_rows:
        wait_class = str(row.get("wait_class") or "")
        if wait_class.casefold() == "idle":
            continue
        category = known_wait_classes.get(wait_class.casefold(), "Other")
        wait_totals[category] += _number_or_none(row.get("time_waited_micro")) or 0
    total_wait = sum(wait_totals.values())
    waits = [
        {
            "label": label,
            "time_waited_micro": value,
            "percent": round(value / total_wait * 100, 1) if total_wait else 0,
        }
        for label, value in wait_totals.items()
    ]

    session_rows, sessions_available = _fetch_optional(connection, """
        SELECT * FROM (
            SELECT s.sid, s.serial# AS serial_number, s.username, s.status, s.sql_id,
                   ss.value AS cpu_centiseconds, q.sql_text
            FROM v$session s
            JOIN v$sesstat ss ON ss.sid = s.sid
            JOIN v$statname sn ON sn.statistic# = ss.statistic#
            LEFT JOIN v$sqlarea q ON q.sql_id = s.sql_id
            WHERE sn.name = 'CPU used by this session'
              AND s.type = 'USER' AND ss.value > 0
            ORDER BY ss.value DESC
        ) WHERE ROWNUM <= 5
    """, "sessions CPU")
    sessions = [
        {
            "sid": row.get("sid"),
            "serial_number": row.get("serial_number"),
            "username": row.get("username"),
            "status": row.get("status"),
            "sql_id": row.get("sql_id"),
            "cpu_seconds": round((_number_or_none(row.get("cpu_centiseconds")) or 0) / 100, 2),
            "sql_text": row.get("sql_text"),
        }
        for row in session_rows
    ]

    sql_rows, sql_available = _fetch_optional(connection, """
        SELECT * FROM (
            SELECT sql_id, executions, cpu_time,
                   CASE WHEN executions > 0 THEN cpu_time / executions END AS cpu_per_execution,
                   sql_text
            FROM v$sqlarea
            WHERE executions > 0 AND cpu_time > 0
            ORDER BY cpu_time DESC
        ) WHERE ROWNUM <= 5
    """, "requêtes SQL CPU")
    top_sql = [
        {
            "sql_id": row.get("sql_id"),
            "executions": _number_or_none(row.get("executions")),
            "cpu_seconds": round((_number_or_none(row.get("cpu_time")) or 0) / 1_000_000, 2),
            "cpu_ms_per_execution": round((_number_or_none(row.get("cpu_per_execution")) or 0) / 1_000, 2),
            "sql_text": row.get("sql_text"),
        }
        for row in sql_rows
    ]

    return {
        "metrics": {
            "aas": aas,
            "cpu_count": cpu_count,
            "aas_per_cpu": aas / cpu_count if aas is not None and cpu_count else None,
            "db_cpu_ratio": metric_values.get("Database CPU Time Ratio", {}).get("value"),
            "wait_time_ratio": metric_values.get("Database Wait Time Ratio", {}).get("value"),
            "db_time_per_sec": metric_values.get("Database Time Per Sec", {}).get("value"),
            "db_time_unit": metric_values.get("Database Time Per Sec", {}).get("unit"),
            "response_time": metric_values.get("SQL Service Response Time", {}).get("value"),
            "response_time_unit": metric_values.get("SQL Service Response Time", {}).get("unit"),
            "cpu_per_sec": metric_values.get("CPU Usage Per Sec", {}).get("value"),
            "cpu_per_sec_unit": metric_values.get("CPU Usage Per Sec", {}).get("unit"),
        },
        "availability": {
            "metrics": metrics_available,
            "cpu_count": cpu_count_available,
            "waits": waits_available,
            "sessions": sessions_available,
            "sql": sql_available,
        },
        "waits": waits,
        "sessions": sessions,
        "sql": top_sql,
    }


def _read_performance_io(connection: Any) -> dict[str, Any]:
    stats_rows, stats_available = _fetch_optional(connection, """
        SELECT name, value FROM v$sysstat
        WHERE name IN ('db block gets', 'consistent gets', 'physical reads', 'physical writes')
    """, "compteurs I/O")
    stats = {row["name"]: _number_or_none(row.get("value")) for row in stats_rows}
    logical_reads = (stats.get("db block gets") or 0) + (stats.get("consistent gets") or 0)
    physical_reads = stats.get("physical reads")
    physical_writes = stats.get("physical writes")
    buffer_hit_ratio = (
        (logical_reads - physical_reads) / logical_reads * 100
        if stats_available and physical_reads is not None and logical_reads > 0
        else None
    )
    saved_reads = max(logical_reads - physical_reads, 0) if physical_reads is not None else None

    library_rows, library_available = _fetch_optional(connection, """
        SELECT SUM(pins) AS pins, SUM(pinhits) AS hits, SUM(reloads) AS reloads
        FROM v$librarycache
        WHERE namespace = 'SQL AREA'
    """, "compteurs library cache")
    library = library_rows[0] if library_rows else {}
    pins = _number_or_none(library.get("pins"))
    library_hits = _number_or_none(library.get("hits"))
    reloads = _number_or_none(library.get("reloads"))
    library_hit_ratio = (
        library_hits / pins * 100
        if library_available and library_hits is not None and pins is not None and pins > 0
        else None
    )

    segment_rows, segments_available = _fetch_optional(connection, """
        SELECT * FROM (
            SELECT owner, object_name, subobject_name,
                   SUM(CASE WHEN statistic_name = 'physical reads' THEN value ELSE 0 END) AS physical_reads,
                   SUM(CASE WHEN statistic_name = 'physical writes' THEN value ELSE 0 END) AS physical_writes
            FROM v$segment_statistics
            WHERE statistic_name IN ('physical reads', 'physical writes')
            GROUP BY owner, object_name, subobject_name
            HAVING SUM(value) > 0
            ORDER BY SUM(value) DESC
        ) WHERE ROWNUM <= 5
    """, "segments I/O")
    segments = [
        {
            "owner": row.get("owner"),
            "object_name": row.get("object_name"),
            "subobject_name": row.get("subobject_name"),
            "physical_reads": _number_or_none(row.get("physical_reads")) or 0,
            "physical_writes": _number_or_none(row.get("physical_writes")) or 0,
        }
        for row in segment_rows
    ]

    total_io = (
        physical_reads + physical_writes
        if physical_reads is not None and physical_writes is not None
        else None
    )
    return {
        "metrics": {
            "buffer_hit_ratio": buffer_hit_ratio,
            "logical_reads": logical_reads if stats_available else None,
            "physical_reads": physical_reads,
            "physical_writes": physical_writes,
            "saved_reads": saved_reads,
            "library_hit_ratio": library_hit_ratio,
            "library_pins": pins,
            "library_hits": library_hits,
            "library_reloads": reloads,
            "total_io": total_io,
        },
        "availability": {
            "stats": stats_available,
            "library_cache": library_available,
            "segments": segments_available,
        },
        "segments": segments,
    }


def _transaction_rate(database_id: str, counter: float, observed_at: float) -> float | None:
    with _lock:
        previous = _transaction_samples.get(database_id)
        _transaction_samples[database_id] = (observed_at, counter)
    if previous is None:
        return None
    previous_time, previous_counter = previous
    elapsed = observed_at - previous_time
    if elapsed < 1 or counter < previous_counter:
        return None
    return (counter - previous_counter) / elapsed


def _read_capacity(connection: Any) -> list[dict[str, Any]]:
    rows = _fetch_all(connection, """
        SELECT tablespace_name,
               SUM(allocated_bytes) AS allocated_bytes,
               SUM(used_bytes) AS used_bytes,
               SUM(autoextend_count) AS autoextend_count,
               SUM(autoextend_available_bytes) AS autoextend_available_bytes,
               tablespace_type
        FROM (
            SELECT d.tablespace_name,
                   SUM(d.bytes) AS allocated_bytes,
                   SUM(d.bytes) - SUM(NVL(f.bytes, 0)) AS used_bytes,
                   SUM(CASE WHEN d.autoextensible = 'YES' THEN 1 ELSE 0 END) AS autoextend_count,
                   SUM(CASE WHEN d.autoextensible = 'YES' THEN GREATEST(d.maxbytes - d.bytes, 0) ELSE 0 END) AS autoextend_available_bytes,
                   'PERMANENT' AS tablespace_type
            FROM dba_data_files d
            LEFT JOIN (
                SELECT file_id, SUM(bytes) AS bytes
                FROM dba_free_space
                GROUP BY file_id
            ) f ON f.file_id = d.file_id
            GROUP BY d.tablespace_name
            UNION ALL
            SELECT t.tablespace_name,
                   SUM(t.bytes) AS allocated_bytes,
                   SUM(NVL(h.bytes_used, 0)) AS used_bytes,
                   SUM(CASE WHEN t.autoextensible = 'YES' THEN 1 ELSE 0 END) AS autoextend_count,
                   SUM(CASE WHEN t.autoextensible = 'YES' THEN GREATEST(t.maxbytes - t.bytes, 0) ELSE 0 END) AS autoextend_available_bytes,
                   'TEMPORARY' AS tablespace_type
            FROM dba_temp_files t
            LEFT JOIN (
                SELECT file_id, SUM(bytes_used) AS bytes_used
                FROM v$temp_space_header
                GROUP BY file_id
            ) h ON h.file_id = t.file_id
            GROUP BY t.tablespace_name
        )
        GROUP BY tablespace_name, tablespace_type
        ORDER BY tablespace_name
    """)
    tablespaces = []
    for row in rows:
        allocated = float(row.get("allocated_bytes") or 0)
        used = min(max(float(row.get("used_bytes") or 0), 0), allocated)
        percent = used / allocated * 100 if allocated else 0
        tablespaces.append({
            "name": str(row["tablespace_name"]),
            "used_percent": round(percent, 2),
            "used_bytes": used,
            "allocated_bytes": allocated,
            "used": _format_bytes(used),
            "allocated": _format_bytes(allocated),
            "autoextend": int(row.get("autoextend_count") or 0) > 0,
            "autoextend_available_bytes": float(row.get("autoextend_available_bytes") or 0),
            "type": str(row.get("tablespace_type") or "PERMANENT"),
        })
    return tablespaces


def _capacity_metrics(tablespaces: list[dict[str, Any]]) -> list[dict[str, str]]:
    if not tablespaces:
        return [
            _metric("Tablespaces à surveiller", "—", "Aucun tablespace retourné par Oracle"),
            _metric("Utilisation totale", "—", "Aucune capacité physique disponible"),
            _metric("Protection autoextend", "—", "Aucun fichier de données retourné"),
            _metric("Espace libre", "—", "Aucune capacité physique disponible"),
        ]
    allocated = sum(float(row["allocated_bytes"]) for row in tablespaces)
    used = sum(float(row["used_bytes"]) for row in tablespaces)
    percent = used / allocated * 100 if allocated else 0
    watched = sum(
        row.get("type") != "TEMPORARY"
        and float(row["used_percent"]) >= (85 if row["name"].upper() in {"SYSTEM", "SYSAUX"} else 90)
        for row in tablespaces
    )
    autoextend = sum(bool(row["autoextend"]) for row in tablespaces)
    tone = "amber" if watched else "green"
    return [
        _metric("Tablespaces à surveiller", watched, "Seuil : 90 % ; SYSTEM/SYSAUX : 85 %", tone if watched else "green"),
        _metric("Utilisation totale", f"{percent:.1f}%",
                f"{_format_bytes(used)} / {_format_bytes(allocated)}", tone),
        _metric("Protection autoextend", f"{autoextend}/{len(tablespaces)}",
                "Fichiers avec autoextend activé", "green" if autoextend == len(tablespaces) else "amber"),
        _metric("Espace libre", _format_bytes(max(allocated - used, 0)),
                f"{max(100 - percent, 0):.1f}% disponible", tone),
    ]


@app.get("/")
def home() -> FileResponse:
    return FileResponse(ROOT / "index.html")


@app.get("/styles.css")
def styles() -> FileResponse:
    return FileResponse(ROOT / "styles.css", media_type="text/css")


@app.get("/app.js")
def frontend() -> FileResponse:
    return FileResponse(ROOT / "app.js", media_type="application/javascript")


@app.get("/api/status")
def status() -> dict[str, Any]:
    with _lock:
        config = _oracle
    return {
        "connected": config is not None,
        "mode": "oracle" if config else "demo",
        "connection": config.public() if config else None,
        "driver": oracledb.__version__ if oracledb is not None else None,
    }


@app.post("/api/connect")
def connect_oracle(request: ConnectionRequest) -> dict[str, Any]:
    candidate = _candidate(request)
    with _lock:
        global _oracle
        if oracledb is None:
            _oracle = candidate
            _transaction_samples.clear()
            return {
                "connected": True,
                "connection": candidate.public(),
                "local_only": True,
                "oracle_driver": False,
            }
        _verify_connection(candidate)
        _oracle = candidate
        _transaction_samples.clear()
    return {"connected": True, "connection": candidate.public()}


@app.post("/api/test-connection")
def test_oracle_connection(request: ConnectionRequest) -> dict[str, Any]:
    candidate = _candidate(request)
    if oracledb is None:
        return {"ok": True, "local_only": True, "oracle_driver": False}
    _verify_connection(candidate)
    return {"ok": True, "local_only": False, "oracle_driver": True}


@app.post("/api/disconnect")
def disconnect_oracle() -> dict[str, bool]:
    with _lock:
        global _oracle
        _oracle = None
        _transaction_samples.clear()
    return {"connected": False}


def _read_domain(connection: Any, domain: str) -> list[dict[str, str]]:
    if domain == "overview":
        database = _fetch_one(connection, """
            SELECT d.name AS database_name, d.open_mode, d.log_mode,
                   i.version, i.host_name, i.startup_time
            FROM v$database d CROSS JOIN v$instance i
        """)
        sessions = _fetch_one(connection, """
            SELECT COUNT(*) AS total_sessions,
                   SUM(CASE WHEN status = 'ACTIVE' THEN 1 ELSE 0 END) AS active_sessions
            FROM v$session WHERE type = 'USER'
        """)
        spaces = _read_capacity(connection)
        max_used = max((float(row["used_percent"]) for row in spaces), default=None)
        return [
            _metric("Base Oracle", database.get("database_name", "—"), str(database.get("open_mode", "—")), "blue"),
            _metric("Version", database.get("version", "—"), f"Journalisation : {database.get('log_mode', '—')}", "blue"),
            _metric("Sessions", f"{sessions.get('active_sessions') or 0} / {sessions.get('total_sessions') or 0}",
                    "Sessions actives / totales", "blue"),
            _metric("Tablespaces", len(spaces),
                    f"Utilisation physique maximale : {max_used:.2f}%" if max_used is not None else "Capacité physique indisponible",
                    "blue"),
            _metric("Hôte Oracle", database.get("host_name", "—"), "V$INSTANCE.HOST_NAME", "blue"),
            _metric("Démarrage instance", database.get("startup_time", "—"), "V$INSTANCE.STARTUP_TIME", "blue"),
        ]
    if domain == "performance":
        parameters = _fetch_all(connection, """
            SELECT name, value FROM v$parameter
            WHERE name IN ('sga_target', 'sga_max_size', 'pga_aggregate_target')
        """)
        parameter_values = {row["name"]: row["value"] for row in parameters}
        sga_target = _number_or_none(parameter_values.get("sga_target"))
        if not sga_target:
            sga_target = _number_or_none(parameter_values.get("sga_max_size"))
        pga_target = _number_or_none(parameter_values.get("pga_aggregate_target"))
        sga_free = _fetch_one(connection, """
            SELECT SUM(bytes) AS free_bytes FROM v$sgastat WHERE name = 'free memory'
        """)
        pga = _fetch_one(connection, """
            SELECT value FROM v$pgastat WHERE name = 'total PGA allocated'
        """)
        sessions = _fetch_one(connection, """
            SELECT COUNT(*) AS total_sessions,
                   SUM(CASE WHEN status = 'ACTIVE' THEN 1 ELSE 0 END) AS active_sessions
            FROM v$session WHERE type = 'USER'
        """)
        metrics = _fetch_all(connection, """
            SELECT metric_name, value FROM v$sysmetric
            WHERE group_id = 2 AND metric_name IN
              ('Host CPU Utilization (%)', 'Buffer Cache Hit Ratio', 'Executions Per Sec',
               'User Transaction Per Sec')
        """)
        values = {row["metric_name"]: row["value"] for row in metrics}
        free_bytes = _number_or_none(sga_free.get("free_bytes"))
        pga_bytes = _number_or_none(pga.get("value"))
        active = int(sessions.get("active_sessions") or 0)
        total = int(sessions.get("total_sessions") or 0)
        sga_used = max(sga_target - free_bytes, 0) if sga_target is not None and free_bytes is not None else None
        sga_percent = sga_used / sga_target * 100 if sga_used is not None and sga_target else None
        pga_percent = pga_bytes / pga_target * 100 if pga_bytes is not None and pga_target else None
        cache_ratio = _number_or_none(values.get("Buffer Cache Hit Ratio"))
        if cache_ratio is None:
            cache = _fetch_one(connection, """
                SELECT ROUND(
                    100 * (1 - physical.value / NULLIF(gets.value + consistent.value, 0)), 2
                ) AS hit_ratio
                FROM v$sysstat physical
                JOIN v$sysstat gets ON gets.name = 'db block gets'
                JOIN v$sysstat consistent ON consistent.name = 'consistent gets'
                WHERE physical.name = 'physical reads'
            """)
            cache_ratio = _number_or_none(cache.get("hit_ratio"))
        cpu = _number_or_none(values.get("Host CPU Utilization (%)"))
        if cpu is None:
            cpu_stats = _fetch_one(connection, """
                SELECT MAX(CASE WHEN stat_name = 'BUSY_TIME' THEN value END) AS busy_time,
                       MAX(CASE WHEN stat_name = 'IDLE_TIME' THEN value END) AS idle_time
                FROM v$osstat
                WHERE stat_name IN ('BUSY_TIME', 'IDLE_TIME')
            """)
            busy = _number_or_none(cpu_stats.get("busy_time"))
            idle = _number_or_none(cpu_stats.get("idle_time"))
            cpu = busy / (busy + idle) * 100 if busy is not None and idle is not None and busy + idle else None
        transactions = _number_or_none(values.get("User Transaction Per Sec"))
        transaction_source = "V$SYSMETRIC · User Transaction Per Sec"
        if transactions is None:
            transaction_metric = _fetch_one(connection, """
                SELECT value FROM v$sysmetric_history
                WHERE metric_name = 'User Transaction Per Sec' AND group_id = 2
                ORDER BY end_time DESC FETCH FIRST 1 ROWS ONLY
            """)
            transactions = _number_or_none(transaction_metric.get("value"))
            transaction_source = "V$SYSMETRIC_HISTORY · User Transaction Per Sec"
        if transactions is None:
            transaction_stats = _fetch_one(connection, """
                SELECT d.dbid AS database_id, SUM(s.value) AS transaction_count
                FROM v$database d CROSS JOIN v$sysstat s
                WHERE s.name IN ('user commits', 'user rollbacks')
                GROUP BY d.dbid
            """)
            database_id = transaction_stats.get("database_id")
            transaction_count = _number_or_none(transaction_stats.get("transaction_count"))
            if database_id is not None and transaction_count is not None:
                transactions = _transaction_rate(str(database_id), transaction_count, time.monotonic())
                transaction_source = (
                    "V$SYSSTAT · taux entre collectes"
                    if transactions is not None
                    else "V$SYSSTAT · attente d'une seconde mesure"
                )
        return [
            _metric("Utilisation SGA", f"{sga_percent:.2f}%" if sga_percent is not None else "—",
                    f"{_format_bytes(sga_used)} / {_format_bytes(sga_target)} · Libre : {_format_bytes(free_bytes)}",
                    "amber" if sga_percent is not None and sga_percent >= 90 else "green"),
            _metric("Utilisation PGA", f"{pga_percent:.2f}%" if pga_percent is not None else "—",
                    f"{_format_bytes(pga_bytes)} / {_format_bytes(pga_target)}",
                    "green" if pga_percent is not None and pga_percent < 80 else "amber"),
            _metric("CPU système", f"{cpu:.2f}%" if cpu is not None else "—",
                    "V$SYSMETRIC ou V$OSSTAT · charge CPU depuis le démarrage", "blue"),
            _metric("Sessions", f"{active} / {total}", "Sessions utilisateur actives / totales", "green"),
            _metric("Cache Hit Ratio", f"{cache_ratio:.2f}%" if cache_ratio is not None else "—",
                    "V$SYSMETRIC ou V$SYSSTAT", "green"),
            _metric("Transactions", f"{transactions:.2f}/s" if transactions is not None else "—",
                    transaction_source, "blue"),
        ]
    if domain == "processes":
        resource = _fetch_all(connection, """
            SELECT resource_name, max_utilization
            FROM v$resource_limit WHERE resource_name IN ('processes', 'sessions')
        """)
        processes = _fetch_one(connection, "SELECT COUNT(*) AS process_count FROM v$process")
        sessions = _fetch_one(connection, """
            SELECT COUNT(*) AS session_count FROM v$session WHERE type = 'USER'
        """)
        parameters = _fetch_all(connection, """
            SELECT name, value FROM v$parameter WHERE name IN ('processes', 'sessions')
        """)
        parameter_values = {row["name"]: row["value"] for row in parameters}
        by_name = {str(row.get("resource_name", "")).strip().lower(): row for row in resource}
        process = by_name.get("processes", {})
        process_count = _number_or_none(processes.get("process_count"))
        process_limit = _number_or_none(parameter_values.get("processes"))
        session_count = _number_or_none(sessions.get("session_count"))
        session_limit = _number_or_none(parameter_values.get("sessions"))
        process_percent = process_count / process_limit * 100 if process_count is not None and process_limit else None
        system_process_rows, system_processes_available = _fetch_optional(connection, """
            SELECT COUNT(*) AS process_count,
                   NVL(SUM(p.pga_alloc_mem), 0) AS memory_bytes
            FROM v$bgprocess b
            JOIN v$process p ON p.addr = b.paddr
        """, "processus système Oracle")
        system_process = system_process_rows[0] if system_process_rows else {}
        essential_rows, essential_processes_available = _fetch_optional(connection, """
            SELECT b.name,
                   CASE WHEN p.addr IS NULL THEN 0 ELSE 1 END AS is_running
            FROM v$bgprocess b
            LEFT JOIN v$process p ON p.addr = b.paddr
            WHERE b.name IN ('PMON', 'SMON', 'LGWR', 'DBW0', 'CKPT')
        """, "état des processus Oracle essentiels")
        essential_by_name = {
            str(row.get("name", "")).strip().upper(): _number_or_none(row.get("is_running")) == 1
            for row in essential_rows
        }
        essential_names = ("PMON", "SMON", "LGWR", "DBW0", "CKPT")
        essential_count = sum(essential_by_name.get(name, False) for name in essential_names)
        essential_value = f"{essential_count}/{len(essential_names)}" if essential_processes_available else "—"
        essential_status = (
            " · ".join(f"{name} {'actif' if essential_by_name.get(name, False) else 'indisponible'}"
                       for name in essential_names)
            if essential_processes_available
            else "État non vérifié : accès à V$BGPROCESS indisponible"
        )
        system_count = _number_or_none(system_process.get("process_count")) if system_processes_available else None
        system_memory = _number_or_none(system_process.get("memory_bytes")) if system_processes_available else None
        return [
            _metric("Slots processus",
                    f"{process_count:g} / {process_limit:g}" if process_count is not None and process_limit is not None else "—",
                    f"V$PROCESS / V$PARAMETER.PROCESSES · {process_percent:.1f}% utilisé" if process_percent is not None else "Limite Oracle indisponible",
                    "amber" if process_percent is not None and process_percent >= 80 else "green"),
            _metric("Processus Oracle", processes.get("process_count", "—"), "Nombre de lignes V$PROCESS", "blue"),
            _metric("Processus système",
                    f"{system_count:g}" if system_count is not None else "—",
                    "Processus V$BGPROCESS associés à V$PROCESS" if system_processes_available else "Collecte indisponible : droits de lecture sur V$BGPROCESS/V$PROCESS requis",
                    "blue"),
            _metric("Empreinte mémoire",
                    _format_bytes(system_memory) if system_memory is not None else "—",
                    "PGA allouée aux processus système · V$PROCESS.PGA_ALLOC_MEM" if system_processes_available else "Collecte mémoire des processus système indisponible",
                    "blue"),
            _metric("Processus essentiels", essential_value, essential_status,
                    "green" if essential_processes_available and essential_count == len(essential_names)
                    else "red" if essential_processes_available and essential_count == 0
                    else "amber" if essential_processes_available else "blue"),
            _metric("Processus utilisateur",
                    f"{session_count:g}" if session_count is not None else "—",
                    f"Sessions Oracle de type USER · {session_count:g} / {session_limit:g} utilisées" if session_count is not None and session_limit is not None else "Nombre de sessions utilisateur indisponible",
                    "blue"),
            _metric("Sessions utilisées",
                    f"{session_count:g} / {session_limit:g}" if session_count is not None and session_limit is not None else "—",
                    "V$SESSION / V$PARAMETER.SESSIONS", "blue"),
            _metric("Pic de processus", process.get("max_utilization", "—"), "Maximum depuis le démarrage", "blue"),
        ]
    if domain == "logging":
        database = _fetch_one(connection, "SELECT log_mode FROM v$database")
        redo = _fetch_one(connection, """
            SELECT COUNT(*) AS groups_count, SUM(bytes) AS bytes_total FROM v$log
        """)
        undo = _fetch_one(connection, "SELECT value FROM v$parameter WHERE name = 'undo_retention'")
        return [
            _metric("Mode Archivelog", database.get("log_mode", "—"), "V$DATABASE.LOG_MODE", "green"),
            _metric("Groupes REDO", redo.get("groups_count", "—"), "V$LOG", "blue"),
            _metric("Taille REDO", f"{int(redo.get('bytes_total') or 0) / 1024 / 1024:.0f} MB", "Taille cumulée", "blue"),
            _metric("Rétention UNDO", f"{undo.get('value', '—')} s", "V$PARAMETER", "blue"),
            *_undo_metrics(connection),
        ]
    if domain == "waits":
        row = _fetch_one(connection, """
            SELECT COUNT(*) AS waiting_sessions FROM v$session
            WHERE state = 'WAITING' AND wait_class <> 'Idle'
        """)
        events = _fetch_one(connection, """
            SELECT COUNT(*) AS event_count FROM v$system_event WHERE wait_class <> 'Idle'
        """)
        return [
            _metric("Sessions en attente", row.get("waiting_sessions", "—"), "Sessions non inactives", "blue"),
            _metric("Événements mesurés", events.get("event_count", "—"), "V$SYSTEM_EVENT", "blue"),
        ]
    if domain == "locks":
        row = _fetch_one(connection, """
            SELECT COUNT(DISTINCT blocking_session) AS blockers,
                   COUNT(*) AS waiting_sessions
            FROM v$session WHERE blocking_session IS NOT NULL
        """)
        return [
            _metric("Sessions bloquantes", row.get("blockers", "—"), "V$SESSION.BLOCKING_SESSION", "blue"),
            _metric("Sessions bloquées", row.get("waiting_sessions", "—"), "Sessions avec bloqueur déclaré", "blue"),
        ]
    if domain == "jobs":
        row = _fetch_one(connection, """
            SELECT COUNT(*) AS total_jobs,
                   NVL(SUM(CASE WHEN enabled = 'TRUE' THEN 1 ELSE 0 END), 0) AS enabled_jobs
            FROM user_scheduler_jobs
        """)
        return [
            _metric("Jobs utilisateur", row.get("total_jobs", "—"), "USER_SCHEDULER_JOBS", "blue"),
            _metric("Jobs actifs", row.get("enabled_jobs", "—"), "État ENABLED", "blue"),
        ]
    if domain == "files":
        datafiles = _fetch_one(connection, "SELECT COUNT(*) AS file_count FROM v$datafile")
        controlfiles = _fetch_one(connection, "SELECT COUNT(*) AS file_count FROM v$controlfile")
        redologs = _fetch_one(connection, "SELECT COUNT(*) AS file_count FROM v$logfile")
        return [
            _metric("Data Files", datafiles.get("file_count", "—"), "V$DATAFILE", "blue"),
            _metric("Control Files", controlfiles.get("file_count", "—"), "V$CONTROLFILE", "blue"),
            _metric("Fichiers REDO", redologs.get("file_count", "—"), "V$LOGFILE", "blue"),
        ]
    if domain == "objects":
        rows = _fetch_all(connection, """
            SELECT object_type, COUNT(*) AS object_count
            FROM user_objects GROUP BY object_type ORDER BY object_type
        """)
        total = sum(int(row["object_count"] or 0) for row in rows)
        return [
            _metric("Objets du schéma", total, "USER_OBJECTS", "blue"),
            *[_metric(str(row["object_type"]), row["object_count"], "Objets du schéma connecté", "blue")
              for row in rows[:8]],
        ]
    if domain == "backups":
        row = _fetch_one(connection, """
            SELECT COUNT(*) AS backup_count,
                   MAX(completion_time) AS last_backup
            FROM v$backup_set_details
        """)
        return [
            _metric("Jeux de sauvegarde", row.get("backup_count", "—"), "V$BACKUP_SET_DETAILS", "blue"),
            _metric("Dernière sauvegarde", row.get("last_backup") or "Aucune donnée",
                    "Horodatage fourni par Oracle", "blue"),
        ]
    if domain == "oracle-alerts":
        row = _fetch_one(connection, """
            SELECT COUNT(*) AS alert_count, MAX(originating_timestamp) AS latest_alert
            FROM v$diag_alert_ext WHERE originating_timestamp >= SYSTIMESTAMP - INTERVAL '24' HOUR
        """)
        return [
            _metric("Occurrences alert.log (24 h)", row.get("alert_count", "—"),
                    "Occurrences brutes de V$DIAG_ALERT_EXT", "blue"),
            _metric("Dernière occurrence", row.get("latest_alert") or "Aucune donnée",
                    "Horodatage fourni par Oracle", "blue"),
        ]
    if domain == "security":
        row = _fetch_one(connection, """
            SELECT COUNT(*) AS account_count,
                   SUM(CASE WHEN account_status <> 'OPEN' THEN 1 ELSE 0 END) AS non_open
            FROM user_users
        """)
        return [
            _metric("Comptes visibles", row.get("account_count", "—"), "USER_USERS", "blue"),
            _metric("Comptes non ouverts", row.get("non_open", "—"), "État différent de OPEN", "blue"),
        ]
    if domain == "licenses":
        row = _fetch_one(connection, "SELECT COUNT(*) AS option_count FROM v$option WHERE value = 'TRUE'")
        return [_metric("Options activées", row.get("option_count", "—"), "V$OPTION — validation contractuelle requise", "blue")]
    if domain == "recommendations":
        tablespaces = _read_capacity(connection)
        count = sum(float(row["used_percent"]) >= 90 for row in tablespaces)
        return [
            _metric("Tablespaces à examiner", count, "Seuil technique : 90 % · calcul physique", "blue"),
            _metric("Conseil", "Valider les constats", "La collecte ne remplace pas une revue DBA", "blue"),
        ]
    raise HTTPException(status_code=404, detail="Domaine de supervision inconnu.")


# ============================================================================
# Scores Deynao — calcul à partir des métriques Oracle réelles
# ============================================================================

_DOMAIN_TONE_WEIGHTS = {"green": 0, "blue": 0, "amber": 25, "red": 50}

_domain_scores: dict[str, dict[str, Any]] = {}


def _tone_penalty(tone: str) -> int:
    return _DOMAIN_TONE_WEIGHTS.get(tone, 0)


def _parse_percent(value: Any) -> float | None:
    if value is None or value == "—":
        return None
    try:
        text = str(value).replace("%", "").replace(",", ".").strip()
        return float(text)
    except (TypeError, ValueError):
        return None


def _parse_count(value: Any) -> int | None:
    if value is None or value == "—":
        return None
    try:
        text = str(value).split("/")[0].strip()
        return int(float(text))
    except (TypeError, ValueError):
        return None


def _finalize_score(score: int, details: list[str], domain: str) -> dict[str, Any]:
    score = max(0, min(100, score))
    if score >= 90:
        label, tone = "Excellent", "green"
    elif score >= 75:
        label, tone = "Bon", "blue"
    elif score >= 55:
        label, tone = "Attention", "amber"
    else:
        label, tone = "Critique", "red"
    return {
        "domain": domain,
        "score": score,
        "label": label,
        "tone": tone,
        "details": details,
    }


def _score_overview(metrics: list[dict[str, str]]) -> dict[str, Any]:
    score = 100
    details: list[str] = []
    labels = {m["label"]: m for m in metrics}
    sessions = labels.get("Sessions")
    if sessions:
        parts = str(sessions["value"]).split("/")
        if len(parts) == 2:
            try:
                used = int(float(parts[0])); total = int(float(parts[1]))
                if total > 0 and used / total > 0.85:
                    score -= 20
                    details.append("Sessions à plus de 85 %")
                elif total > 0 and used / total > 0.70:
                    score -= 10
                    details.append("Sessions à plus de 70 %")
            except ValueError:
                pass
    tablespaces = labels.get("Tablespaces")
    if tablespaces:
        foot = str(tablespaces.get("foot", ""))
        m = re.search(r"([0-9.]+)%", foot)
        if m:
            pct = float(m.group(1))
            if pct > 90:
                score -= 25
                details.append("Utilisation tablespaces > 90 %")
            elif pct > 75:
                score -= 10
                details.append("Utilisation tablespaces > 75 %")
    archivelog = labels.get("Mode Archivelog")
    if archivelog and str(archivelog["value"]).upper() != "ARCHIVELOG":
        score -= 15
        details.append("Mode non-ARCHIVELOG")
    return _finalize_score(score, details, "overview")


def _score_performance(metrics: list[dict[str, str]]) -> dict[str, Any]:
    score = 100
    details: list[str] = []
    labels = {m["label"]: m for m in metrics}
    sga = labels.get("Utilisation SGA")
    if sga:
        pct = _parse_percent(sga["value"])
        if pct is not None:
            if pct > 95:
                score -= 25
                details.append("SGA > 95 %")
            elif pct > 85:
                score -= 12
                details.append("SGA > 85 %")
    pga = labels.get("Utilisation PGA")
    if pga:
        pct = _parse_percent(pga["value"])
        if pct is not None:
            if pct > 90:
                score -= 20
                details.append("PGA > 90 %")
            elif pct > 75:
                score -= 10
                details.append("PGA > 75 %")
    cpu = labels.get("CPU système")
    if cpu:
        pct = _parse_percent(cpu["value"])
        if pct is not None:
            if pct > 80:
                score -= 20
                details.append("CPU > 80 %")
            elif pct > 60:
                score -= 10
                details.append("CPU > 60 %")
    cache = labels.get("Cache Hit Ratio")
    if cache:
        pct = _parse_percent(cache["value"])
        if pct is not None:
            if pct < 85:
                score -= 20
                details.append("Cache Hit Ratio < 85 %")
            elif pct < 95:
                score -= 8
                details.append("Cache Hit Ratio < 95 %")
    return _finalize_score(score, details, "performance")


def _score_capacity(metrics: list[dict[str, str]]) -> dict[str, Any]:
    score = 100
    details: list[str] = []
    labels = {m["label"]: m for m in metrics}
    watch = labels.get("Tablespaces à surveiller")
    if watch:
        try:
            count = int(str(watch["value"]).strip())
            if count > 0:
                score -= min(30, count * 10)
                details.append(f"{count} tablespace(s) à surveiller")
        except ValueError:
            pass
    total = labels.get("Utilisation totale")
    if total:
        pct = _parse_percent(total["value"])
        if pct is not None:
            if pct > 90:
                score -= 25
                details.append("Utilisation totale > 90 %")
            elif pct > 75:
                score -= 12
                details.append("Utilisation totale > 75 %")
    autoextend = labels.get("Protection autoextend")
    if autoextend:
        val = str(autoextend["value"])
        if "/" in val:
            parts = val.split("/")
            try:
                cur = int(parts[0]); tot = int(parts[1])
                if cur < tot:
                    score -= 15
                    details.append("Autoextend incomplet")
            except ValueError:
                pass
    free = labels.get("Espace libre")
    if free:
        foot = str(free.get("foot", ""))
        m = re.search(r"([0-9.]+)%", foot)
        if m:
            pct = float(m.group(1))
            if pct < 5:
                score -= 20
                details.append("Espace libre < 5 %")
            elif pct < 15:
                score -= 10
                details.append("Espace libre < 15 %")
    return _finalize_score(score, details, "capacity")


def _score_processes(metrics: list[dict[str, str]]) -> dict[str, Any]:
    score = 100
    details: list[str] = []
    labels = {m["label"]: m for m in metrics}
    essentials = labels.get("Processus essentiels")
    if essentials:
        val = str(essentials["value"])
        m = re.match(r"(\d+)\s*/\s*(\d+)", val)
        if m:
            running = int(m.group(1)); total = int(m.group(2))
            if running < total:
                score -= (total - running) * 15
                details.append(f"{total - running} processus essentiel(s) absent(s)")
    slots = labels.get("Slots processus")
    if slots:
        foot = str(slots.get("foot", ""))
        m = re.search(r"([0-9.]+)%", foot)
        if m:
            pct = float(m.group(1))
            if pct > 90:
                score -= 15
                details.append("Slots processus > 90 %")
    memory = labels.get("Empreinte mémoire")
    if memory:
        foot = str(memory.get("foot", ""))
        m = re.search(r"([0-9.]+)%", foot)
        if m:
            pct = float(m.group(1))
            if pct > 90:
                score -= 15
                details.append("Mémoire processus > 90 % du PGA target")
    return _finalize_score(score, details, "processes")


def _score_logging(metrics: list[dict[str, str]]) -> dict[str, Any]:
    score = 100
    details: list[str] = []
    labels = {m["label"]: m for m in metrics}
    archivelog = labels.get("Mode Archivelog")
    if archivelog and str(archivelog["value"]).upper() != "ARCHIVELOG":
        score -= 30
        details.append("Mode non-ARCHIVELOG")
    redo = labels.get("Groupes REDO")
    if redo:
        try:
            count = int(str(redo["value"]))
            if count < 3:
                score -= (3 - count) * 10
                details.append(f"{count} groupe(s) REDO (recommandé ≥ 3)")
        except ValueError:
            pass
    undo = labels.get("Rétention UNDO")
    if undo:
        try:
            val = str(undo["value"]).replace(" s", "")
            sec = int(val)
            if sec < 900:
                score -= 10
                details.append("Rétention UNDO < 15 min")
        except ValueError:
            pass
    saturation = labels.get("Erreurs saturation UNDO")
    if saturation:
        try:
            if int(str(saturation["value"])) > 0:
                score -= 15
                details.append("Erreurs de saturation UNDO sur 24 h")
        except ValueError:
            pass
    return _finalize_score(score, details, "logging")


def _score_waits(metrics: list[dict[str, str]]) -> dict[str, Any]:
    score = 100
    details: list[str] = []
    labels = {m["label"]: m for m in metrics}
    waiting = labels.get("Sessions en attente")
    if waiting:
        try:
            count = int(str(waiting["value"]))
            if count > 10:
                score -= 25
                details.append(f"{count} sessions en attente")
            elif count > 0:
                score -= count * 3
                details.append(f"{count} session(s) en attente")
        except ValueError:
            pass
    return _finalize_score(score, details, "waits")


def _score_locks(metrics: list[dict[str, str]]) -> dict[str, Any]:
    score = 100
    details: list[str] = []
    labels = {m["label"]: m for m in metrics}
    blockers = labels.get("Sessions bloquantes")
    if blockers:
        try:
            count = int(str(blockers["value"]))
            if count > 0:
                score -= min(40, count * 10)
                details.append(f"{count} session(s) bloquante(s)")
        except ValueError:
            pass
    waiting = labels.get("Sessions bloquées")
    if waiting:
        try:
            count = int(str(waiting["value"]))
            if count > 0:
                score -= min(30, count * 5)
                details.append(f"{count} session(s) bloquée(s)")
        except ValueError:
            pass
    return _finalize_score(score, details, "locks")


def _score_jobs(metrics: list[dict[str, str]]) -> dict[str, Any]:
    score = 100
    details: list[str] = []
    labels = {m["label"]: m for m in metrics}
    total = labels.get("Jobs utilisateur")
    enabled = labels.get("Jobs actifs")
    if total and enabled:
        try:
            t = int(str(total["value"]))
            e = int(str(enabled["value"]))
            if t > 0 and e < t:
                score -= min(30, (t - e) * 10)
                details.append(f"{t - e} job(s) désactivé(s)")
        except ValueError:
            pass
    return _finalize_score(score, details, "jobs")


def _score_files(metrics: list[dict[str, str]]) -> dict[str, Any]:
    score = 100
    details: list[str] = []
    labels = {m["label"]: m for m in metrics}
    control = labels.get("Control Files")
    if control:
        try:
            count = int(str(control["value"]))
            if count < 3:
                score -= (3 - count) * 10
                details.append(f"{count} control file(s) (recommandé ≥ 3)")
        except ValueError:
            pass
    redologs = labels.get("Fichiers REDO")
    if redologs:
        try:
            count = int(str(redologs["value"]))
            if count < 3:
                score -= (3 - count) * 8
                details.append(f"{count} fichier(s) REDO (recommandé ≥ 3)")
        except ValueError:
            pass
    datafiles = labels.get("Data Files")
    if datafiles:
        try:
            count = int(str(datafiles["value"]))
            if count == 0:
                score -= 40
                details.append("Aucun datafile")
        except ValueError:
            pass
    return _finalize_score(score, details, "files")


def _score_objects(metrics: list[dict[str, str]]) -> dict[str, Any]:
    return _finalize_score(95, [], "objects")


def _score_backups(metrics: list[dict[str, str]]) -> dict[str, Any]:
    score = 100
    details: list[str] = []
    labels = {m["label"]: m for m in metrics}
    count = labels.get("Jeux de sauvegarde")
    last = labels.get("Dernière sauvegarde")
    if count:
        try:
            c = int(str(count["value"]))
            if c == 0:
                score -= 40
                details.append("Aucun jeu de sauvegarde")
        except ValueError:
            pass
    if last and str(last["value"]) in ("Aucune donnée", "—"):
        score -= 20
        details.append("Aucune sauvegarde récente")
    return _finalize_score(score, details, "backups")


def _score_oracle_alerts(metrics: list[dict[str, str]]) -> dict[str, Any]:
    score = 100
    details: list[str] = []
    labels = {m["label"]: m for m in metrics}
    alerts = labels.get("Occurrences alert.log (24 h)")
    if alerts:
        try:
            c = int(str(alerts["value"]))
            if c > 50:
                score -= 25
                details.append(f"{c} alertes alert.log (24 h)")
            elif c > 10:
                score -= 10
                details.append(f"{c} alertes alert.log (24 h)")
        except ValueError:
            pass
    return _finalize_score(score, details, "oracle-alerts")


def _score_security(metrics: list[dict[str, str]]) -> dict[str, Any]:
    score = 100
    details: list[str] = []
    labels = {m["label"]: m for m in metrics}
    non_open = labels.get("Comptes non ouverts")
    if non_open:
        try:
            c = int(str(non_open["value"]))
            if c > 0:
                score -= min(30, c * 5)
                details.append(f"{c} compte(s) non ouvert(s)")
        except ValueError:
            pass
    return _finalize_score(score, details, "security")


def _score_licenses(metrics: list[dict[str, str]]) -> dict[str, Any]:
    return _finalize_score(80, ["Validation contractuelle requise"], "licenses")


def _score_recommendations(metrics: list[dict[str, str]]) -> dict[str, Any]:
    score = 100
    details: list[str] = []
    labels = {m["label"]: m for m in metrics}
    review = labels.get("Tablespaces à examiner")
    if review:
        try:
            c = int(str(review["value"]))
            if c > 0:
                score -= min(40, c * 15)
                details.append(f"{c} tablespace(s) à examiner")
        except ValueError:
            pass
    return _finalize_score(score, details, "recommendations")


DOMAIN_SCORERS = {
    "overview": _score_overview,
    "performance": _score_performance,
    "capacity": _score_capacity,
    "processes": _score_processes,
    "logging": _score_logging,
    "waits": _score_waits,
    "locks": _score_locks,
    "jobs": _score_jobs,
    "files": _score_files,
    "objects": _score_objects,
    "backups": _score_backups,
    "oracle-alerts": _score_oracle_alerts,
    "security": _score_security,
    "licenses": _score_licenses,
    "recommendations": _score_recommendations,
}

DOMAIN_WEIGHTS = {
    "overview": 10,
    "performance": 15,
    "capacity": 15,
    "processes": 10,
    "logging": 8,
    "waits": 8,
    "locks": 8,
    "jobs": 5,
    "files": 6,
    "objects": 4,
    "backups": 6,
    "oracle-alerts": 5,
    "security": 5,
    "licenses": 4,
    "recommendations": 4,
}


def _calculate_domain_score(domain: str, metrics: list[dict[str, str]]) -> dict[str, Any]:
    scorer = DOMAIN_SCORERS.get(domain)
    if scorer is None:
        return {"domain": domain, "score": None, "label": "—", "tone": "blue", "details": []}
    result = scorer(metrics)
    with _lock:
        _domain_scores[domain] = result
    return result


def _calculate_global_score() -> dict[str, Any]:
    with _lock:
        scores = dict(_domain_scores)
    if not scores:
        return {"score": None, "label": "—", "tone": "blue", "breakdown": [], "details": ["Aucune donnée de collecte"]}
    total_weight = 0
    weighted_sum = 0.0
    breakdown: list[dict[str, Any]] = []
    critical_domains: list[str] = []
    good_domains: list[str] = []
    excellent_domains: list[str] = []
    all_details: list[str] = []
    for domain, weight in DOMAIN_WEIGHTS.items():
        entry = scores.get(domain)
        if entry and entry.get("score") is not None:
            weighted_sum += entry["score"] * weight
            total_weight += weight
            breakdown.append({
                "domain": domain,
                "score": entry["score"],
                "label": entry["label"],
                "tone": entry["tone"],
                "weight": weight,
            })
            if entry["tone"] == "red":
                critical_domains.append(domain)
            elif entry["tone"] == "green":
                excellent_domains.append(domain)
            else:
                good_domains.append(domain)
            all_details.extend(entry.get("details", []))
    if total_weight == 0:
        return {"score": None, "label": "—", "tone": "blue", "breakdown": [], "details": ["Aucun score disponible"]}
    global_score = round(weighted_sum / total_weight)
    if global_score >= 90:
        label, tone = "Excellent", "green"
    elif global_score >= 75:
        label, tone = "Bon", "blue"
    elif global_score >= 55:
        label, tone = "Attention", "amber"
    else:
        label, tone = "Critique", "red"
    return {
        "score": global_score,
        "label": label,
        "tone": tone,
        "breakdown": breakdown,
        "critical_count": len(critical_domains),
        "good_count": len(good_domains),
        "excellent_count": len(excellent_domains),
        "critical_domains": critical_domains,
        "details": all_details[:10],
    }


@app.get("/api/dashboard/{domain}")
def dashboard(domain: str) -> dict[str, Any]:
    with _lock:
        config = _oracle
    if config is None:
        raise HTTPException(status_code=409, detail="Aucune connexion Oracle configurée. Les indicateurs affichés sont des exemples.")
    connection = None
    started = time.perf_counter()
    try:
        connection = _connect(config)
        if domain == "capacity":
            tablespaces = _read_capacity(connection)
            capacity_metrics = _capacity_metrics(tablespaces)
            score = _calculate_domain_score(domain, capacity_metrics)
            return {
                "source": "oracle",
                "domain": domain,
                "metrics": capacity_metrics,
                "tablespaces": tablespaces,
                "score": score,
            }
        metrics = _read_domain(connection, domain)
        score = _calculate_domain_score(domain, metrics)
        response: dict[str, Any] = {"source": "oracle", "domain": domain, "metrics": metrics, "score": score}
        if domain == "performance":
            response["cpu"] = _read_performance_cpu(connection)
            response["io"] = _read_performance_io(connection)
        if domain == "processes":
            response.update(_read_system_process_details(connection))
            response.update(_read_user_sessions(connection))
            response["latency_ms"] = max(1, round((time.perf_counter() - started) * 1000))
        return response
    except HTTPException:
        raise
    except oracledb.Error as exc:
        logger.exception("Collecte Oracle impossible pour le domaine %s", domain)
        raise HTTPException(
            status_code=502,
            detail=f"Collecte Oracle impossible pour « {domain} ». Vérifiez les privilèges de lecture nécessaires aux vues Oracle.",
        ) from exc
    finally:
        if connection is not None:
            connection.close()


@app.get("/api/scores")
def scores() -> dict[str, Any]:
    """Retourne le score global Deynao et le détail par domaine."""
    global_score = _calculate_global_score()
    with _lock:
        domain_scores = {d: dict(s) for d, s in _domain_scores.items()}
    return {
        "global": global_score,
        "domains": domain_scores,
    }
