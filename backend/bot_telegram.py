#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
VERIFICA LA PAZ - Bot de Telegram v2.0
Lógica principal del bot (separada de la base de datos)
"""

import os
import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes

# Importar funciones de base de datos desde el helper
from db_helper import obtener_categorias_principales, buscar_proveedores_por_palabra_clave

logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

# ==========================================
# CONFIGURACIÓN
# ==========================================
TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN")

# Enlaces oficiales
LINK_WEB = "https://verificalapaz.com"
LINK_WHATSAPP = "https://wa.me/59176536286"
LINK_BOT = "https://t.me/verificalapaz_bot"

# ==========================================
# COMANDOS DEL BOT
# ==========================================
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Comando /start - Mensaje de bienvenida"""
    try:
        categorias = obtener_categorias_principales()
        menu = "\n".join([f"• {cat}" for cat in categorias])
        
        texto = (
            f"¡Hola! 👋 Bienvenido a *Verifica La Paz*.\n\n"
            "Este es nuestro canal oficial y exclusivo. Estoy aquí para ayudarte a encontrar proveedores verificados al instante.\n\n"
            f"*Categorías disponibles:*\n{menu}\n\n"
            "Escribe lo que necesitas (ej: *plomería*, *celular*, *grúa*) y te daré el contacto directo."
        )
        
        keyboard = [
            [InlineKeyboardButton("🌐 Ir al Sitio Web", url=LINK_WEB)],
            [InlineKeyboardButton("📱 Contactar por WhatsApp", url=LINK_WHATSAPP)],
            [InlineKeyboardButton("🔗 Compartir este Bot", url=LINK_BOT)]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await update.message.reply_text(texto, parse_mode='Markdown', reply_markup=reply_markup)
    except Exception as e:
        logger.error(f"Error en /start: {e}")
        await update.message.reply_text("❌ Hubo un error. Por favor intenta de nuevo en unos segundos.")

async def ayuda(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Comando /ayuda - Información de uso"""
    texto = (
        "📖 *Cómo usar el bot:*\n\n"
        "1️⃣ Escribe lo que necesitas buscar\n"
        "   Ejemplo: *plomería*, *taller*, *celular*\n\n"
        "2️⃣ El bot te dará los contactos verificados\n\n"
        "3️⃣ Usa los botones para contactar directamente\n\n"
        "*Comandos disponibles:*\n"
        "/start - Mensaje de bienvenida\n"
        "/ayuda - Esta información\n"
        "/categorias - Ver todas las categorías"
    )
    await update.message.reply_text(texto, parse_mode='Markdown')

async def categorias(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Comando /categorias - Lista todas las categorías"""
    try:
        cats = obtener_categorias_principales()
        texto = "📂 *Categorías disponibles:*\n\n"
        for cat in cats:
            texto += f"• {cat}\n"
        
        texto += "\n💡 Escribe el nombre de una categoría o servicio para buscar proveedores."
        await update.message.reply_text(texto, parse_mode='Markdown')
    except Exception as e:
        logger.error(f"Error en /categorias: {e}")
        await update.message.reply_text("❌ No se pudieron cargar las categorías.")

# ==========================================
# MANEJO DE MENSAJES
# ==========================================
async def manejar_mensaje(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Maneja mensajes de texto buscando proveedores"""
    try:
        texto = update.message.text.strip().lower()
        
        if len(texto) < 2:
            await update.message.reply_text("Por favor escribe al menos 2 caracteres para buscar.")
            return
        
        proveedores = buscar_proveedores_por_palabra_clave(texto)
        
        if not proveedores:
            texto_error = (
                f"😕 No encontré proveedores verificados para '*{texto}*'.\n\n"
                "Intenta con términos más generales como:\n"
                "• plomería\n• celular\n• taller\n• grúa\n• clínica\n\n"
                "O usa los botones de abajo para contactarnos directamente."
            )
            keyboard = [[InlineKeyboardButton("📱 Hablar con un humano (WhatsApp)", url=LINK_WHATSAPP)]]
            reply_markup = InlineKeyboardMarkup(keyboard)
            await update.message.reply_text(texto_error, parse_mode='Markdown', reply_markup=reply_markup)
            return
        
        respuesta = f"🔍 Encontré {len(proveedores)} opción(es) verificada(s) para '*{texto}*':\n\n"
        
        for i, p in enumerate(proveedores, 1):
            respuesta += f"*{i}. {p['nombre']}*\n"
            if p['subcategoria']:
                respuesta += f"📌 {p['subcategoria']}\n"
            if p['direccion']:
                respuesta += f"📍 {p['direccion']}\n"
            
            if p['whatsapp']:
                numero_limpio = ''.join(filter(str.isdigit, p['whatsapp']))
                mensaje_wsp = f"Hola, vi tu perfil en Verifica La Paz y me interesa tu servicio de {texto}."
                link_wsp = f"https://wa.me/591{numero_limpio}?text={mensaje_wsp}"
                respuesta += f"📱 [Escribir por WhatsApp]({link_wsp})\n"
            elif p['telefono']:
                respuesta += f"📞 [Llamar ahora](tel:+591{p['telefono'].replace(' ', '')})\n"
            respuesta += "\n"
        
        respuesta += "💡 _Estos proveedores han sido verificados personalmente por nuestro equipo._"
        
        keyboard = [
            [InlineKeyboardButton("🌐 Ver más en la Web", url=LINK_WEB)],
            [InlineKeyboardButton("🆘 ¿Necesitas algo más? (WhatsApp)", url=LINK_WHATSAPP)]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await update.message.reply_text(respuesta, parse_mode='Markdown', disable_web_page_preview=True, reply_markup=reply_markup)
        
    except Exception as e:
        logger.error(f"Error manejando mensaje: {e}")
        await update.message.reply_text("❌ Hubo un error procesando tu mensaje. Por favor intenta de nuevo.")

# ==========================================
# MANEJO DE ERRORES GLOBALES
# ==========================================
async def error_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    logger.error(f"Excepción mientras manejaba la actualización {update}: {context.error}")
    if update and update.message:
        await update.message.reply_text("❌ Lo siento, hubo un error técnico. Por favor intenta de nuevo en unos segundos.")

# ==========================================
# INICIAR BOT
# ==========================================
def main():
    if not TOKEN:
        print("⚠️ ERROR: Debes configurar TELEGRAM_BOT_TOKEN en las variables de entorno.")
        return
    
    if not os.environ.get("DATABASE_URL"):
        print("⚠️ ERROR: Debes configurar DATABASE_URL en las variables de entorno.")
        return

    print("🚀 Iniciando Bot de Telegram de Verifica La Paz...")
    print(f"🔗 Enlace directo del bot: {LINK_BOT}")
    
    app = Application.builder().token(TOKEN).build()
    
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("ayuda", ayuda))
    app.add_handler(CommandHandler("categorias", categorias))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, manejar_mensaje))
    app.add_error_handler(error_handler)
    
    print("✅ Bot iniciado correctamente. Esperando mensajes...")
    app.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == '__main__':
    main()