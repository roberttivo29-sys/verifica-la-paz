#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
from db_helper import buscar_proveedores_por_palabra_clave, obtener_categorias_principales

logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)

# ✅ NUEVO TOKEN GENERADO (Token anterior revocado)
TOKEN = "8163649010:AAFdZNZLHK4qQoX0gu22QXJzYTyRxYPAg88"

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    categorias = obtener_categorias_principales()
    menu = "\n".join([f"• {cat}" for cat in categorias])
    
    texto = (
        f"¡Hola! 👋 Soy el asistente de *Verifica La Paz*.\n\n"
        "Estoy aquí para ayudarte a encontrar proveedores verificados en La Paz y El Alto.\n\n"
        f"*Categorías disponibles:*\n{menu}\n\n"
        "Escribe lo que necesitas (ej: *plomería*, *celular*, *grúa*) y te buscaré las mejores opciones."
    )
    await update.message.reply_text(texto, parse_mode='Markdown')

async def manejar_mensaje(update: Update, context: ContextTypes.DEFAULT_TYPE):
    texto = update.message.text.strip().lower()
    
    # Palabras de saludo
    if texto in ['hola', 'buenas', 'hi', 'ayuda']:
        await start(update, context)
        return

    # Buscar en la base de datos
    proveedores = buscar_proveedores_por_palabra_clave(texto)
    
    if not proveedores:
        await update.message.reply_text(
            f"😕 No encontré proveedores verificados para '*{texto}*'.\n\n"
            "Intenta con términos más generales como:\n"
            "• plomería\n• celular\n• taller\n• grúa\n• clínica\n\n"
            "O escribe /ayuda para ver el menú."
        )
        return
    
    # Construir respuesta con los resultados
    respuesta = f"🔍 Encontré {len(proveedores)} opción(es) verificada(s) para '*{texto}*':\n\n"
    
    for i, p in enumerate(proveedores, 1):
        respuesta += f"*{i}. {p['nombre']}*\n"
        if p['subcategoria']:
            respuesta += f"📌 {p['subcategoria']}\n"
        if p['direccion']:
            respuesta += f"📍 {p['direccion']}\n"
        
        # Crear enlace de WhatsApp si existe el número
        if p['whatsapp']:
            numero_limpio = ''.join(filter(str.isdigit, p['whatsapp']))
            mensaje_wsp = f"Hola, vi tu perfil en Verifica La Paz y me interesa tu servicio de {texto}."
            link_wsp = f"https://wa.me/591{numero_limpio}?text={mensaje_wsp}"
            respuesta += f"📞 [Contactar por WhatsApp]({link_wsp})\n"
        elif p['telefono']:
            respuesta += f" {p['telefono']}\n"
            
        respuesta += "\n"
    
    respuesta += "💡 _Estos proveedores han sido verificados personalmente por nuestro equipo._"
    
    await update.message.reply_text(respuesta, parse_mode='Markdown', disable_web_page_preview=True)

def main():
    if TOKEN == "TU_TOKEN_DE_TELEGRAM_AQUI":
        print("⚠️ ERROR: Debes poner tu token de Telegram en la variable TOKEN.")
        return

    print("🚀 Iniciando Bot de Telegram de Verifica La Paz...")
    app = Application.builder().token(TOKEN).build()
    
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("ayuda", start))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, manejar_mensaje))
    
    app.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == '__main__':
    main()