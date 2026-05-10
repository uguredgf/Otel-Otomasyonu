<<<<<<< HEAD
DROP PROCEDURE IF EXISTS sp_FaturaKes;
=======
﻿DROP PROCEDURE IF EXISTS sp_FaturaKes;
>>>>>>> 6eb49ac (Admin islemler, misafir listesi ve oda tipleri guncellendi)
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

<<<<<<< HEAD
    -- 1. Oda fiyatını ve gün sayısını alalım (Doğru JOIN ve Sütun isimleri ile)
=======
    -- 1. Oda fiyat─▒n─▒ ve g├╝n say─▒s─▒n─▒ alal─▒m (Do─şru JOIN ve S├╝tun isimleri ile)
>>>>>>> 6eb49ac (Admin islemler, misafir listesi ve oda tipleri guncellendi)
    SELECT ot.odaTur_taban_fiyat, DATEDIFF(r.rezerve_cikis_tarihi, r.rezerve_giris_tarihi)
    INTO v_oda_fiyat, v_gun_sayisi
    FROM Rezervasyonlar r
    JOIN Odalar o ON r.oda_id = o.oda_id
<<<<<<< HEAD
    JOIN Oda_Turleri ot ON o.odaTur_id = ot.odaTur_id -- Doğru eşleşme
    WHERE r.rezervasyon_id = p_rezervasyon_id;

    -- 2. Hizmetlerin toplamını alalım
=======
    JOIN Oda_Turleri ot ON o.odaTur_id = ot.odaTur_id -- Do─şru e┼şle┼şme
    WHERE r.rezervasyon_id = p_rezervasyon_id;

    -- 2. Hizmetlerin toplam─▒n─▒ alal─▒m
>>>>>>> 6eb49ac (Admin islemler, misafir listesi ve oda tipleri guncellendi)
    SELECT IFNULL(SUM(rh.hizmet_adet * h.hizmet_birim_fiyat), 0)
    INTO v_hizmet_toplam
    FROM Rezervasyon_Hizmetleri rh
    JOIN Hizmetler h ON rh.hizmet_id = h.hizmet_id
    WHERE rh.rezervasyon_id = p_rezervasyon_id;

    -- 3. Toplam hesaplama
    SET v_genel_toplam = (v_oda_fiyat * v_gun_sayisi) + v_hizmet_toplam;

<<<<<<< HEAD
    -- 4. Faturayı kaydedelim
=======
    -- 4. Faturay─▒ kaydedelim
>>>>>>> 6eb49ac (Admin islemler, misafir listesi ve oda tipleri guncellendi)
    INSERT INTO Faturalar (rezervasyon_id, fatura_toplam_tutar, fatura_odeme_tarihi, fatura_odeme_yontemi)
    VALUES (p_rezervasyon_id, v_genel_toplam, NOW(), p_odeme_yontemi);

END //
<<<<<<< HEAD
DELIMITER ;
=======
DELIMITER ;
>>>>>>> 6eb49ac (Admin islemler, misafir listesi ve oda tipleri guncellendi)
