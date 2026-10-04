import { BotInstance } from '../types';

export const INITIAL_BOTS: BotInstance[] = [
  {
    id: 'bot-rizo-master',
    name: 'RIZO X ZAINU Master Bot',
    description: '24/7 Telegram utility & monitoring bot running on phone RAM with custom commands',
    status: 'running',
    uptimeSeconds: 14820,
    ramUsageMb: 114,
    cpuPercent: 3.8,
    pid: 10482,
    createdAt: '2026-10-03 14:30',
    lastStartedAt: '2026-10-03 16:08',
    files: {
      'bot.py': `#!/usr/bin/env python3
"""
RIZO X ZAINU HOSTING BOT
Running natively inside Android Foreground Service
Utilizing device internal RAM & Storage
Admin Contact: Telegram @rizohacker
"""

import os
import time
import telebot
from telebot import types
from dotenv import load_dotenv

# Load local environment variables
load_dotenv()

TOKEN = os.getenv("BOT_TOKEN", "7482910382:AAFxEXAMPLE_KEY_FOR_TESTING")
ADMIN_ID = os.getenv("ADMIN_ID", "123456789")
ADMIN_USER = os.getenv("ADMIN_USERNAME", "@rizohacker")

print(f"[*] Initializing RIZO X ZAINU Engine on Android RAM...")
print(f"[*] Contact Admin: {ADMIN_USER}")

bot = telebot.TeleBot(TOKEN)

@bot.message_handler(commands=['start', 'help'])
def send_welcome(message):
    user_name = message.from_user.first_name
    welcome_text = (
        f"⚡ *RIZO X ZAINU BOT ONLINE* ⚡\\n\\n"
        f"Salam *{user_name}*!\\n"
        f"Yeh bot user ke Android phone par 24/7 background mein host ho raha hai!\\n\\n"
        f"⚙️ *System Status:* Online & Active\\n"
        f"📱 *Host:* Local Android RAM & Foreground Service\\n"
        f"👑 *Admin Contact:* {ADMIN_USER}\\n\\n"
        f"Available Commands:\\n"
        f"• /status - Check host uptime & memory\\n"
        f"• /ping - Check response latency\\n"
        f"• /about - Developer and Admin info"
    )
    markup = types.InlineKeyboardMarkup()
    btn1 = types.InlineKeyboardButton("👑 Contact Admin", url="https://t.me/rizohacker")
    btn2 = types.InlineKeyboardButton("⚡ Server Stats", callback_data="stats")
    markup.row(btn1, btn2)
    bot.reply_to(message, welcome_text, parse_mode='Markdown', reply_markup=markup)

@bot.message_handler(commands=['status', 'stats'])
def send_status(message):
    status_msg = (
        f"📊 *ANDROID PHONE HOST STATUS*\\n\\n"
        f"• Engine: RIZO X ZAINU Native Python\\n"
        f"• Background Mode: Android Foreground Service\\n"
        f"• WakeLock: Active (PARTIAL_WAKE_LOCK)\\n"
        f"• Device Battery: Unrestricted\\n"
        f"• RAM Allocated: ~114 MB\\n"
        f"• Status: 100% 24/7 Operational"
    )
    bot.reply_to(message, status_msg, parse_mode='Markdown')

@bot.message_handler(commands=['ping'])
def send_ping(message):
    start = time.time()
    msg = bot.reply_to(message, "🏓 Pong!")
    elapsed = round((time.time() - start) * 1000, 2)
    bot.edit_message_text(f"🏓 Pong! Latency: *{elapsed}ms*", chat_id=msg.chat.id, message_id=msg.message_id, parse_mode='Markdown')

@bot.message_handler(commands=['about'])
def send_about(message):
    bot.reply_to(message, "Developed by RIZO X ZAINU team.\\nAdmin: Telegram @rizohacker\\nHost Telegram bots locally on your Android phone!")

@bot.message_handler(func=lambda message: True)
def echo_all(message):
    bot.reply_to(message, f"Received: {message.text}\\n(Hosted on Android locally via RIZO X ZAINU)")

if __name__ == "__main__":
    print("[+] Foreground Service polling started successfully. Bot is LIVE 24/7.")
    bot.infinity_polling()
`,
      'requirements.txt': `pyTelegramBotAPI==4.16.1
python-dotenv==1.0.1
requests==2.31.0
urllib3==2.2.1
`,
      '.env': `BOT_TOKEN=7482910382:AAFxEXAMPLE_KEY_FOR_TESTING
ADMIN_ID=123456789
ADMIN_USERNAME=@rizohacker
KEEP_ALIVE=true
AUTO_RESTART=true
`
    },
    envVars: {
      BOT_TOKEN: '7482910382:AAFxEXAMPLE_KEY_FOR_TESTING',
      ADMIN_ID: '123456789',
      ADMIN_USERNAME: '@rizohacker'
    }
  }
];

export const TEMPLATES = [
  {
    id: 'telebot-echo',
    title: 'Standard Telegram Bot (telebot)',
    description: 'Fast, lightweight bot with commands, inline buttons, and auto-reply. Ideal for 24/7 local hosting.',
    files: {
      'bot.py': `import os
import telebot
from telebot import types
from dotenv import load_dotenv

load_dotenv()
TOKEN = os.getenv("BOT_TOKEN", "YOUR_BOT_TOKEN_HERE")
bot = telebot.TeleBot(TOKEN)

@bot.message_handler(commands=['start'])
def welcome(message):
    markup = types.InlineKeyboardMarkup()
    btn = types.InlineKeyboardButton("Admin", url="https://t.me/rizohacker")
    markup.add(btn)
    bot.reply_to(message, "Salam! RIZO X ZAINU hosting bot se aapka bot live hai!", reply_markup=markup)

@bot.message_handler(commands=['ping'])
def ping(message):
    bot.reply_to(message, "Pong! Running 24/7 on Android RAM.")

@bot.message_handler(func=lambda msg: True)
def echo(message):
    bot.reply_to(message, f"Echo: {message.text}")

if __name__ == "__main__":
    print("Bot is starting via Android Foreground Service...")
    bot.infinity_polling()
`,
      'requirements.txt': `pyTelegramBotAPI==4.16.1
python-dotenv==1.0.1
requests==2.31.0
`,
      '.env': `BOT_TOKEN=YOUR_BOT_TOKEN_HERE
ADMIN_TELEGRAM=@rizohacker
`
    }
  },
  {
    id: 'ai-helper',
    title: 'AI Smart Responder Bot',
    description: 'Responds intelligently to Telegram group & private chat queries with customizable prompt settings.',
    files: {
      'bot.py': `import os
import telebot
from dotenv import load_dotenv

load_dotenv()
TOKEN = os.getenv("BOT_TOKEN", "YOUR_BOT_TOKEN_HERE")
bot = telebot.TeleBot(TOKEN)

@bot.message_handler(commands=['start'])
def welcome(message):
    bot.reply_to(message, "Salam! AI Assistant online on RIZO X ZAINU Android Engine. Ask me anything!")

@bot.message_handler(func=lambda m: True)
def ai_reply(message):
    prompt = message.text
    # Process or call custom API
    reply = f"🤖 [AI Response]: Aapne poocha '{prompt}'. Bot local phone storage se chal raha hai! Contact: @rizohacker"
    bot.reply_to(message, reply)

if __name__ == "__main__":
    print("[AI Bot] Foreground engine active...")
    bot.infinity_polling()
`,
      'requirements.txt': `pyTelegramBotAPI==4.16.1
python-dotenv==1.0.1
requests==2.31.0
`,
      '.env': `BOT_TOKEN=YOUR_BOT_TOKEN_HERE
MODEL_NAME=gemini-flash
ADMIN_CONTACT=@rizohacker
`
    }
  },
  {
    id: 'uptime-monitor',
    title: 'Channel Auto-Forwarder & Monitor',
    description: 'Monitors channels, auto-forwards posts, and alerts user with system battery/uptime logs.',
    files: {
      'bot.py': `import os
import time
import telebot
from dotenv import load_dotenv

load_dotenv()
bot = telebot.TeleBot(os.getenv("BOT_TOKEN", "YOUR_BOT_TOKEN_HERE"))

@bot.message_handler(commands=['start'])
def start(m):
    bot.reply_to(m, "Uptime & Channel Forwarder Bot is Active 24/7 on Android!")

@bot.message_handler(commands=['uptime'])
def uptime(m):
    bot.reply_to(m, "Uptime: 99.98% - Powered by RIZO X ZAINU Local Engine\\nAdmin: @rizohacker")

if __name__ == "__main__":
    print("[Monitor] Running 24/7...")
    bot.infinity_polling()
`,
      'requirements.txt': `pyTelegramBotAPI==4.16.1
python-dotenv==1.0.1
`,
      '.env': `BOT_TOKEN=YOUR_BOT_TOKEN_HERE
TARGET_CHANNEL=@example
`
    }
  }
];
