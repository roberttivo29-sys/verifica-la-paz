@echo off
chcp 65001 >nul
title Abrir Panel - Verifica La Paz
color 0E

echo ============================================================
echo   ABRIR PANEL DE ADMINISTRACIÓN
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
echo Abriendo panel de administración...
echo.

:: Abrir navegador
start http://localhost:5000/admin

echo [OK] Panel abierto en tu navegador predeterminado
echo.
echo Credenciales de acceso:
echo   Usuario: admin
echo   Contraseña: verifica2026
echo.
pause