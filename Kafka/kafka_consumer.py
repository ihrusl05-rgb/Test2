# kafka_consumer.py
import asyncio
import json
from aiokafka import AIOKafkaConsumer
from config import Config
from bot import bot, format_message

async def consume_messages():
    """Читает сообщения из Кафки и отправляет в Телеграм"""

    print("Запуск потребителя Кафки...")

    # Создаем потребителя
    consumer = AIOKafkaConsumer(
        Config.KAFKA_TOPIC,
        bootstrap_servers=Config.KAFKA_BOOTSTRAP_SERVERS,
        group_id="telegram-group",
        auto_offset_reset="latest"
    )

    # Запускаем потребителя
    await consumer.start()
    print(f"Подключено к топику: {Config.KAFKA_TOPIC}")

    try:
        # Читаем сообщения
        async for msg in consumer:
            try:
                # Декодируем сообщение
                data = json.loads(msg.value.decode('utf-8'))
                print(f"Получено из Кафки: {data}")

                # Форматируем сообщение
                text = format_message(data)

                # Отправляем в Телеграм
                await bot.send_message(
                    chat_id=Config.TELEGRAM_CHAT_ID,
                    text=text,
                    parse_mode="HTML"
                )

                print("✅ Сообщение отправлено в Телеграм")

            except Exception as e:
                print(f"❌ Ошибка обработки: {e}")

    finally:
        # Останавливаем потребителя
        await consumer.stop()

if __name__ == "__main__":
    asyncio.run(consume_messages())