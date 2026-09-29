#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
VERIFICA LA PAZ - Backend Flask v1.0
Servidor web con API REST para directorio de proveedores verificados
"""

import os
import sqlite3
import secrets
from datetime import datetime
from functools import wraps
from flask import Flask, request, jsonify, send_from_directory, session, redirect
from werkzeug.utils import secure_filename

# ==========================================
# CONFIGURACIÓN
# ==========================================
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BACKEND_DIR, 'uploads')
DB_PATH = os.path.join(BACKEND_DIR, 'verifica_lapaz.db')

# Crear directorios necesarios
os.makedirs(os.path.join(UPLOAD_DIR, 'videos'), exist_ok=True)
os.makedirs(os.path.join(UPLOAD_DIR, 'audios'), exist_ok=True)

app = Flask(__name__, static_folder=BASE_DIR, static_url_path='')
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100MB max
app.secret_key = secrets.token_hex(32)

# Credenciales admin (cambiar en producción)
ADMIN_USER = 'admin'
ADMIN_PASS = 'verifica2026'

# Extensiones permitidas
ALLOWED_VIDEO = {'mp4', 'mov', 'avi', 'webm'}
ALLOWED_AUDIO = {'mp3', 'wav', 'ogg', 'm4a'}

# ==========================================
# BASE DE DATOS
# ==========================================
def get_db():
    """Conecta a la base de datos"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    return conn

def init_db():
    """Crea las tablas si no existen"""
    conn = get_db()
    
    # Tabla de proveedores
    conn.execute('''CREATE TABLE IF NOT EXISTS proveedores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        categoria TEXT NOT NULL,
        subcategoria TEXT,
        direccion TEXT,
        telefono TEXT,
        whatsapp TEXT,
        horario TEXT,
        precios TEXT,
        descripcion TEXT,
        tipo_plan TEXT DEFAULT 'gratuito',
        destacado INTEGER DEFAULT 0,
        video_path TEXT,
        audio_path TEXT,
        presentacion_texto TEXT,
        verificado INTEGER DEFAULT 1,
        fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )''')
    
    # Tabla de consultas de contacto
    conn.execute('''CREATE TABLE IF NOT EXISTS consultas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        email TEXT,
        telefono TEXT,
        tipo TEXT,
        mensaje TEXT NOT NULL,
        fecha TEXT NOT NULL,
        leido INTEGER DEFAULT 0
    )''')
    
    # Índices para mejorar performance
    conn.execute('CREATE INDEX IF NOT EXISTS idx_proveedores_categoria ON proveedores(categoria)')
    conn.execute('CREATE INDEX IF NOT EXISTS idx_proveedores_destacado ON proveedores(destacado)')
    conn.execute('CREATE INDEX IF NOT EXISTS idx_consultas_leido ON consultas(leido)')
    
    conn.commit()
    conn.close()
    print("✅ Base de datos inicializada correctamente")

# Inicializar BD al cargar
init_db()

# ==========================================
# DECORADORES
# ==========================================
def login_required(f):
    """Decorador para proteger rutas admin"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'admin_logged_in' not in session:
            return redirect('/login')
        return f(*args, **kwargs)
    return decorated_function

def allowed_file(filename, allowed_set):
    """Verifica si el archivo tiene extensión permitida"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_set

# ==========================================
# RUTAS WEB (Servir archivos estáticos)
# ==========================================
@app.route('/')
def index():
    return send_from_directory(BASE_DIR, 'index.html')

@app.route('/<path:filename>')
def serve_html(filename):
    """Sirve archivos HTML de la raíz"""
    if filename.endswith('.html'):
        return send_from_directory(BASE_DIR, filename)
    return send_from_directory(BASE_DIR, filename)

@app.route('/css/<path:filename>')
def serve_css(filename):
    return send_from_directory(os.path.join(BASE_DIR, 'css'), filename)

@app.route('/js/<path:filename>')
def serve_js(filename):
    return send_from_directory(os.path.join(BASE_DIR, 'js'), filename)

@app.route('/img/<path:filename>')
def serve_img(filename):
    return send_from_directory(os.path.join(BASE_DIR, 'img'), filename)

@app.route('/uploads/<path:filename>')
def serve_uploads(filename):
    return send_from_directory(UPLOAD_DIR, filename)

# ==========================================
# LOGIN Y LOGOUT
# ==========================================
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        user = request.form.get('user')
        password = request.form.get('pass')
        
        if user == ADMIN_USER and password == ADMIN_PASS:
            session['admin_logged_in'] = True
            session['admin_user'] = user
            return redirect('/admin')
        else:
            return '''
                <div style="font-family: Arial; max-width: 400px; margin: 100px auto; padding: 30px; background: #fff; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                    <h2 style="color: #EF4444;">❌ Credenciales incorrectas</h2>
                    <p>Usuario o contraseña incorrectos.</p>
                    <a href="/login" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background: #2563EB; color: white; text-decoration: none; border-radius: 5px;">Intentar de nuevo</a>
                </div>
            '''
    
    return '''
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Login | Verifica La Paz Admin</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .login-container {
                    background: white;
                    padding: 40px;
                    border-radius: 15px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    width: 100%;
                    max-width: 400px;
                }
                .login-header { text-align: center; margin-bottom: 30px; }
                .login-header h1 { color: #0F172A; font-size: 1.8rem; margin-bottom: 10px; }
                .login-header p { color: #64748B; font-size: 0.9rem; }
                .form-group { margin-bottom: 20px; }
                .form-group label { display: block; margin-bottom: 8px; color: #334155; font-weight: 600; }
                .form-group input {
                    width: 100%; padding: 12px 15px; border: 2px solid #E2E8F0;
                    border-radius: 8px; font-size: 1rem; transition: border-color 0.3s;
                }
                .form-group input:focus { outline: none; border-color: #2563EB; }
                .btn-login {
                    width: 100%; padding: 14px;
                    background: linear-gradient(135deg, #2563EB 0%, #1E40AF 100%);
                    color: white; border: none; border-radius: 8px;
                    font-size: 1rem; font-weight: 700; cursor: pointer;
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .btn-login:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(37, 99, 235, 0.4); }
                .warning {
                    background: #FEF3C7; border-left: 4px solid #F59E0B;
                    padding: 12px; margin-top: 20px; border-radius: 5px;
                    font-size: 0.85rem; color: #92400E;
                }
            </style>
        </head>
        <body>
            <div class="login-container">
                <div class="login-header">
                    <h1>🔐 Panel de Administración</h1>
                    <p>Verifica La Paz - Acceso Restringido</p>
                </div>
                <form method="POST">
                    <div class="form-group">
                        <label for="user">Usuario</label>
                        <input type="text" id="user" name="user" placeholder="admin" required autofocus>
                    </div>
                    <div class="form-group">
                        <label for="pass">Contraseña</label>
                        <input type="password" id="pass" name="pass" placeholder="••••••••" required>
                    </div>
                    <button type="submit" class="btn-login">Iniciar Sesión</button>
                </form>
                <div class="warning">
                    <strong>⚠️ Credenciales por defecto:</strong><br>
                    Usuario: <code>admin</code><br>
                    Contraseña: <code>verifica2026</code><br>
                    <small>Cámbialas en el código (app.py) por seguridad.</small>
                </div>
            </div>
        </body>
        </html>
    '''

@app.route('/logout')
def logout():
    session.clear()
    return redirect('/login')

@app.route('/admin')
@login_required
def admin():
    return send_from_directory(BACKEND_DIR, 'admin.html')

# ==========================================
# API PÚBLICA
# ==========================================
@app.route('/api/proveedores', methods=['GET'])
def get_proveedores():
    """Obtiene lista de proveedores con filtros opcionales"""
    conn = get_db()
    
    categoria = request.args.get('categoria')
    subcategoria = request.args.get('subcategoria')
    destacado = request.args.get('destacado')
    verificado = request.args.get('verificado', '1')
    
    query = "SELECT * FROM proveedores WHERE 1=1"
    params = []
    
    if verificado:
        query += " AND verificado = ?"
        params.append(int(verificado))
    
    if categoria:
        query += " AND categoria = ?"
        params.append(categoria)
    
    if subcategoria:
        query += " AND subcategoria LIKE ?"
        params.append(f"%{subcategoria}%")
    
    if destacado == '1':
        query += " AND destacado = 1"
    
    query += " ORDER BY tipo_plan DESC, fecha_alta DESC"
    
    proveedores = [dict(row) for row in conn.execute(query, params).fetchall()]
    conn.close()
    
    return jsonify(proveedores)

# ==========================================
# API DE CONTACTO
# ==========================================
@app.route('/api/contacto', methods=['POST'])
def enviar_contacto():
    """Recibe mensajes de contacto del formulario público"""
    try:
        data = request.json
        
        if not data.get('nombre') or not data.get('mensaje'):
            return jsonify({"success": False, "message": "Nombre y mensaje son obligatorios"}), 400
        
        conn = get_db()
        conn.execute(
            'INSERT INTO consultas (nombre, email, telefono, tipo, mensaje, fecha) VALUES (?, ?, ?, ?, ?, ?)',
            (
                data['nombre'],
                data.get('email', ''),
                data.get('telefono', ''),
                data.get('tipo', 'General'),
                data['mensaje'],
                datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            )
        )
        conn.commit()
        conn.close()
        
        return jsonify({"success": True, "message": "Consulta enviada correctamente"}), 200
        
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# ==========================================
# API ADMIN - Estadísticas
# ==========================================
@app.route('/api/admin/stats', methods=['GET'])
@login_required
def get_stats():
    """Obtiene estadísticas del dashboard"""
    conn = get_db()
    
    stats = {
        'total': conn.execute('SELECT COUNT(*) FROM proveedores').fetchone()[0],
        'verificados': conn.execute('SELECT COUNT(*) FROM proveedores WHERE verificado = 1').fetchone()[0],
        'pendientes': conn.execute('SELECT COUNT(*) FROM proveedores WHERE verificado = 0').fetchone()[0],
        'gratuitos': conn.execute("SELECT COUNT(*) FROM proveedores WHERE tipo_plan = 'gratuito'").fetchone()[0],
        'premium': conn.execute("SELECT COUNT(*) FROM proveedores WHERE tipo_plan = 'premium'").fetchone()[0],
        'ultra_premium': conn.execute("SELECT COUNT(*) FROM proveedores WHERE tipo_plan = 'ultra_premium'").fetchone()[0],
        'destacados': conn.execute('SELECT COUNT(*) FROM proveedores WHERE destacado = 1').fetchone()[0],
        'consultas_total': conn.execute('SELECT COUNT(*) FROM consultas').fetchone()[0],
        'consultas_nuevas': conn.execute('SELECT COUNT(*) FROM consultas WHERE leido = 0').fetchone()[0]
    }
    
    conn.close()
    return jsonify(stats)

# ==========================================
# API ADMIN - Proveedores
# ==========================================
@app.route('/api/admin/proveedores', methods=['GET'])
@login_required
def list_proveedores():
    """Lista todos los proveedores"""
    conn = get_db()
    proveedores = [dict(row) for row in conn.execute('SELECT * FROM proveedores ORDER BY fecha_alta DESC').fetchall()]
    conn.close()
    return jsonify(proveedores)

@app.route('/api/admin/proveedores', methods=['POST'])
@login_required
def add_proveedor():
    """Agrega un nuevo proveedor"""
    try:
        data = request.form
        video_file = request.files.get('video')
        audio_file = request.files.get('audio')
        
        video_path = None
        audio_path = None
        
        # Procesar video
        if video_file and video_file.filename and allowed_file(video_file.filename, ALLOWED_VIDEO):
            filename = secure_filename(video_file.filename)
            base, ext = os.path.splitext(filename)
            counter = 1
            while os.path.exists(os.path.join(UPLOAD_DIR, 'videos', filename)):
                filename = f"{base}_{counter}{ext}"
                counter += 1
            video_file.save(os.path.join(UPLOAD_DIR, 'videos', filename))
            video_path = f"uploads/videos/{filename}"
        
        # Procesar audio
        if audio_file and audio_file.filename and allowed_file(audio_file.filename, ALLOWED_AUDIO):
            filename = secure_filename(audio_file.filename)
            base, ext = os.path.splitext(filename)
            counter = 1
            while os.path.exists(os.path.join(UPLOAD_DIR, 'audios', filename)):
                filename = f"{base}_{counter}{ext}"
                counter += 1
            audio_file.save(os.path.join(UPLOAD_DIR, 'audios', filename))
            audio_path = f"uploads/audios/{filename}"
        
        conn = get_db()
        conn.execute('''INSERT INTO proveedores 
            (nombre, categoria, subcategoria, direccion, telefono, whatsapp, horario, precios, 
             descripcion, tipo_plan, destacado, video_path, audio_path, presentacion_texto, verificado)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
            (
                data['nombre'],
                data['categoria'],
                data.get('subcategoria', ''),
                data.get('direccion', ''),
                data.get('telefono', ''),
                data.get('whatsapp', ''),
                data.get('horario', ''),
                data.get('precios', ''),
                data.get('descripcion', ''),
                data['tipo_plan'],
                int(data.get('destacado', 0)),
                video_path,
                audio_path,
                data.get('presentacion_texto', ''),
                int(data.get('verificado', 1))
            ))
        conn.commit()
        conn.close()
        
        return jsonify({"success": True, "message": "Proveedor agregado exitosamente"}), 201
        
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/api/admin/proveedores/<int:id>', methods=['GET'])
@login_required
def get_proveedor(id):
    """Obtiene un proveedor específico"""
    conn = get_db()
    proveedor = conn.execute('SELECT * FROM proveedores WHERE id = ?', (id,)).fetchone()
    conn.close()
    
    if not proveedor:
        return jsonify({"success": False, "message": "Proveedor no encontrado"}), 404
    
    return jsonify(dict(proveedor))

@app.route('/api/admin/proveedores/<int:id>', methods=['PUT'])
@login_required
def edit_proveedor(id):
    """Actualiza un proveedor existente"""
    try:
        data = request.form
        video_file = request.files.get('video')
        audio_file = request.files.get('audio')
        
        conn = get_db()
        proveedor_actual = conn.execute('SELECT * FROM proveedores WHERE id = ?', (id,)).fetchone()
        
        if not proveedor_actual:
            conn.close()
            return jsonify({"success": False, "message": "Proveedor no encontrado"}), 404
        
        video_path = proveedor_actual['video_path']
        audio_path = proveedor_actual['audio_path']
        
        # Procesar nuevo video si se subió
        if video_file and video_file.filename and allowed_file(video_file.filename, ALLOWED_VIDEO):
            filename = secure_filename(video_file.filename)
            base, ext = os.path.splitext(filename)
            counter = 1
            while os.path.exists(os.path.join(UPLOAD_DIR, 'videos', filename)):
                filename = f"{base}_{counter}{ext}"
                counter += 1
            video_file.save(os.path.join(UPLOAD_DIR, 'videos', filename))
            video_path = f"uploads/videos/{filename}"
        
        # Procesar nuevo audio si se subió
        if audio_file and audio_file.filename and allowed_file(audio_file.filename, ALLOWED_AUDIO):
            filename = secure_filename(audio_file.filename)
            base, ext = os.path.splitext(filename)
            counter = 1
            while os.path.exists(os.path.join(UPLOAD_DIR, 'audios', filename)):
                filename = f"{base}_{counter}{ext}"
                counter += 1
            audio_file.save(os.path.join(UPLOAD_DIR, 'audios', filename))
            audio_path = f"uploads/audios/{filename}"
        
        conn.execute('''UPDATE proveedores SET 
            nombre=?, categoria=?, subcategoria=?, direccion=?, telefono=?, 
            whatsapp=?, horario=?, precios=?, descripcion=?, tipo_plan=?, 
            destacado=?, video_path=?, audio_path=?, presentacion_texto=?, verificado=?,
            fecha_actualizacion=CURRENT_TIMESTAMP
            WHERE id=?''',
            (
                data['nombre'],
                data['categoria'],
                data.get('subcategoria', ''),
                data.get('direccion', ''),
                data.get('telefono', ''),
                data.get('whatsapp', ''),
                data.get('horario', ''),
                data.get('precios', ''),
                data.get('descripcion', ''),
                data['tipo_plan'],
                int(data.get('destacado', 0)),
                video_path,
                audio_path,
                data.get('presentacion_texto', ''),
                int(data.get('verificado', 1)),
                id
            ))
        conn.commit()
        conn.close()
        
        return jsonify({"success": True, "message": "Proveedor actualizado exitosamente"})
        
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/api/admin/proveedores/<int:id>', methods=['DELETE'])
@login_required
def delete_proveedor(id):
    """Elimina un proveedor"""
    try:
        conn = get_db()
        
        # Verificar que existe
        proveedor = conn.execute('SELECT * FROM proveedores WHERE id = ?', (id,)).fetchone()
        if not proveedor:
            conn.close()
            return jsonify({"success": False, "message": "Proveedor no encontrado"}), 404
        
        # Eliminar archivos asociados
        if proveedor['video_path']:
            video_file = os.path.join(BACKEND_DIR, proveedor['video_path'])
            if os.path.exists(video_file):
                os.remove(video_file)
        
        if proveedor['audio_path']:
            audio_file = os.path.join(BACKEND_DIR, proveedor['audio_path'])
            if os.path.exists(audio_file):
                os.remove(audio_file)
        
        # Eliminar de la base de datos
        conn.execute('DELETE FROM proveedores WHERE id = ?', (id,))
        conn.commit()
        conn.close()
        
        return jsonify({"success": True, "message": "Proveedor eliminado exitosamente"})
        
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# ==========================================
# API ADMIN - Consultas
# ==========================================
@app.route('/api/admin/consultas', methods=['GET'])
@login_required
def obtener_consultas():
    """Lista todas las consultas de contacto"""
    conn = get_db()
    consultas = [dict(row) for row in conn.execute('SELECT * FROM consultas ORDER BY fecha DESC').fetchall()]
    conn.close()
    return jsonify(consultas)

@app.route('/api/admin/consultas/<int:id>/leido', methods=['PUT'])
@login_required
def marcar_leido(id):
    """Marca una consulta como leída"""
    try:
        conn = get_db()
        conn.execute('UPDATE consultas SET leido = 1 WHERE id = ?', (id,))
        conn.commit()
        conn.close()
        return jsonify({"success": True, "message": "Consulta marcada como leída"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/api/admin/consultas/<int:id>', methods=['DELETE'])
@login_required
def eliminar_consulta(id):
    """Elimina una consulta"""
    try:
        conn = get_db()
        conn.execute('DELETE FROM consultas WHERE id = ?', (id,))
        conn.commit()
        conn.close()
        return jsonify({"success": True, "message": "Consulta eliminada"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# ==========================================
# MANEJO DE ERRORES
# ==========================================
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Recurso no encontrado"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Error interno del servidor"}), 500

# ==========================================
# INICIAR SERVIDOR (CORREGIDO PARA RENDER)
# ==========================================
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    
    print("\n" + "=" * 60)
    print("  🚀 SERVIDOR VERIFICA LA PAZ INICIADO  ")
    print("=" * 60)
    print(f"🌐 Puerto asignado: {port}")
    print("=" * 60 + "\n")
    
    app.run(debug=False, port=port, host='0.0.0.0')