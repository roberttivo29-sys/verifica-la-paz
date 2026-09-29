import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'verifica_lapaz.db')

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def buscar_proveedores_por_palabra_clave(keyword):
    """Busca proveedores por nombre, categoría o subcategoría"""
    conn = get_db_connection()
    search_term = f"%{keyword}%"
    
    query = """
        SELECT nombre, subcategoria, direccion, telefono, whatsapp, descripcion 
        FROM proveedores 
        WHERE verificado = 1 
        AND (nombre LIKE ? OR categoria LIKE ? OR subcategoria LIKE ?)
        ORDER BY tipo_plan DESC, destacado DESC
        LIMIT 3
    """
    
    results = conn.execute(query, (search_term, search_term, search_term)).fetchall()
    conn.close()
    
    return [dict(row) for row in results]

def obtener_categorias_principales():
    """Devuelve las categorías principales para el menú"""
    return [
        "🏥 Salud (Clínicas, Veterinarias)",
        "🏠 Hogar (Plomería, Electricidad, Pintura)",
        "🚗 Automotriz (Talleres, Grúas, Lavado)",
        "💻 Tecnología (Celulares, Laptops, Cámaras)",
        "🕊️ Funerarias y Homenajes"
    ]