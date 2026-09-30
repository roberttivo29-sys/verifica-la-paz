#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
VERIFICA LA PAZ - Database Helper para el Bot de Telegram
Integrado con PostgreSQL (Neon.tech) y SQLAlchemy
"""

import os
import logging
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

logger = logging.getLogger(__name__)

# ==========================================
# CONFIGURACIÓN DE BASE DE DATOS
# ==========================================
DATABASE_URL = os.environ.get("DATABASE_URL")

if DATABASE_URL:
    # SQLAlchemy requiere postgresql:// en lugar de postgres://
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    
    engine = create_engine(DATABASE_URL)
    Session = sessionmaker(bind=engine)
    logger.info("✅ Database Helper conectado exitosamente a PostgreSQL")
else:
    logger.warning("⚠️ DATABASE_URL no configurada. El bot no podrá buscar proveedores.")

# ==========================================
# FUNCIONES DE CONSULTA
# ==========================================
def obtener_categorias_principales():
    """Obtiene las categorías principales de proveedores verificados"""
    try:
        session = Session()
        result = session.execute(text(
            "SELECT DISTINCT categoria FROM proveedores WHERE verificado = 1 ORDER BY categoria"
        ))
        categorias = [row[0] for row in result]
        session.close()
        return categorias if categorias else ["Salud", "Hogar", "Automotriz", "Tecnología", "Funeraria"]
    except Exception as e:
        logger.error(f"Error obteniendo categorías: {e}")
        return ["Salud", "Hogar", "Automotriz", "Tecnología", "Funeraria"]

def buscar_proveedores_por_palabra_clave(texto_busqueda):
    """Busca proveedores por palabra clave en nombre, subcategoría o descripción"""
    try:
        session = Session()
        query = text("""
            SELECT nombre, subcategoria, direccion, whatsapp, telefono 
            FROM proveedores 
            WHERE verificado = 1 
            AND (
                LOWER(nombre) LIKE :texto 
                OR LOWER(subcategoria) LIKE :texto 
                OR LOWER(descripcion) LIKE :texto
            )
            LIMIT 5
        """)
        
        resultado = session.execute(query, {"texto": f"%{texto_busqueda.lower()}%"})
        # Convertir filas de SQLAlchemy a diccionarios de Python
        proveedores = [dict(row._mapping) for row in resultado]
        session.close()
        
        return proveedores
    except Exception as e:
        logger.error(f"Error buscando proveedores: {e}")
        return []