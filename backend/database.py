import mysql.connector
from mysql.connector import Error

def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host='127.0.0.1', 
            database='otel_otomasyonu', 
            user='root', 
            password='',
            use_pure=True
        )
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"Veritabanı bağlantı hatası: {e}")
        return None