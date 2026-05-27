import mysql.connector
from mysql.connector import Error
import os

def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host=os.getenv("DB_HOST", "127.0.0.1"),
            database=os.getenv("DB_NAME", "otel_otomasyonu"),
            user=os.getenv("DB_USER", "root"),
            password=os.getenv("DB_PASSWORD", ""),
            port=int(os.getenv("DB_PORT", "3306")),
            use_pure=True
        )
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"Veritabanı bağlantı hatası: {e}")
        return None