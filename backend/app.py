#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
VERIFICA LA PAZ - Backend Flask v2.0 (Arquitectura en la Nube)
Compatible con PostgreSQL (Neon.tech) y Cloudinary para almacenamiento permanente.
"""

import os
import secrets
from datetime import datetime
from functools import wraps
from flask import Flask, request, jsonify, send_from_directory, session, redirect
from flask_sqlalchemy import SQLAlchemy
import cloudinary
import cloudinary.uploader

# ==========================================
# CONFIGURACIÓN
# ==========================================
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__, static_folder=BASE_DIR, static_url_path='')
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100MB max

# Clave secreta para sesiones (usar variable de entorno en producción)
app.secret_key = os.environ.get("SECRET_KEY", secrets.token_hex(32))

# Configuración de Base de Datos (PostgreSQL en Render, SQLite en local como fallback)
DATABASE_URL = os.environ.get("DATABASE_URL")
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    # SQLAlchemy requiere postgresql:// en lugar de postgres://
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL or f"sqlite:///{os.path.join(BACKEND_DIR, 'verifica_lapaz.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Configuración de Cloudinary
cloudinary.config(
    cloud_name=os.environ.get("CLOUDINARY_CLOUD_NAME", "demo"),
    api_key=os.environ.get("CLOUDINARY_API_KEY", "demo"),
    api_secret=os.environ.get("CLOUDINARY_API_SECRET", "demo")
)

# Credenciales admin
ADMIN_USER = 'admin'
ADMIN_PASS = 'verifica2026'

# ==========================================
# MODELOS DE BASE DE DATOS (SQLAlchemy)
# ==========================================
class Proveedor(db.Model):
    __tablename__ = 'proveedores'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(255), nullable=False)
    categoria = db.Column(db.String(100), nullable=False)
    subcategoria = db.Column(db.String(100))
    direccion = db.Column(db.String(255))
    telefono = db.Column(db.String(50))
    whatsapp = db.Column(db.String(50))
    horario = db.Column(db.String(100))
    precios = db.Column(db.Text)
    descripcion = db.Column(db.Text)
    tipo_plan = db.Column(db.String(50), default='gratuito')
    destacado = db.Column(db.Integer, default=0)
    video_path = db.Column(db.String(500))  # Ahora guarda URL de Cloudinary
    audio_path = db.Column(db.String(500))  # Ahora guarda URL de Cloudinary
    presentacion_texto = db.Column(db.Text)
    verificado = db.Column(db.Integer, default=1)
    fecha_alta = db.Column(db.DateTime, default=datetime.utcnow)
    fecha_actualizacion = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Consulta(db.Model):
    __tablename__ = 'consultas'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255))
    telefono = db.Column(db.String(50))
    tipo = db.Column(db.String(100))
    mensaje = db.Column(db.Text, nullable=False)
    fecha = db.Column(db.String(50), nullable=False)
    leido = db.Column(db.Integer, default=0)

# Crear tablas si no existen
with app.app_context():
    db.create_all()
    print("✅ Base de datos inicializada correctamente")

# ==========================================
# DECORADORES
# ==========================================
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'admin_logged_in' not in session:
            return redirect('/login')
        return f(*args, **kwargs)
    return decorated_function

# ==========================================
# RUTAS WEB (Servir archivos estáticos)
# ==========================================
@app.route('/')
def index():
    return send_from_directory(BASE_DIR, 'index.html')

@app.route('/<path:filename>')
def serve_html(filename):
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
                <div style="font-family: Arial; max-width: 400px; margin: 100px auto; padding: 30px; background: #fff; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); text-align: center;">
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
                body { font-family: 'Segoe UI', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; margin: 0; }
                .login-container { background: white; padding: 40px; border-radius: 15px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); width: 100%; max-width: 400px; text-align: center; }
                .form-group { margin-bottom: 20px; text-align: left; }
                .form-group input { width: 100%; padding: 12px; border: 2px solid #E2E8F0; border-radius: 8px; box-sizing: border-box; }
                .btn-login { width: 100%; padding: 14px; background: #2563EB; color: white; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; }
            </style>
        </head>
        <body>
            <div class="login-container">
                <h2>🔐 Panel de Administración</h2>
                <form method="POST">
                    <div class="form-group">
                        <label>Usuario</label>
                        <input type="text" name="user" placeholder="admin" required>
                    </div>
                    <div class="form-group">
                        <label>Contraseña</label>
                        <input type="password" name="pass" placeholder="••••••••" required>
                    </div>
                    <button type="submit" class="btn-login">Iniciar Sesión</button>
                </form>
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
    categoria = request.args.get('categoria')
    subcategoria = request.args.get('subcategoria')
    destacado = request.args.get('destacado')
    verificado = request.args.get('verificado', '1')
    
    query = Proveedor.query.filter_by(verificado=int(verificado))
    
    if categoria:
        query = query.filter_by(categoria=categoria)
    if subcategoria:
        query = query.filter(Proveedor.subcategoria.ilike(f"%{subcategoria}%"))
    if destacado == '1':
        query = query.filter_by(destacado=1)
        
    proveedores = query.order_by(Proveedor.tipo_plan.desc(), Proveedor.fecha_alta.desc()).all()
    
    return jsonify([{
        'id': p.id, 'nombre': p.nombre, 'categoria': p.categoria, 'subcategoria': p.subcategoria,
        'direccion': p.direccion, 'telefono': p.telefono, 'whatsapp': p.whatsapp, 'horario': p.horario,
        'precios': p.precios, 'descripcion': p.descripcion, 'tipo_plan': p.tipo_plan, 'destacado': p.destacado,
        'video_path': p.video_path, 'audio_path': p.audio_path, 'presentacion_texto': p.presentacion_texto,
        'verificado': p.verificado
    } for p in proveedores])

# ==========================================
# API DE CONTACTO
# ==========================================
@app.route('/api/contacto', methods=['POST'])
def enviar_contacto():
    try:
        data = request.json
        if not data.get('nombre') or not data.get('mensaje'):
            return jsonify({"success": False, "message": "Nombre y mensaje son obligatorios"}), 400
        
        nueva_consulta = Consulta(
            nombre=data['nombre'],
            email=data.get('email', ''),
            telefono=data.get('telefono', ''),
            tipo=data.get('tipo', 'General'),
            mensaje=data['mensaje'],
            fecha=datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        )
        db.session.add(nueva_consulta)
        db.session.commit()
        
        return jsonify({"success": True, "message": "Consulta enviada correctamente"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": str(e)}), 500

# ==========================================
# API ADMIN - Estadísticas
# ==========================================
@app.route('/api/admin/stats', methods=['GET'])
@login_required
def get_stats():
    stats = {
        'total': Proveedor.query.count(),
        'verificados': Proveedor.query.filter_by(verificado=1).count(),
        'pendientes': Proveedor.query.filter_by(verificado=0).count(),
        'gratuitos': Proveedor.query.filter_by(tipo_plan='gratuito').count(),
        'premium': Proveedor.query.filter_by(tipo_plan='premium').count(),
        'ultra_premium': Proveedor.query.filter_by(tipo_plan='ultra_premium').count(),
        'destacados': Proveedor.query.filter_by(destacado=1).count(),
        'consultas_total': Consulta.query.count(),
        'consultas_nuevas': Consulta.query.filter_by(leido=0).count()
    }
    return jsonify(stats)

# ==========================================
# API ADMIN - Proveedores (CRUD)
# ==========================================
@app.route('/api/admin/proveedores', methods=['GET'])
@login_required
def list_proveedores():
    proveedores = Proveedor.query.order_by(Proveedor.fecha_alta.desc()).all()
    return jsonify([{
        'id': p.id, 'nombre': p.nombre, 'categoria': p.categoria, 'subcategoria': p.subcategoria,
        'tipo_plan': p.tipo_plan, 'verificado': p.verificado, 'destacado': p.destacado, 'presentacion_texto': p.presentacion_texto
    } for p in proveedores])

@app.route('/api/admin/proveedores', methods=['POST'])
@login_required
def add_proveedor():
    try:
        data = request.form
        video_file = request.files.get('video')
        audio_file = request.files.get('audio')
        
        video_path = None
        audio_path = None
        
        # Subir a Cloudinary si existe el archivo
        if video_file and video_file.filename:
            upload_result = cloudinary.uploader.upload(video_file, resource_type="video")
            video_path = upload_result['secure_url']
            
        if audio_file and audio_file.filename:
            upload_result = cloudinary.uploader.upload(audio_file, resource_type="video") # "video" soporta audio también
            audio_path = upload_result['secure_url']
        
        nuevo_proveedor = Proveedor(
            nombre=data['nombre'],
            categoria=data['categoria'],
            subcategoria=data.get('subcategoria', ''),
            direccion=data.get('direccion', ''),
            telefono=data.get('telefono', ''),
            whatsapp=data.get('whatsapp', ''),
            horario=data.get('horario', ''),
            precios=data.get('precios', ''),
            descripcion=data.get('descripcion', ''),
            tipo_plan=data['tipo_plan'],
            destacado=int(data.get('destacado', 0)),
            video_path=video_path,
            audio_path=audio_path,
            presentacion_texto=data.get('presentacion_texto', ''),
            verificado=int(data.get('verificado', 1))
        )
        db.session.add(nuevo_proveedor)
        db.session.commit()
        
        return jsonify({"success": True, "message": "Proveedor agregado exitosamente"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/api/admin/proveedores/<int:id>', methods=['PUT'])
@login_required
def edit_proveedor(id):
    try:
        data = request.form
        proveedor = Proveedor.query.get_or_404(id)
        
        video_file = request.files.get('video')
        audio_file = request.files.get('audio')
        
        # Solo actualizamos las URLs si se suben archivos nuevos
        if video_file and video_file.filename:
            upload_result = cloudinary.uploader.upload(video_file, resource_type="video")
            proveedor.video_path = upload_result['secure_url']
            
        if audio_file and audio_file.filename:
            upload_result = cloudinary.uploader.upload(audio_file, resource_type="video")
            proveedor.audio_path = upload_result['secure_url']
        
        proveedor.nombre = data['nombre']
        proveedor.categoria = data['categoria']
        proveedor.subcategoria = data.get('subcategoria', '')
        proveedor.direccion = data.get('direccion', '')
        proveedor.telefono = data.get('telefono', '')
        proveedor.whatsapp = data.get('whatsapp', '')
        proveedor.horario = data.get('horario', '')
        proveedor.precios = data.get('precios', '')
        proveedor.descripcion = data.get('descripcion', '')
        proveedor.tipo_plan = data['tipo_plan']
        proveedor.destacado = int(data.get('destacado', 0))
        proveedor.presentacion_texto = data.get('presentacion_texto', '')
        proveedor.verificado = int(data.get('verificado', 1))
        proveedor.fecha_actualizacion = datetime.utcnow()
        
        db.session.commit()
        return jsonify({"success": True, "message": "Proveedor actualizado exitosamente"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/api/admin/proveedores/<int:id>', methods=['DELETE'])
@login_required
def delete_proveedor(id):
    try:
        proveedor = Proveedor.query.get_or_404(id)
        db.session.delete(proveedor)
        db.session.commit()
        return jsonify({"success": True, "message": "Proveedor eliminado exitosamente"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": str(e)}), 500

# ==========================================
# API ADMIN - Consultas
# ==========================================
@app.route('/api/admin/consultas', methods=['GET'])
@login_required
def obtener_consultas():
    consultas = Consulta.query.order_by(Consulta.fecha.desc()).all()
    return jsonify([{
        'id': c.id, 'nombre': c.nombre, 'email': c.email, 'telefono': c.telefono,
        'tipo': c.tipo, 'mensaje': c.mensaje, 'fecha': c.fecha, 'leido': c.leido
    } for c in consultas])

@app.route('/api/admin/consultas/<int:id>/leido', methods=['PUT'])
@login_required
def marcar_leido(id):
    try:
        consulta = Consulta.query.get_or_404(id)
        consulta.leido = 1
        db.session.commit()
        return jsonify({"success": True, "message": "Consulta marcada como leída"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/api/admin/consultas/<int:id>', methods=['DELETE'])
@login_required
def eliminar_consulta(id):
    try:
        consulta = Consulta.query.get_or_404(id)
        db.session.delete(consulta)
        db.session.commit()
        return jsonify({"success": True, "message": "Consulta eliminada"})
    except Exception as e:
        db.session.rollback()
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
# INICIAR SERVIDOR
# ==========================================
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    print("\n" + "=" * 60)
    print("  🚀 SERVIDOR VERIFICA LA PAZ INICIADO (v2.0 Nube)  ")
    print("=" * 60)
    print(f"🌐 Puerto asignado: {port}")
    print(f"💾 Base de datos: {'PostgreSQL (Neon)' if DATABASE_URL else 'SQLite (Local)'}")
    print("=" * 60 + "\n")
    app.run(debug=False, port=port, host='0.0.0.0')