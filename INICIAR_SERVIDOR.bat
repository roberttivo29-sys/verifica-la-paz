@echo off
chcp 65001 >nul
title Servidor - Verifica La Paz
color 0B

echo ============================================================
echo   INICIANDO SERVIDOR - VERIFICA LA PAZ
echo ============================================================
echo.

:: Verificar si Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo [ERROR] Python no está instalado
    echo Ejecuta primero: INSTALAR_DEPENDENCIAS.bat
    echo.
    pause
    exit /b 1
)

:: Verificar si Flask está instalado
python -c "import flask" >nul 2>&1
if errorlevel 1 (
    color 0C
    echo [ERROR] Flask no está instalado
    echo Ejecuta primero: INSTALAR_DEPENDENCIAS.bat
    echo.
    pause
    exit /b 1
)

:: Verificar que app.py existe
if not exist "backend\app.py" (
    color 0C
    echo [ERROR] No se encontró backend\app.py
    echo Verifica que el archivo existe en la carpeta backend
    echo.
    pause
    exit /b 1
)

echo [OK] Verificando dependencias...
echo [OK] Python detectado
echo [OK] Flask instalado
echo [OK] app.py encontrado
echo.
echo ------------------------------------------------------------
echo   Iniciando servidor en http://localhost:5000
echo ------------------------------------------------------------
echo.
echo Presiona Ctrl+C para detener el servidor
echo.
echo Abre tu navegador en:
echo   - Web pública: http://localhost:5000
echo   - Panel Admin: http://localhost:5000/admin
echo.

:: Iniciar servidor
cd /d "%~dp0"
python backend/app.py

:: Si el servidor se detiene
echo.
echo ------------------------------------------------------------
echo   El servidor se ha detenido
echo ------------------------------------------------------------
pause