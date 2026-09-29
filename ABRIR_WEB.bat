@echo off
chcp 65001 >nul
title Abrir Web - Verifica La Paz
color 0D

echo ============================================================
echo   ABRIR SITIO WEB PÚBLICO
echo ============================================================
echo.

:: Verificar si el servidor está corriendo
curl -s http://localhost:5000 >nul 2>&1
if errorlevel 1 (
    color 0C
    echo [ERROR] El servidor no está corriendo
    echo.
    echo Primero ejecuta: INICIAR_SERVIDOR.bat
    echo.
    pause
    exit /b 1
)

echo [OK] Servidor detectado en http://localhost:5000
echo.
echo Abriendo sitio web...
echo.

:: Abrir navegador
start http://localhost:5000

echo [OK] Sitio web abierto en tu navegador predeterminado
echo.
pause