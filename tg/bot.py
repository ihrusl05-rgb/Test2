# bot.py
import asyncio
import json
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiokafka import AIOKafkaConsumer
from config import Config

print("Запуск Телеграм-бота...")

# Создаем бота
bot = Bot(token=Config.TELEGRAM_BOT_TOKEN)
dp = Dispatcher()

# Функция для форматирования сообщения
def format_message(data):
    """Преобразует данные из базы в красивое сообщение"""

    operation = data.get('operation', 'unknown')
    table = data.get('table', 'unknown')

    # Определяем, что за операция
    if operation == 'INSERT':
        action = "добавлен"
    elif operation == 'UPDATE':
        action = "обновлен"
    else:
        action = operation

    # Создаем сообщение
    message = f"🔔 <b>Изменение в базе данных</b>\n\n"
    message += f"📊 Таблица: <code>{table}</code>\n"
    message += f"✏️ Действие: <b>{action}</b>\n\n"

    # Добавляем данные
    if 'data' in data:
        message += "📋 <b>Данные:</b>\n"
        for key, value in data['data'].items():
            message += f"  • <code>{key}</code>: {value}\n"

    return message

# Обработчик команды /start
@dp.message(Command("start"))
async def cmd_start(message: types.Message):
    await message.answer(
        "👋 Привет! Я бот для уведомлений об изменениях в базе данных.\n\n"
        "Я буду присылать тебе сообщения, когда кто-то добавляет или изменяет товары/категории."
    )

# Запускаем бота
async def main():
    print(f"Бот запущен! Отправь /start в чат")

    # Запускаем поллинг (прослушивание сообщений)
    await dp.start_polling(bot)

if __name__ == '__main__':
    asyncio.run(main())