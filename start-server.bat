@echo off
cd /d "%~dp0"
call .venv-py313\Scripts\activate.bat
python -m uvicorn server:app --host 127.0.0.1 --port 8001
pause