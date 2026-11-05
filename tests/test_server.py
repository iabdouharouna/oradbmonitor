from __future__ import annotations

from typing import Any

import pytest
from fastapi.testclient import TestClient

import server


class FakeOracleError(Exception):
    pass


class FakeCursor:
    description: list[tuple[str]] = []
    rows: list[tuple[Any, ...]] = []

    def __enter__(self) -> "FakeCursor":
        return self

    def __exit__(self, *_: Any) -> None:
        return None

    def execute(self, query: str) -> None:
        normalized = " ".join(query.lower().split())
        if normalized == "select 1 from dual":
            self.description = [("1",)]
            self.rows = [(1,)]
        elif normalized == "select log_mode from v$database":
            self.description = [("log_mode",)]
            self.rows = [("ARCHIVELOG",)]
        elif "from v$log" in normalized and "groups_count" in normalized:
            self.description = [("groups_count",), ("bytes_total",)]
            self.rows = [(3, 600 * 1024**2)]
        elif "from v$parameter where name = 'undo_retention'" in normalized:
            self.description = [("value",)]
            self.rows = [("900",)]
        elif "from v$parameter" in normalized and "'undo_management'" in normalized:
            self.description = [("name",), ("value",)]
            self.rows = [("undo_management", "AUTO"), ("undo_tablespace", "UNDOTBS1")]
        elif "from dba_data_files where tablespace_name = 'undotbs1'" in normalized:
            self.description = [
                ("file_count",), ("total_bytes",), ("max_bytes",),
                ("autoextend_count",), ("first_file",),
            ]
            self.rows = [(1, 210 * 1024**2, 32 * 1024**4, 1, "/u01/oradata/FREE/undotbs01.dbf")]
        elif "from dba_undo_extents" in normalized:
            self.description = [("used_bytes",)]
            self.rows = [(26 * 1024**2,)]
        elif "from dba_rollback_segs" in normalized:
            self.description = [("segment_count",)]
            self.rows = [(10,)]
        elif "from v$undostat" in normalized:
            self.description = [("nospace_errors",), ("snapshot_errors",)]
            self.rows = [(0, 0)]
        elif "from v$parameter" in normalized and "'sga_target'" in normalized:
            self.description = [("name",), ("value",)]
            self.rows = [
                ("sga_target", str(1000 * 1024**2)),
                ("pga_aggregate_target", str(512 * 1024**2)),
            ]
        elif "from v$sgastat where name = 'free memory'" in normalized:
            self.description = [("free_bytes",)]
            self.rows = [(100 * 1024**2,)]
        elif "from v$pgastat where name = 'total pga allocated'" in normalized:
            self.description = [("value",)]
            self.rows = [(10 * 1024**2,)]
        elif "from v$sysmetric_history" in normalized:
            self.description = [("value",)]
            self.rows = [(0,)]
        elif "from v$osstat" in normalized:
            if "'num_cpus'" in normalized:
                self.description = [("value",)]
                self.rows = [(2,)]
            else:
                self.description = [("busy_time",), ("idle_time",)]
                self.rows = [(409, 9591)]
        elif "from v$system_wait_class" in normalized:
            self.description = [("wait_class",), ("time_waited_micro",)]
            self.rows = [
                ("User I/O", 656),
                ("Commit", 162),
                ("Application", 101),
                ("System I/O", 44),
                ("Scheduler", 20),
                ("Concurrency", 9),
                ("Idle", 999999),
            ]
        elif "from v$sysstat" in normalized and "'db block gets'" in normalized:
            self.description = [("name",), ("value",)]
            self.rows = [
                ("db block gets", 500_000),
                ("consistent gets", 4_006_593),
                ("physical reads", 454_280),
                ("physical writes", 1_100),
            ]
        elif "from v$librarycache" in normalized:
            self.description = [("pins",), ("hits",), ("reloads",)]
            self.rows = [(628_351, 594_717, 1_673)]
        elif "from v$segment_statistics" in normalized:
            self.description = [
                ("owner",), ("object_name",), ("subobject_name",),
                ("physical_reads",), ("physical_writes",),
            ]
            self.rows = [("AUD$UNIFIED", "AUDSYS.TABLE PARTITION", "SYSAUX", 3_000, 8)]
        elif "join v$sesstat ss" in normalized:
            self.description = [
                ("sid",), ("serial_number",), ("username",), ("status",), ("sql_id",),
                ("cpu_centiseconds",), ("sql_text",),
            ]
            self.rows = [(12, 4, "MONITOR", "ACTIVE", "abc123", 125, "select 1 from dual")]
        elif "from v$sqlarea" in normalized and "cpu_per_execution" in normalized:
            self.description = [
                ("sql_id",), ("executions",), ("cpu_time",), ("cpu_per_execution",), ("sql_text",),
            ]
            self.rows = [("abc123", 5, 2_500_000, 500_000, "select 1 from dual")]
        elif "from v$sysmetric" in normalized and "metric_unit" in normalized:
            self.description = [("metric_name",), ("value",), ("metric_unit",)]
            self.rows = [
                ("Average Active Sessions", 0.5, "sessions"),
                ("Database CPU Time Ratio", 65.0, "%"),
                ("Database Wait Time Ratio", 35.0, "%"),
                ("Database Time Per Sec", 0.5, "centiseconds per second"),
                ("SQL Service Response Time", 1200, "microseconds"),
                ("CPU Usage Per Sec", 50, "centiseconds per second"),
            ]
        elif "from v$sysmetric" in normalized:
            self.description = [("metric_name",), ("value",)]
            self.rows = [("Buffer Cache Hit Ratio", 97.46)]
        elif "as session_count from v$session" in normalized:
            self.description = [("session_count",)]
            self.rows = [(3,)]
        elif "as excluded_count" in normalized and "from v$session" in normalized:
            self.description = [("excluded_count",)]
            self.rows = [(3,)]
        elif "from v$session s left join v$process p" in normalized:
            self.description = [
                ("username",), ("program",), ("status",), ("machine",),
                ("sid",), ("serial_number",), ("memory_bytes",), ("duration_seconds",),
            ]
            self.rows = [
                ("SYS", "SQL Developer", "INACTIVE", "DISI-LPT4218", 12, 4, 4 * 1024**2, 16500),
                ("APPUSER", "JDBC Thin Client", "ACTIVE", "app-host", 13, 5, 8 * 1024**2, 60),
            ]
        elif "from v$session where type = 'user'" in normalized:
            self.description = [("total_sessions",), ("active_sessions",)]
            self.rows = [(8, 2)]
        elif "from dba_data_files d" in normalized:
            self.description = [
                ("tablespace_name",), ("allocated_bytes",), ("used_bytes",),
                ("autoextend_count",), ("autoextend_available_bytes",), ("tablespace_type",),
            ]
            self.rows = [
                ("SYSTEM", 100 * 1024**2, 99 * 1024**2, 1, 200 * 1024**2, "PERMANENT"),
                ("USERS", 100 * 1024**2, 80 * 1024**2, 0, 0, "PERMANENT"),
            ]
        elif "from user_scheduler_jobs" in normalized:
            self.description = [("total_jobs",), ("enabled_jobs",)]
            self.rows = [(0, 0)]
        elif "from v$resource_limit" in normalized:
            self.description = [("resource_name",), ("max_utilization",)]
            self.rows = [("PROCESSES", 110), ("SESSIONS", 20)]
        elif "from v$bgprocess b join v$process" in normalized:
            self.description = [("process_count",), ("memory_bytes",)]
            self.rows = [(12, 111 * 1024**2)]
        elif "b.description" in normalized and "from v$bgprocess b left join v$process" in normalized:
            self.description = [("name",), ("description",), ("memory_bytes",), ("is_running",)]
            self.rows = [
                ("PMON", "process monitor", 1363148, 1),
                ("SMON", "system monitor", 2936012, 1),
                ("LGWR", "log writer", 2202009, 1),
                ("DBW0", "database writer", 9437184, 1),
                ("CKPT", "checkpoint", 1887436, 1),
                ("MMON", "manageability monitor", 5767168, 1),
                ("MMNL", "manageability monitor lite", 1572864, 1),
                ("RECO", "recoverer", 2516582, 1),
                ("DBW1", "database writer 1", 0, 0),
            ]
        elif "from v$bgprocess b left join v$process" in normalized:
            self.description = [("name",), ("is_running",)]
            self.rows = [
                ("PMON", 1), ("SMON", 1), ("LGWR", 1), ("DBW0", 1), ("CKPT", 1),
            ]
        elif "sysdate - startup_time" in normalized:
            self.description = [("uptime_seconds",)]
            self.rows = [(28680,)]
        elif "from v$process" in normalized:
            self.description = [("process_count",)]
            self.rows = [(92,)]
        elif "from v$parameter" in normalized and "'processes'" in normalized:
            self.description = [("name",), ("value",)]
            self.rows = [("processes", "200"), ("sessions", "322")]
        elif "from v$database d cross join v$instance i" in normalized:
            self.description = [(name,) for name in (
                "database_name", "open_mode", "log_mode", "version", "host_name", "startup_time",
            )]
            self.rows = [("TESTDB", "READ WRITE", "ARCHIVELOG", "19.0.0.0", "db-host", "2026-11-02")]
        elif "from dba_tablespace_usage_metrics" in normalized:
            self.description = [("tablespace_count",), ("max_used_percent",)]
            self.rows = [(4, 76.5)]
        else:
            raise AssertionError(f"Unexpected test query: {query}")

    def fetchone(self) -> tuple[int]:
        return self.rows[0]

    def fetchall(self) -> list[tuple[Any, ...]]:
        return self.rows


class FakeConnection:
    closed = False

    def cursor(self) -> FakeCursor:
        return FakeCursor()

    def close(self) -> None:
        self.closed = True


class FakeOracleDriver:
    __version__ = "test-driver"
    AUTH_MODE_SYSDBA = 2
    Error = FakeOracleError
    last_connect: dict[str, Any] = {}

    @staticmethod
    def makedsn(host: str, port: int, service_name: str) -> str:
        return f"{host}:{port}/{service_name}"

    @classmethod
    def connect(cls, **kwargs: Any) -> FakeConnection:
        cls.last_connect = kwargs
        return FakeConnection()


@pytest.fixture
def client(monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setattr(server, "oracledb", FakeOracleDriver)
    monkeypatch.setattr(server, "_oracle", None)
    server._transaction_samples.clear()
    with TestClient(server.app) as test_client:
        yield test_client
    server._oracle = None
    server._transaction_samples.clear()


def connection_payload(**overrides: Any) -> dict[str, Any]:
    return {
        "host": "oracle.example.test",
        "port": 1521,
        "service": "FREEPDB1",
        "username": "monitor",
        "password": "test-only-secret",
        "environment": "TEST",
        **overrides,
    }


def test_status_is_unconfigured_without_database(client: TestClient) -> None:
    response = client.get("/api/status")
    assert response.status_code == 200
    assert response.json()["connected"] is False


def test_dashboard_refuses_to_present_examples_as_live_data(client: TestClient) -> None:
    response = client.get("/api/dashboard/performance")
    assert response.status_code == 409
    assert "Aucune connexion Oracle" in response.json()["detail"]


def test_invalid_service_is_rejected(client: TestClient) -> None:
    response = client.post("/api/test-connection", json=connection_payload(service="FREE PDB"))
    assert response.status_code == 422


def test_test_connection_does_not_save_credentials(client: TestClient) -> None:
    response = client.post("/api/test-connection", json=connection_payload(sysdba=True))
    assert response.status_code == 200
    assert response.json() == {"ok": True, "local_only": False, "oracle_driver": True}
    assert FakeOracleDriver.last_connect["mode"] == FakeOracleDriver.AUTH_MODE_SYSDBA
    assert client.get("/api/status").json()["connected"] is False


def test_successful_connection_never_returns_password(client: TestClient) -> None:
    response = client.post("/api/connect", json=connection_payload())
    assert response.status_code == 200
    assert "test-only-secret" not in response.text
    assert response.json()["connected"] is True
    assert client.get("/api/status").json()["connected"] is True

    disconnected = client.post("/api/disconnect")
    assert disconnected.status_code == 200
    assert client.get("/api/status").json()["connected"] is False


def test_overview_returns_values_from_oracle_queries(client: TestClient) -> None:
    client.post("/api/connect", json=connection_payload())

    response = client.get("/api/dashboard/overview")

    assert response.status_code == 200
    metrics = {row["label"]: row["value"] for row in response.json()["metrics"]}
    assert metrics["Base Oracle"] == "TESTDB"
    assert metrics["Version"] == "19.0.0.0"
    assert metrics["Sessions"] == "2 / 8"
    assert metrics["Tablespaces"] == "2"


def test_jobs_with_no_enabled_rows_return_zero(client: TestClient) -> None:
    client.post("/api/connect", json=connection_payload())

    response = client.get("/api/dashboard/jobs")

    assert response.status_code == 200
    metrics = {row["label"]: row["value"] for row in response.json()["metrics"]}
    assert metrics["Jobs utilisateur"] == "0"
    assert metrics["Jobs actifs"] == "0"


def test_process_peak_matches_resource_names_case_insensitively(client: TestClient) -> None:
    client.post("/api/connect", json=connection_payload())

    response = client.get("/api/dashboard/processes")

    assert response.status_code == 200
    metrics = {row["label"]: row["value"] for row in response.json()["metrics"]}
    assert metrics["Pic de processus"] == "110"


def test_process_dashboard_collects_background_processes_memory_and_essentials(client: TestClient) -> None:
    client.post("/api/connect", json=connection_payload())

    response = client.get("/api/dashboard/processes")

    assert response.status_code == 200
    metrics = {row["label"]: row for row in response.json()["metrics"]}
    assert metrics["Processus système"]["value"] == "12"
    assert metrics["Processus système"]["tone"] == "blue"
    assert metrics["Empreinte mémoire"]["value"] == "111.00 MB"
    assert metrics["Processus essentiels"]["value"] == "5/5"
    assert metrics["Processus essentiels"]["tone"] == "green"
    assert "PMON actif" in metrics["Processus essentiels"]["foot"]
    assert metrics["Processus utilisateur"]["value"] == "3"
    assert "3 / 322 utilisées" in metrics["Processus utilisateur"]["foot"]


def test_process_dashboard_exposes_process_details_and_uptime(client: TestClient) -> None:
    client.post("/api/connect", json=connection_payload())

    response = client.get("/api/dashboard/processes")

    assert response.status_code == 200
    body = response.json()
    assert body["processes_available"] is True
    assert body["uptime_seconds"] == 28680
    assert isinstance(body["latency_ms"], int)
    assert body["processes"][0] == {
        "name": "PMON",
        "description": "process monitor",
        "memory_bytes": 1363148,
        "running": True,
    }
    assert all(row["running"] for row in body["processes"])
    assert "DBW1" not in {row["name"] for row in body["processes"]}
    assert body["user_sessions_available"] is True
    assert body["excluded_sessions"] == 3
    assert body["user_sessions"][0] == {
        "username": "SYS",
        "account_label": "Compte Oracle système",
        "program": "SQL Developer",
        "status": "INACTIVE",
        "machine": "DISI-LPT4218",
        "sid": 12,
        "serial_number": 4,
        "memory_bytes": 4 * 1024**2,
        "duration_seconds": 16500,
    }


def test_performance_uses_sga_target_and_free_memory(client: TestClient) -> None:
    client.post("/api/connect", json=connection_payload())

    response = client.get("/api/dashboard/performance")

    assert response.status_code == 200
    metrics = {row["label"]: row["value"] for row in response.json()["metrics"]}
    assert metrics["Utilisation SGA"] == "90.00%"
    assert metrics["Utilisation PGA"] == "1.95%"
    assert metrics["CPU système"] == "4.09%"
    assert metrics["Cache Hit Ratio"] == "97.46%"


def test_performance_cpu_collects_waits_sessions_and_sql(client: TestClient) -> None:
    client.post("/api/connect", json=connection_payload())

    response = client.get("/api/dashboard/performance")

    assert response.status_code == 200
    cpu = response.json()["cpu"]
    assert cpu["metrics"]["aas"] == 0.5
    assert cpu["metrics"]["cpu_count"] == 2
    assert cpu["metrics"]["aas_per_cpu"] == 0.25
    waits = {row["label"]: row["percent"] for row in cpu["waits"]}
    assert waits["User I/O"] == 66.1
    assert waits["Other"] == 4.4
    assert sum(row["time_waited_micro"] for row in cpu["waits"]) == 992
    assert cpu["sessions"][0]["cpu_seconds"] == 1.25
    assert cpu["sessions"][0]["sql_id"] == "abc123"
    assert cpu["sql"][0]["cpu_seconds"] == 2.5
    assert cpu["sql"][0]["cpu_ms_per_execution"] == 500
    assert all(cpu["availability"].values())


def test_performance_io_collects_cache_and_segment_statistics(client: TestClient) -> None:
    client.post("/api/connect", json=connection_payload())

    response = client.get("/api/dashboard/performance")

    assert response.status_code == 200
    io = response.json()["io"]
    assert io["metrics"]["logical_reads"] == 4_506_593
    assert io["metrics"]["physical_reads"] == 454_280
    assert io["metrics"]["physical_writes"] == 1_100
    assert io["metrics"]["buffer_hit_ratio"] == pytest.approx(89.9207, rel=1e-4)
    assert io["metrics"]["saved_reads"] == 4_052_313
    assert io["metrics"]["library_hit_ratio"] == pytest.approx(94.6451, rel=1e-4)
    assert io["metrics"]["library_pins"] == 628_351
    assert io["metrics"]["library_hits"] == 594_717
    assert io["segments"][0]["owner"] == "AUD$UNIFIED"
    assert all(io["availability"].values())


def test_capacity_uses_allocated_tablespace_bytes(client: TestClient) -> None:
    client.post("/api/connect", json=connection_payload())

    response = client.get("/api/dashboard/capacity")

    assert response.status_code == 200
    body = response.json()
    metrics = {row["label"]: row["value"] for row in body["metrics"]}
    assert metrics["Tablespaces à surveiller"] == "1"
    assert metrics["Utilisation totale"] == "89.5%"
    assert metrics["Protection autoextend"] == "1/2"
    assert len(body["tablespaces"]) == 2
    assert body["tablespaces"][0]["type"] == "PERMANENT"
    assert body["tablespaces"][0]["autoextend_available_bytes"] == 200 * 1024**2


def test_capacity_uses_earlier_threshold_for_system_tablespaces() -> None:
    metrics = server._capacity_metrics([
        {"name": "SYSTEM", "allocated_bytes": 100, "used_bytes": 86, "used_percent": 86, "autoextend": True},
        {"name": "SYSAUX", "allocated_bytes": 100, "used_bytes": 84, "used_percent": 84, "autoextend": True},
        {"name": "USERS", "allocated_bytes": 100, "used_bytes": 89, "used_percent": 89, "autoextend": True},
    ])

    assert metrics[0]["value"] == "1"


def test_capacity_does_not_count_temporary_tablespaces_as_warnings() -> None:
    metrics = server._capacity_metrics([
        {"name": "TEMP", "type": "TEMPORARY", "allocated_bytes": 100, "used_bytes": 99, "used_percent": 99, "autoextend": True},
        {"name": "SYSTEM", "type": "PERMANENT", "allocated_bytes": 100, "used_bytes": 80, "used_percent": 80, "autoextend": True},
    ])

    assert metrics[0]["value"] == "0"


def test_transaction_rate_uses_counter_delta_between_samples() -> None:
    server._transaction_samples.clear()

    assert server._transaction_rate("db-1", 100, 10.0) is None
    assert server._transaction_rate("db-1", 110, 12.0) == 5.0
    assert server._transaction_rate("db-1", 105, 14.0) is None


# ---------------------------------------------------------------------------
# Scores Deynao
# ---------------------------------------------------------------------------

def test_score_overview_excellent_when_all_ok() -> None:
    score = server._score_overview([
        {"label": "Sessions", "value": "10 / 100", "foot": "", "tone": "green"},
        {"label": "Tablespaces", "value": "2", "foot": "Utilisation max : 45 %", "tone": "green"},
        {"label": "Mode Archivelog", "value": "ARCHIVELOG", "foot": "", "tone": "green"},
    ])
    assert score["score"] == 100
    assert score["label"] == "Excellent"
    assert score["tone"] == "green"


def test_score_overview_penalized_when_sessions_high() -> None:
    score = server._score_overview([
        {"label": "Sessions", "value": "90 / 100", "foot": "", "tone": "red"},
        {"label": "Tablespaces", "value": "2", "foot": "Utilisation max : 50 %", "tone": "green"},
        {"label": "Mode Archivelog", "value": "ARCHIVELOG", "foot": "", "tone": "green"},
    ])
    assert score["score"] < 100
    assert "Sessions à plus de 85 %" in score["details"]


def test_score_performance_excellent_when_all_green() -> None:
    score = server._score_performance([
        {"label": "Utilisation SGA", "value": "60.0%", "foot": "", "tone": "green"},
        {"label": "Utilisation PGA", "value": "30.0%", "foot": "", "tone": "green"},
        {"label": "CPU système", "value": "20.0%", "foot": "", "tone": "green"},
        {"label": "Cache Hit Ratio", "value": "98.0%", "foot": "", "tone": "green"},
    ])
    assert score["score"] == 100
    assert score["label"] == "Excellent"


def test_score_performance_penalized_when_issues() -> None:
    score = server._score_performance([
        {"label": "Utilisation SGA", "value": "97.0%", "foot": "", "tone": "red"},
        {"label": "Utilisation PGA", "value": "50.0%", "foot": "", "tone": "green"},
        {"label": "CPU système", "value": "30.0%", "foot": "", "tone": "green"},
        {"label": "Cache Hit Ratio", "value": "80.0%", "foot": "", "tone": "amber"},
    ])
    assert score["score"] < 100
    assert any("SGA > 95 %" in d for d in score["details"])
    assert any("Cache Hit Ratio < 85 %" in d for d in score["details"])


def test_score_capacity_penalized_when_high_usage() -> None:
    score = server._score_capacity([
        {"label": "Tablespaces à surveiller", "value": "2", "foot": "", "tone": "amber"},
        {"label": "Utilisation totale", "value": "95.0%", "foot": "", "tone": "red"},
        {"label": "Protection autoextend", "value": "3/5", "foot": "", "tone": "amber"},
        {"label": "Espace libre", "value": "200 MB", "foot": "2.0% disponible", "tone": "red"},
    ])
    assert score["score"] < 100
    assert score["label"] in ("Attention", "Critique")


def test_score_processes_penalized_when_essentials_missing() -> None:
    score = server._score_processes([
        {"label": "Processus essentiels", "value": "3/5", "foot": "PMON · SMON · LGWR", "tone": "red"},
        {"label": "Slots processus", "value": "94 / 200", "foot": "47.0% utilisé", "tone": "green"},
        {"label": "Empreinte mémoire", "value": "324 MB", "foot": "63.4%", "tone": "green"},
    ])
    assert score["score"] < 100
    assert any("processus essentiel" in d for d in score["details"])


def test_score_waits_penalized_when_sessions_waiting() -> None:
    score = server._score_waits([
        {"label": "Sessions en attente", "value": "5", "foot": "", "tone": "amber"},
    ])
    assert score["score"] < 100
    assert score["score"] > 0


def test_score_files_penalized_when_few_control_files() -> None:
    score = server._score_files([
        {"label": "Control Files", "value": "1", "foot": "", "tone": "red"},
        {"label": "Fichiers REDO", "value": "2", "foot": "", "tone": "amber"},
        {"label": "Data Files", "value": "5", "foot": "", "tone": "green"},
    ])
    assert score["score"] < 100


def test_score_security_penalized_when_non_open_accounts() -> None:
    score = server._score_security([
        {"label": "Comptes non ouverts", "value": "3", "foot": "", "tone": "amber"},
    ])
    assert score["score"] < 100
    assert score["score"] >= 70


def test_score_objects_returns_high_default() -> None:
    score = server._score_objects([])
    assert score["score"] == 95
    assert score["label"] == "Excellent"


def test_score_backups_penalized_when_no_backup() -> None:
    score = server._score_backups([
        {"label": "Jeux de sauvegarde", "value": "0", "foot": "", "tone": "red"},
        {"label": "Dernière sauvegarde", "value": "Aucune donnée", "foot": "", "tone": "red"},
    ])
    assert score["score"] < 100


def test_calculate_domain_score_stores_and_returns() -> None:
    server._domain_scores.clear()
    result = server._calculate_domain_score("capacity", [
        {"label": "Tablespaces à surveiller", "value": "0", "foot": "", "tone": "green"},
        {"label": "Utilisation totale", "value": "50.0%", "foot": "", "tone": "green"},
        {"label": "Protection autoextend", "value": "5/5", "foot": "", "tone": "green"},
        {"label": "Espace libre", "value": "500 MB", "foot": "50.0% disponible", "tone": "green"},
    ])
    assert result["score"] == 100
    assert server._domain_scores["capacity"]["score"] == 100


def test_calculate_global_score_returns_none_when_no_data() -> None:
    server._domain_scores.clear()
    result = server._calculate_global_score()
    assert result["score"] is None
    assert result["label"] == "—"


def test_calculate_global_score_aggregates_weighted() -> None:
    server._domain_scores.clear()
    server._domain_scores["overview"] = {"domain": "overview", "score": 90, "label": "Excellent", "tone": "green", "details": []}
    server._domain_scores["performance"] = {"domain": "performance", "score": 50, "label": "Critique", "tone": "red", "details": []}
    server._domain_scores["capacity"] = {"domain": "capacity", "score": 80, "label": "Bon", "tone": "blue", "details": []}

    result = server._calculate_global_score()
    assert result["score"] is not None
    assert 0 <= result["score"] <= 100
    assert result["score"] < 90
    assert result["critical_count"] >= 1
    assert len(result["breakdown"]) == 3


def test_logging_collects_real_undo_tablespace_state(client: TestClient) -> None:
    client.post("/api/connect", json=connection_payload())

    response = client.get("/api/dashboard/logging")

    assert response.status_code == 200
    metrics = {row["label"]: row["value"] for row in response.json()["metrics"]}
    assert metrics["Rétention UNDO"] == "900 s"
    assert metrics["Tablespace UNDO"] == "UNDOTBS1"
    assert metrics["Mode gestion UNDO"] == "AUTO"
    assert metrics["Espace UNDO utilisé"] == str(26 * 1024**2)
    assert metrics["Espace UNDO total"] == str(210 * 1024**2)
    assert metrics["Capacité max UNDO"] == str(32 * 1024**4)
    assert metrics["Fichiers UNDO"] == "1"
    assert metrics["Autoextend UNDO"] == "OUI"
    assert metrics["Chemin UNDO"] == "/u01/oradata/FREE/undotbs01.dbf"
    assert metrics["Segments UNDO actifs"] == "10"
    assert metrics["Erreurs saturation UNDO"] == "0"


def test_undo_metrics_fall_back_when_views_are_unavailable() -> None:
    class BrokenCursor:
        def __enter__(self) -> "BrokenCursor":
            return self

        def __exit__(self, *_: Any) -> None:
            return None

        def execute(self, _query: str) -> None:
            raise FakeOracleError("ORA-00942")

    class BrokenConnection:
        def cursor(self) -> BrokenCursor:
            return BrokenCursor()

    original = server.oracledb
    server.oracledb = FakeOracleDriver
    try:
        metrics = {row["label"]: row["value"] for row in server._undo_metrics(BrokenConnection())}
    finally:
        server.oracledb = original

    assert metrics["Tablespace UNDO"] == "—"
    assert metrics["Espace UNDO total"] == "—"
    assert metrics["Chemin UNDO"] == "—"
    assert metrics["Erreurs saturation UNDO"] == "—"


def test_score_logging_penalized_when_undo_saturation_errors() -> None:
    score = server._score_logging([
        {"label": "Mode Archivelog", "value": "ARCHIVELOG", "foot": "", "tone": "green"},
        {"label": "Groupes REDO", "value": "3", "foot": "", "tone": "blue"},
        {"label": "Rétention UNDO", "value": "900 s", "foot": "", "tone": "blue"},
        {"label": "Erreurs saturation UNDO", "value": "4", "foot": "", "tone": "blue"},
    ])
    assert score["score"] == 85
    assert "Erreurs de saturation UNDO sur 24 h" in score["details"]

