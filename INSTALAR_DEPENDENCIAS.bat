@echo off
chcp 65001 >nul
title Instalador - Verifica La Paz
color 0A

echo ============================================================
echo   INSTALADOR DE DEPENDENCIAS - VERIFICA LA PAZ
echo ============================================================
echo.

:: Verificar si Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo [ERROR] Python no está instalado o no está en el PATH
    echo.
    echo Descarga Python desde: https://www.python.org/downloads/
    echo Asegúrate de marcar "Add Python to PATH" durante la instalación
    echo.
    pause
    exit /b 1
)

echo [OK] Python detectado:
python --version
echo.

:: Verificar si pip está instalado
pip --version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo [ERROR] pip no está instalado
    echo.
    echo Intenta reparar la instalación de Python
    pause
    exit /b 1
)

echo [OK] pip detectado:
pip --version
echo.
echo ------------------------------------------------------------
echo   Instalando dependencias necesarias...
echo ------------------------------------------------------------
echo.

:: Instalar Flask
echo [1/3] Instalando Flask...
pip install flask --quiet
if errorlevel 1 (
    color 0C
    echo [ERROR] No se pudo instalar Flask
    pause
    exit /b 1
)
echo [OK] Flask instalado correctamente
echo.

:: Instalar Werkzeug (dependencia de Flask)
echo [2/3] Verificando Werkzeug...
pip install werkzeug --quiet
if errorlevel 1 (
    color 0C
    echo [ERROR] No se pudo instalar Werkzeug
    pause
    exit /b 1
)
echo [OK] Werkzeug instalado correctamente
echo.

:: Crear directorios necesarios
echo [3/3] Creando estructura de carpetas...
if not exist "backend\uploads\videos" mkdir "backend\uploads\videos"
if not exist "backend\uploads\audios" mkdir "backend\uploads\audios"
if not exist "img" mkdir "img"
echo [OK] Carpetas creadas correctamente
echo.

echo ============================================================
echo   INSTALACIÓN COMPLETADA EXITOSAMENTE
echo ============================================================
echo.
echo Puedes ahora ejecutar: INICIAR_SERVIDOR.bat
echo.
pause