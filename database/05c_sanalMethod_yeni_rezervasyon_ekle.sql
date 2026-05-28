-- Otomatik atama yerine müşterinin seçtiği oda ID'sine göre rezervasyon yapacak şekilde prosedürü güncelledik.
DROP PROCEDURE IF EXISTS sp_YeniRezervasyonEkle;

DELIMITER //

CREATE PROCEDURE sp_YeniRezervasyonEkle(
    IN p_isim VARCHAR(50),
    IN p_soyisim VARCHAR(50),
    IN p_tc CHAR(11),
    IN p_tel VARCHAR(15),
    IN p_mail VARCHAR(100),
    IN p_oda_id INT, -- DEĞİŞİM: Artık oda türü adı değil, doğrudan seçilen odanın ID'si geliyor.
    IN p_giris DATE,
    IN p_cikis DATE
)
BEGIN
    DECLARE v_musteri_id INT;
    DECLARE v_cakisma_sayisi INT;

    -- 1. ADIM: MÜŞTERİ TANIMA
    SELECT musteri_id INTO v_musteri_id 
    FROM Musteriler 
    WHERE musteri_tc_no = p_tc;

    IF v_musteri_id IS NULL THEN
        INSERT INTO Musteriler (musteri_adi, musteri_soyadi, musteri_tc_no, musteri_telefon, musteri_email)
        VALUES (p_isim, p_soyisim, p_tc, p_tel, p_mail);
        
        SET v_musteri_id = LAST_INSERT_ID();
    END IF;

    -- 2. ADIM: MÜSAİTLİK SON KONTROLÜ (Çifte Rezervasyon Önlemi)
    -- Kullanıcı ekranda odayı seçip butona basana kadar geçen sürede başkası bu odayı almış olabilir.
    SELECT COUNT(*) INTO v_cakisma_sayisi
    FROM Rezervasyonlar r
    WHERE r.oda_id = p_oda_id
      AND r.rezerve_durumu NOT IN ('İptal Edildi')
      AND (p_giris < r.rezerve_cikis_tarihi AND p_cikis > r.rezerve_giris_tarihi);

    -- 3. ADIM: REZERVASYON KAYDI VE LOGLAMA
    IF v_cakisma_sayisi = 0 THEN
        -- Çakışma yoksa rezervasyonu güvenle oluştur
        INSERT INTO Rezervasyonlar (musteri_id, oda_id, rezerve_giris_tarihi, rezerve_cikis_tarihi, rezerve_durumu)
        VALUES (v_musteri_id, p_oda_id, p_giris, p_cikis, 'Beklemede');
        
        -- Log açıklamasını otomatik atamadan, spesifik seçime göre güncelledik
        INSERT INTO Islem_Kayitlari (personel_id, kayit_islem_tipi, kayit_aciklama)
        VALUES (1, 'Yeni Rezervasyon', CONCAT(p_tc, ' TC nolu misafir için ', p_oda_id, ' IDli oda rezerve edildi.'));
    ELSE
        -- Çakışma varsa işlemi durdur ve hata fırlat
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Üzgünüz, seçtiğiniz oda az önce rezerve edilmiştir. Lütfen listeden başka bir oda seçiniz.';
    END IF;

END //

DELIMITER ;