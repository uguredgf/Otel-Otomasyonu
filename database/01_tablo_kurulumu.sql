CREATE DATABASE IF NOT EXISTS otel_otomasyonu CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE otel_otomasyonu;

CREATE TABLE Oda_Turleri (
    odaTur_id INT AUTO_INCREMENT PRIMARY KEY,
    odaTur_adi VARCHAR(50) NOT NULL,
    odaTur_kapasite INT NOT NULL,
    odaTur_taban_fiyat DECIMAL(10, 2) NOT NULL,
    odaTur_aciklama TEXT
);

CREATE TABLE Musteriler (
    musteri_id INT AUTO_INCREMENT PRIMARY KEY,
    musteri_adi VARCHAR(50) NOT NULL,
    musteri_soyadi VARCHAR(50) NOT NULL,
    musteri_tc_no CHAR(11) UNIQUE NOT NULL,
    musteri_telefon VARCHAR(15),
    musteri_email VARCHAR(100)
);

CREATE TABLE Personeller (
    personel_id INT AUTO_INCREMENT PRIMARY KEY,
    personel_adi VARCHAR(50) NOT NULL,
    personel_soyadi VARCHAR(50) NOT NULL,
    personel_rol ENUM('Admin', 'Resepsiyonist', 'Temizlik', 'Mutfak') DEFAULT 'Resepsiyonist',
    personel_kullanici_adi VARCHAR(30) UNIQUE NOT NULL,
    personel_sifre VARCHAR(255) NOT NULL
);

CREATE TABLE Hizmetler (
    hizmet_id INT AUTO_INCREMENT PRIMARY KEY,
    hizmet_adi VARCHAR(100) NOT NULL,
    hizmet_birim_fiyat DECIMAL(10, 2) NOT NULL
);

CREATE TABLE Odalar (
    oda_id INT AUTO_INCREMENT PRIMARY KEY,
    oda_no VARCHAR(10) UNIQUE NOT NULL,
    oda_kat INT,
    odaTur_id INT,
    oda_durumu ENUM('Boş', 'Dolu', 'Temizlikte', 'Arızalı') DEFAULT 'Boş',
    CONSTRAINT fk_oda_odaTuru FOREIGN KEY (odaTur_id) REFERENCES Oda_Turleri(odaTur_id) ON DELETE SET NULL
);

CREATE TABLE Rezervasyonlar (
    rezervasyon_id INT AUTO_INCREMENT PRIMARY KEY,
    musteri_id INT,
    oda_id INT,
    rezerve_giris_tarihi DATE NOT NULL,
    rezerve_cikis_tarihi DATE NOT NULL,
    rezerve_durumu ENUM('Beklemede', 'Onaylandı', 'Tamamlandı', 'İptal Edildi') DEFAULT 'Beklemede',
    CONSTRAINT fk_rez_musteri FOREIGN KEY (musteri_id) REFERENCES Musteriler(musteri_id) ON DELETE CASCADE,
    CONSTRAINT fk_rez_oda FOREIGN KEY (oda_id) REFERENCES Odalar(oda_id) ON DELETE CASCADE
);

CREATE TABLE Rezervasyon_Hizmetleri (
    rezervasyon_hizmet_id INT AUTO_INCREMENT PRIMARY KEY,
    rezervasyon_id INT,
    hizmet_id INT,
    hizmet_adet INT,
    hizmet_islem_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_hizmet_rez FOREIGN KEY (rezervasyon_id) REFERENCES Rezervasyonlar(rezervasyon_id) ON DELETE CASCADE,
    CONSTRAINT fk_hizmet_tip FOREIGN KEY (hizmet_id) REFERENCES Hizmetler(hizmet_id)
);

CREATE TABLE Faturalar (
    fatura_id INT AUTO_INCREMENT PRIMARY KEY,
    rezervasyon_id INT UNIQUE,
    fatura_toplam_tutar DECIMAL(10, 2) NOT NULL,
    fatura_odeme_tarihi DATETIME DEFAULT CURRENT_TIMESTAMP,
    fatura_odeme_yontemi ENUM('Nakit', 'Kredi Kartı') NOT NULL,
    CONSTRAINT fk_fatura_rez FOREIGN KEY (rezervasyon_id) REFERENCES Rezervasyonlar(rezervasyon_id)
);

CREATE TABLE Islem_Kayitlari (
    kayit_id INT AUTO_INCREMENT PRIMARY KEY,
    personel_id INT,
    kayit_islem_tipi VARCHAR(50),
    kayit_islem_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    kayit_aciklama TEXT,
    CONSTRAINT fk_kayit_personel FOREIGN KEY (personel_id) REFERENCES Personeller(personel_id) ON DELETE SET NULL
);