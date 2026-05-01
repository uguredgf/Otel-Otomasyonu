# backend/database.py
import mysql.connector
from mysql.connector import Error

def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            database='otel_otomasyonu', # Hilal'in kurduğu db adı
            user='root', # Kendi MySQL kullanıcı adın (genelde root'tur)
            password='' # Kendi MySQL şifren (yoksa boş bırak)
        )
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"Veritabanına bağlanırken hata oluştu: {e}")
        return None