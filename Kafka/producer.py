# producer.py
import psycopg2
import psycopg2.extras
from kafka import KafkaProducer
import json
import time
from config import Config

print("Запуск продюсера...")

# Подключаемся к Кафке
producer = KafkaProducer(
    bootstrap_servers=Config.KAFKA_BOOTSTRAP_SERVERS,
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

print(f"Подключено к Кафке: {Config.KAFKA_BOOTSTRAP_SERVERS}")

# Подключаемся к базе данных
conn = psycopg2.connect(
    host=Config.POSTGRES_HOST,
    port=Config.POSTGRES_PORT,
    database=Config.POSTGRES_DB,
    user=Config.POSTGRES_USER,
    password=Config.POSTGRES_PASSWORD
)

print("Подключено к базе данных")

# Создаем курсор для чтения изменений
cur = conn.cursor()
cur.execute("LISTEN db_changes_channel;")

print("Слушаем изменения в базе данных...")

try:
    while True:
        conn.poll()
        conn.commit()

        # Проверяем, есть ли новые уведомления
        while conn.notifies:
            notify = conn.notifies.pop(0)
            print(f"Получено уведомление: {notify.payload}")

            try:
                # Парсим данные
                data = json.loads(notify.payload)

                # Отправляем в Кафку
                producer.send(Config.KAFKA_TOPIC, value=data)
                producer.flush()

                print(f"✅ Отправлено в Кафку: {data}")

            except Exception as e:
                print(f"❌ Ошибка: {e}")

        time.sleep(0.1)

except KeyboardInterrupt:
    print("\nОстановка...")
finally:
    cur.close()
    conn.close()
    producer.close()