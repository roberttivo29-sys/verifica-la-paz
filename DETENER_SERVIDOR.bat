@echo off
chcp 65001 >nul
title Detener Servidor - Verifica La Paz
color 0C

echo ============================================================
echo   DETENER SERVIDOR - VERIFICA LA PAZ
echo ============================================================
echo.

echo Buscando procesos de Python...
echo.

:: Buscar procesos de Python
tasklist /FI "IMAGENAME eq python.exe" 2>nul | find /I "python.exe" >nul
if errorlevel 1 (
    color 0A
    echo [OK] No hay servidores de Python corriendo
    echo.
    pause
    exit /b 0
)

echo [ADVERTENCIA] Se encontraron procesos de Python
echo.
set /p confirmacion=¿Deseas detener todos los servidores de Python? (S/N): 

if /i "%confirmacion%"=="S" (
    echo.
    echo Deteniendo servidores...
    taskkill /F /IM python.exe >nul 2>&1
    echo [OK] Servidores detenidos
    echo.
) else (
    echo.
    echo Operación cancelada
    echo.
)

pause