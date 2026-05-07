DROP PROCEDURE IF EXISTS sp_FaturaKes;
DELIMITER //

CREATE PROCEDURE sp_FaturaKes(
    IN p_rezervasyon_id INT,
    IN p_odeme_yontemi VARCHAR(50)
)
BEGIN
    DECLARE v_oda_fiyat DECIMAL(10,2);
    DECLARE v_gun_sayisi INT;
    DECLARE v_hizmet_toplam DECIMAL(10,2);
    DECLARE v_genel_toplam DECIMAL(10,2);

    -- 1. Oda fiyatını ve gün sayısını alalım (Doğru JOIN ve Sütun isimleri ile)
    SELECT ot.odaTur_taban_fiyat, DATEDIFF(r.rezerve_cikis_tarihi, r.rezerve_giris_tarihi)
    INTO v_oda_fiyat, v_gun_sayisi
    FROM Rezervasyonlar r
    JOIN Odalar o ON r.oda_id = o.oda_id
    JOIN Oda_Turleri ot ON o.odaTur_id = ot.odaTur_id -- Doğru eşleşme
    WHERE r.rezervasyon_id = p_rezervasyon_id;

    -- 2. Hizmetlerin toplamını alalım
    SELECT IFNULL(SUM(rh.hizmet_adet * h.hizmet_birim_fiyat), 0)
    INTO v_hizmet_toplam
    FROM Rezervasyon_Hizmetleri rh
    JOIN Hizmetler h ON rh.hizmet_id = h.hizmet_id
    WHERE rh.rezervasyon_id = p_rezervasyon_id;

    -- 3. Toplam hesaplama
    SET v_genel_toplam = (v_oda_fiyat * v_gun_sayisi) + v_hizmet_toplam;

    -- 4. Faturayı kaydedelim
    INSERT INTO Faturalar (rezervasyon_id, fatura_toplam_tutar, fatura_odeme_tarihi, fatura_odeme_yontemi)
    VALUES (p_rezervasyon_id, v_genel_toplam, NOW(), p_odeme_yontemi);

END //
DELIMITER ;