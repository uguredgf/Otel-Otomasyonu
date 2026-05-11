-- arayüzden gelen verilerle rezervasyon kaydetme 
DROP PROCEDURE IF EXISTS sp_YeniRezervasyonEkle;

DELIMITER //

CREATE PROCEDURE sp_YeniRezervasyonEkle(
    IN p_isim VARCHAR(50),
    IN p_soyisim VARCHAR(50),
    IN p_tc CHAR(11),
    IN p_tel VARCHAR(15),
    IN p_mail VARCHAR(100),
    IN p_oda_turu_adi VARCHAR(50), -- Ece'nin formundan gelen 'Ekonomik', 'Kral Dairesi' gibi metin
    IN p_giris DATE,
    IN p_cikis DATE
)
BEGIN
    DECLARE v_musteri_id INT;
    DECLARE v_atanacak_oda_id INT;

    -- 1. ADIM: MÜŞTERİ TANIMA (Resepsiyonist Mantığı)
    -- TC Kimlik numarasından bu müşterinin daha önce otelde kalıp kalmadığına bakılır.
    --musteri otelde kalmışsa musteri_id degişmez kalmamışsa yeni musteri_id atanır.
    SELECT musteri_id INTO v_musteri_id 
    FROM Musteriler 
    WHERE musteri_tc_no = p_tc;

    -- Eğer müşteri sistemde yoksa (yeni gelmişse) kaydını yapalım
    IF v_musteri_id IS NULL THEN
        INSERT INTO Musteriler (musteri_adi, musteri_soyadi, musteri_tc_no, musteri_telefon, musteri_email)
        VALUES (p_isim, p_soyisim, p_tc, p_tel, p_mail);
        
        -- Yeni eklenen müşterinin ID'sini al.
        SET v_musteri_id = LAST_INSERT_ID();
    END IF;

    -- 2. ADIM: OTOMATİK ODA ATAMA (Akıllı Algoritma)
    -- Seçilen türde, arızalı olmayan ve o tarihlerde başka rezervasyonu olmayan ilk odayı bul
    SELECT o.oda_id INTO v_atanacak_oda_id
    FROM Odalar o
    JOIN Oda_Turleri ot ON o.odaTur_id = ot.odaTur_id
    WHERE ot.odaTur_adi = p_oda_turu_adi
      AND o.oda_durumu != 'Arızalı'
      AND o.oda_id NOT IN (
          -- Tarih çakışması kontrolü
          SELECT r.oda_id FROM Rezervasyonlar r
          WHERE r.rezerve_durumu NOT IN ('İptal Edildi')
            AND (p_giris < r.rezerve_cikis_tarihi AND p_cikis > r.rezerve_giris_tarihi)
      )
    LIMIT 1;

    -- 3. ADIM: REZERVASYON KAYDI VE LOGLAMA
    -- Eğer müsait oda bulunduysa rezervasyonu yap
    IF v_atanacak_oda_id IS NOT NULL THEN
        INSERT INTO Rezervasyonlar (musteri_id, oda_id, rezerve_giris_tarihi, rezerve_cikis_tarihi, rezerve_durumu)
        VALUES (v_musteri_id, v_atanacak_oda_id, p_giris, p_cikis, 'Beklemede');
        
        --işlem geçmişi tablosu için işlem kaydı oluştur
        INSERT INTO Islem_Kayitlari (personel_id, kayit_islem_tipi, kayit_aciklama)
        VALUES (1, 'Yeni Rezervasyon', CONCAT(p_tc, ' TC nolu misafir için otomatik oda atandı.'));
    ELSE
        -- Eğer seçilen türde boş oda yoksa hata mesajı fırlat
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Üzgünüz, seçtiğiniz tarihlerde bu oda türünde müsait yer kalmamıştır.';
    END IF;

END //

DELIMITER ;