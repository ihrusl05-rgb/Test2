# config.py
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # РќР°СЃС‚СЂРѕР№РєРё Р±Р°Р·С‹ РґР°РЅРЅС‹С…
    POSTGRES_HOST = os.getenv('POSTGRES_HOST', 'localhost')
    POSTGRES_PORT = os.getenv('POSTGRES_PORT', '5432')
    POSTGRES_DB = os.getenv('POSTGRES_DB', 'your_database_name')
    POSTGRES_USER = os.getenv('POSTGRES_USER', 'postgres')
    POSTGRES_PASSWORD = os.getenv('POSTGRES_PASSWORD', 'your_password')

    # РќР°СЃС‚СЂРѕР№РєРё РљР°С„РєРё
    KAFKA_BOOTSTRAP_SERVERS = os.getenv('KAFKA_BOOTSTRAP_SERVERS', 'localhost:29092')
    KAFKA_TOPIC = os.getenv('KAFKA_TOPIC', 'wal_listener.db-changes')

    # РќР°СЃС‚СЂРѕР№РєРё РўРµР»РµРіСЂР°РјР°
    TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
    TELEGRAM_CHAT_ID = os.getenv('TELEGRAM_CHAT_ID')


