# app1

Local Django project with PostgreSQL, Kafka, and wal-listener.

## 1) Prerequisites on another computer

- Git
- Python 3.12+
- PostgreSQL 14+ (or compatible)
- Docker Desktop (for Kafka + wal-listener)

## 2) Clone and basic setup

```powershell
git clone <YOUR_REPO_URL> app1
cd app1
copy .env.example .env
```

Edit `.env` for your local machine (DB access, Telegram token, etc.).

## 3) Install Python dependencies

```powershell
python -m venv .venv
.\.venv\Scripts\activate
python -m pip install --upgrade pip
pip install -r requirements.txt
```

## 4) Database and migrations

Make sure PostgreSQL is running and `.env` values are correct (`DB_*` and `POSTGRES_*`).

```powershell
python manage.py migrate
```

Optional fixture load:

```powershell
python manage.py loaddata fixtures/partners/category.json
python manage.py loaddata fixtures/partners/Product.json
```

## 5) Run Django

```powershell
python manage.py runserver
```

App URL: `http://127.0.0.1:8000/`.

## 6) Run Kafka and wal-listener (Docker)

```powershell
docker compose up -d zookeeper kafka wal-listener
```

Check status:

```powershell
docker compose ps
```

Stop:

```powershell
docker compose down
```

## 7) Optional: run Telegram consumer

Fill these in `.env` first:

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

Run:

```powershell
python Kafka/kafka_consumer.py
```

## Portability additions in this repo

- `.gitignore` to exclude caches, virtualenvs, secrets, and local files
- `.env.example` as a portable environment template
- `requirements.txt` for reproducible dependency install
- `config.py` wrapper so Kafka/Telegram scripts can import `Config`
