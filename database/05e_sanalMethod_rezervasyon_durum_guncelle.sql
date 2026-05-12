-- rezerve edilen odanın durumunun guncellenmesi , iptal ve check-out işlemleri için oluşturulan procedure
DROP PROCEDURE IF EXISTS sp_RezervasyonDurumGuncelle;
DELIMITER //

CREATE PROCEDURE sp_RezervasyonDurumGuncelle(
    IN p_rezervasyon_id INT,
    IN p_yeni_durum ENUM('Beklemede', 'Onaylandı', 'Tamamlandı', 'İptal Edildi')
)
BEGIN
    -- 1. Rezervasyonun durumunu güncelle
    UPDATE Rezervasyonlar 
    SET rezerve_durumu = p_yeni_durum 
    WHERE rezervasyon_id = p_rezervasyon_id;

    -- 2. İşlem kaydı tablosuna kimin ne yaptığını ekliyoruz.
    INSERT INTO Islem_Kayitlari (personel_id, kayit_islem_tipi, kayit_aciklama)
    VALUES (3, 'Durum Guncelleme', CONCAT(p_rezervasyon_id, ' nolu rezervasyon ', p_yeni_durum, ' olarak degistirildi.'));

    -- NOT: Burada odayı güncellemek için ekstra kod yazmıyacağım.
    -- Elimde olan 'trg_oda_durumu_guncelle' tetikleyicimiz bunu zaten otomatik yapıyor.
END //

DELIMITER ;