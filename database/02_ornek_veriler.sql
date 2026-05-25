USE otel_otomasyonu;

-- 1. Oda Türleri (Kat ve Cephe Planına Uygun 16 Çeşit)
INSERT INTO Oda_Turleri (odaTur_id, odaTur_adi, odaTur_kapasite, odaTur_taban_fiyat, odaTur_aciklama) VALUES
-- Ekonomik Odalar (Arka, Deniz, Bahçe/Havuz)
(1, 'Ekonomik Oda - Arka Cephe', 1, 800.00, 'Arka cephe, temel ihtiyaçlar.'),
(2, 'Ekonomik Oda - Bahçe ve Havuz Manzaralı', 1, 1000.00, 'Giriş katında havuza ve bahçeye bakan ekonomik oda.'),
(3, 'Ekonomik Oda - Deniz Manzaralı', 1, 1100.00, 'Üst katlarda deniz manzaralı ekonomik oda.'),
-- Standart Tek Kişilik Odalar
(4, 'Standart Tek Kişilik - Arka Cephe', 1, 1200.00, 'Arka cephe, sessiz standart oda.'),
(5, 'Standart Tek Kişilik - Bahçe ve Havuz Manzaralı', 1, 1400.00, 'Giriş katında havuz gören standart tek oda.'),
(6, 'Standart Tek Kişilik - Deniz Manzaralı', 1, 1600.00, 'Deniz manzaralı premium tek kişilik oda.'),
-- Standart Çift Kişilik Odalar
(7, 'Standart Çift Kişilik - Arka Cephe', 2, 1800.00, 'Arka cephe geniş yataklı rahat çift kişilik oda.'),
(8, 'Standart Çift Kişilik - Bahçe ve Havuz Manzaralı', 2, 2100.00, 'Giriş katında havuza ve bahçeye bakan çift kişilik oda.'),
(9, 'Standart Çift Kişilik - Deniz Manzaralı', 2, 2500.00, 'Kesintisiz deniz manzaralı, lüks çift kişilik oda.'),
-- Aile Odaları
(10, 'Aile Süiti - Arka Cephe', 4, 3500.00, 'Arka cepheye bakan, 2 odalı geniş aile süiti.'),
(11, 'Aile Süiti - Deniz Manzaralı', 4, 4500.00, 'Deniz manzaralı, geniş ve balkonlu aile süiti.'),
-- Balayı Süitleri (8. ve 9. Katlar)
(12, 'Balayı Süiti - Arka Cephe', 2, 4000.00, 'Arka cepheye bakan standart balayı süiti.'),
(13, 'Balayı Süiti - Jakuzili ve Deniz Manzaralı', 2, 6500.00, 'Deniz manzaralı, odanın içinde özel jakuzisi bulunan lüks süit.'),
-- Kral Daireleri (10. Kat)
(14, 'Kral Dairesi - Arka Cephe', 2, 8000.00, 'Arka cepheye bakan geniş lüks daire.'),
(15, 'Kral Dairesi - Deniz Manzaralı', 2, 11000.00, 'Panoramik deniz manzaralı lüks daire.'),
(16, 'Kral Dairesi - Özel Havuzlu ve Deniz Manzaralı', 2, 15000.00, 'Kendine ait sonsuzluk havuzu olan, deniz manzaralı VIP daire.');

-- 2. Müşteriler (15 Kişi)
INSERT INTO Musteriler (musteri_id, musteri_adi, musteri_soyadi, musteri_tc_no, musteri_telefon, musteri_email) VALUES
(001, 'Ahmet', 'Yılmaz', '11111111111', '05321112233', 'ahmet.yilmaz@email.com'),
(002, 'Ayşe', 'Demir', '22222222222', '05552223344', 'ayse.demir@email.com'),
(003, 'Mehmet', 'Kaya', '33333333333', '05053334455', 'mehmet.kaya@email.com'),
(004, 'Fatma', 'Çelik', '44444444444', '05334445566', 'fatma.celik@email.com'),
(005, 'Ali', 'Şahin', '55555555555', '05445556677', 'ali.sahin@email.com'),
(006, 'Zeynep', 'Öztürk', '66666666666', '05556667788', 'zeynep.ozturk@email.com'),
(007, 'Mustafa', 'Aydın', '77777777777', '05327778899', 'mustafa.aydin@email.com'),
(008, 'Elif', 'Polat', '88888888888', '05058889900', 'elif.polat@email.com'),
(009, 'Osman', 'Can', '99999999999', '05339990011', 'osman.can@email.com'),
(010, 'Merve', 'Yıldız', '10101010101', '05441002233', 'merve.yildiz@email.com'),
(011, 'Emre', 'Kurt', '12121212121', '05552003344', 'emre.kurt@email.com'),
(012, 'Ceren', 'Arslan', '13131313131', '05323004455', 'ceren.arslan@email.com'),
(013, 'Can', 'Doğan', '14141414141', '05054005566', 'can.dogan@email.com'),
(014, 'Deniz', 'Tekin', '15151515151', '05335006677', 'deniz.tekin@email.com'),
(015, 'Burak', 'Şen', '16161616161', '05446007788', 'burak.sen@email.com');

-- 3. Personeller (Mutfak ve Şoför silindi, sadece sisteme girecek yetkililer bırakıldı)
INSERT INTO Personeller (personel_id , personel_adi, personel_soyadi, personel_rol, personel_kullanici_adi, personel_sifre) VALUES
(001, 'Uğur', 'Erdoğan', 'Admin', 'backend_admin_ugur', 'ugur2026'),
(002, 'Ecenur', 'Eke', 'Admin', 'frontend_admin_ece', 'ece2026'),
(003, 'Hilal', 'Çoğul', 'Admin', 'database_admin_hilal', 'hilal2026'),
(005, 'Ayten', 'Temiz', 'Temizlik', 'temizlik_ayten', 'ayten2026'),
(006, 'Kemal', 'Müdür', 'Admin', 'admin_kemal', 'kemal2026'),
(007, 'Seda', 'Gül', 'Resepsiyonist', 'res_seda', 'seda2026'),
(009, 'Zehra', 'Pırıl', 'Temizlik', 'temizlik_zehra', 'zehra2026');

-- 4. Hizmetler (10 Çeşit Ekstra)
INSERT INTO Hizmetler (hizmet_id, hizmet_adi, hizmet_birim_fiyat) VALUES
(001, 'Açık Büfe Kahvaltı', 300.00),
(002, 'SPA & Masaj', 1200.00),
(003, 'Minibar Kullanımı', 250.00),
(004, 'Havaalanı VIP Transfer', 800.00),
(005, 'Oda Servisi (Akşam Yemeği)', 600.00),
(006, 'Kuru Temizleme', 150.00),
(007, 'Ütü Hizmeti', 100.00),
(008, 'Kapalı Havuz Girişi', 200.00),
(009, 'Otopark ve Vale', 100.00),
(010, 'Geç Çıkış (Late Check-out)', 500.00);

-- 5. Odalar
INSERT INTO Odalar (oda_id, oda_no, oda_kat, odaTur_id, oda_durumu) VALUES
-- 1. KAT: Sadece Havuz ve Bahçeye Bakanlar (Ekonomik, Tek, Çift)
(1, '101', 1, 2, 'Boş'), (2, '102', 1, 2, 'Boş'), (3, '103', 1, 2, 'Boş'), (4, '104', 1, 5, 'Boş'), (5, '105', 1, 5, 'Boş'),
(6, '106', 1, 8, 'Boş'), (7, '107', 1, 8, 'Boş'), (8, '108', 1, 8, 'Boş'), (9, '109', 1, 5, 'Boş'), (10, '110', 1, 2, 'Boş'),
-- 2. KAT: Deniz ve Arka Cephe Karışık (Ekonomik, Standart, Aile)
(11, '201', 2, 1, 'Boş'), (12, '202', 2, 3, 'Boş'), (13, '203', 2, 4, 'Boş'), (14, '204', 2, 6, 'Boş'), (15, '205', 2, 7, 'Boş'),
(16, '206', 2, 9, 'Boş'), (17, '207', 2, 10, 'Boş'), (18, '208', 2, 11, 'Boş'), (19, '209', 2, 1, 'Boş'), (20, '210', 2, 9, 'Boş'),
-- 3. KAT: Deniz ve Arka Cephe Karışık (Ekonomik, Standart, Aile)
(21, '301', 3, 3, 'Boş'), (22, '302', 3, 1, 'Boş'), (23, '303', 3, 6, 'Boş'), (24, '304', 3, 4, 'Boş'), (25, '305', 3, 9, 'Boş'),
(26, '306', 3, 7, 'Boş'), (27, '307', 3, 11, 'Boş'), (28, '308', 3, 10, 'Boş'), (29, '309', 3, 9, 'Boş'), (30, '310', 3, 3, 'Boş'),
-- 4. KAT: Deniz ve Arka Cephe Karışık (Ekonomik, Standart, Aile)
(31, '401', 4, 11, 'Boş'), (32, '402', 4, 10, 'Boş'), (33, '403', 4, 1, 'Boş'), (34, '404', 4, 3, 'Boş'), (35, '405', 4, 4, 'Boş'),
(36, '406', 4, 6, 'Boş'), (37, '407', 4, 7, 'Boş'), (38, '408', 4, 9, 'Boş'), (39, '409', 4, 11, 'Boş'), (40, '410', 4, 1, 'Boş'),
-- 5. KAT: Deniz ve Arka Cephe Karışık (Ağırlıklı Aile ve Standart)
(41, '501', 5, 11, 'Boş'), (42, '502', 5, 10, 'Boş'), (43, '503', 5, 9, 'Boş'), (44, '504', 5, 7, 'Boş'), (45, '505', 5, 6, 'Boş'),
(46, '506', 5, 4, 'Boş'), (47, '507', 5, 3, 'Boş'), (48, '508', 5, 1, 'Boş'), (49, '509', 5, 11, 'Boş'), (50, '510', 5, 9, 'Boş'),
-- 6. KAT: Deniz ve Arka Cephe Karışık (Ağırlıklı Aile ve Standart)
(51, '601', 6, 9, 'Boş'), (52, '602', 6, 7, 'Boş'), (53, '603', 6, 11, 'Boş'), (54, '604', 6, 10, 'Boş'), (55, '605', 6, 6, 'Boş'),
(56, '606', 6, 4, 'Boş'), (57, '607', 6, 1, 'Boş'), (58, '608', 6, 3, 'Boş'), (59, '609', 6, 11, 'Boş'), (60, '610', 6, 7, 'Boş'),
-- 7. KAT: Deniz ve Arka Cephe Karışık (Ağırlıklı Aile ve Standart)
(61, '701', 7, 10, 'Boş'), (62, '702', 7, 11, 'Boş'), (63, '703', 7, 7, 'Boş'), (64, '704', 7, 9, 'Boş'), (65, '705', 7, 4, 'Boş'),
(66, '706', 7, 6, 'Boş'), (67, '707', 7, 1, 'Boş'), (68, '708', 7, 3, 'Boş'), (69, '709', 7, 10, 'Boş'), (70, '710', 7, 11, 'Boş'),
-- 8. KAT: Balayı Süitleri (Arka Cephe, Deniz Manzaralı ve Jakuzili)
(71, '801', 8, 12, 'Boş'), (72, '802', 8, 12, 'Boş'), (73, '803', 8, 12, 'Boş'), (74, '804', 8, 12, 'Boş'), (75, '805', 8, 13, 'Boş'),
(76, '806', 8, 13, 'Boş'), (77, '807', 8, 13, 'Boş'), (78, '808', 8, 13, 'Boş'), (79, '809', 8, 13, 'Boş'), (80, '810', 8, 13, 'Boş'),
-- 9. KAT: Balayı Süitleri (Arka Cephe, Deniz Manzaralı ve Jakuzili)
(81, '901', 9, 12, 'Boş'), (82, '902', 9, 12, 'Boş'), (83, '903', 9, 12, 'Boş'), (84, '904', 9, 13, 'Boş'), (85, '905', 9, 13, 'Boş'),
(86, '906', 9, 13, 'Boş'), (87, '907', 9, 13, 'Boş'), (88, '908', 9, 13, 'Boş'), (89, '909', 9, 13, 'Boş'), (90, '910', 9, 13, 'Boş'),
-- 10. KAT: Kral Daireleri (Arka Cephe, Deniz Manzaralı, Havuzlu ve Deniz Manzaralı)
(91, '1001', 10, 14, 'Boş'), (92, '1002', 10, 14, 'Boş'), (93, '1003', 10, 15, 'Boş'), (94, '1004', 10, 15, 'Boş'), (95, '1005', 10, 15, 'Boş'),
(96, '1006', 10, 15, 'Boş'), (97, '1007', 10, 16, 'Boş'), (98, '1008', 10, 16, 'Boş'), (99, '1009', 10, 16, 'Boş'), (100, '1010', 10, 16, 'Boş');

-- 6. Rezervasyonlar 
INSERT INTO Rezervasyonlar (rezervasyon_id, musteri_id, oda_id, rezerve_giris_tarihi, rezerve_cikis_tarihi, rezerve_durumu) VALUES
(1, 1, 15, '2026-05-01', '2026-05-05', 'Tamamlandı'), 
(2, 2, 2,  '2026-05-02', '2026-05-07', 'Tamamlandı'), 
(3, 3, 45, '2026-04-28', '2026-05-04', 'Tamamlandı'), 
(4, 4, 72, '2026-05-01', '2026-05-06', 'Tamamlandı'), 
(5, 5, 91, '2026-04-30', '2026-05-07', 'Tamamlandı'), 
(6, 6, 11, '2026-05-04', '2026-05-12', 'Onaylandı'), 
(7, 7, 31, '2026-05-05', '2026-05-15', 'Onaylandı'), 
(8, 8, 22, '2026-05-08', '2026-05-13', 'Onaylandı'), 
(9, 9, 81, '2026-05-06', '2026-05-14', 'Onaylandı'), 
(10, 10, 5, '2026-05-07', '2026-05-11', 'Onaylandı'), 
(11, 11, 75, '2026-05-15', '2026-05-20', 'Beklemede'),
(12, 12, 95, '2026-05-20', '2026-05-25', 'Beklemede'),
(13, 13, 10, '2026-06-01', '2026-06-10', 'Beklemede'),
(14, 14, 55, '2026-06-15', '2026-06-20', 'Beklemede'),
(15, 15, 60, '2026-05-10', '2026-05-15', 'İptal Edildi');

-- 7. Rezervasyon Hizmetleri 
INSERT INTO Rezervasyon_Hizmetleri (rezervasyon_id, hizmet_id, hizmet_adet, hizmet_islem_tarihi) VALUES
(1, 1, 4, '2026-05-02 09:00:00'), (1, 3, 2, '2026-05-03 14:00:00'),
(2, 4, 1, '2026-05-02 10:00:00'), (2, 8, 2, '2026-05-04 11:00:00'),
(3, 5, 3, '2026-04-30 20:00:00'),
(4, 2, 1, '2026-05-02 16:00:00'), (4, 10, 1, '2026-05-06 12:00:00'),
(6, 1, 2, '2026-05-05 08:30:00'), (6, 3, 5, '2026-05-06 22:00:00'),
(7, 5, 2, '2026-05-07 19:00:00'), (9, 4, 1, '2026-05-06 09:00:00');

-- 8. Faturalar 
INSERT INTO Faturalar (fatura_id, rezervasyon_id, fatura_toplam_tutar, fatura_odeme_tarihi, fatura_odeme_yontemi) VALUES
(1, 1, 14550.00, '2026-05-05 10:00:00', 'Kredi Kartı'),
(2, 2, 9200.00,  '2026-05-07 11:30:00', 'Nakit'),
(3, 3, 12400.00, '2026-05-04 09:15:00', 'Kredi Kartı'),
(4, 4, 32000.00, '2026-05-06 10:45:00', 'Kredi Kartı'),
(5, 5, 68000.00, '2026-05-07 08:30:00', 'Nakit'),
(6, 6, 18500.00, '2026-05-04 14:00:00', 'Kredi Kartı'), 
(7, 9, 40800.00, '2026-05-06 12:00:00', 'Nakit'); 

-- 9. İşlem Kayıtları (Loglar)
INSERT INTO Islem_Kayitlari (kayit_id, personel_id, kayit_islem_tipi, kayit_islem_tarihi, kayit_aciklama) VALUES
(1, 7, 'Rezervasyon Onayı', '2026-04-25 10:00:00', '1 numaralı Ahmet Yılmaz rezervasyonu onaylandı.'),
(2, 10, 'Giriş İşlemi', '2026-05-02 14:00:00', '2 numaralı Ayşe Demir otele giriş yaptı.'),
(3, 1, 'Sistem Ayarı', '2026-04-20 09:30:00', 'Uğur tarafından oda taban fiyatları güncellendi.'),
(4, 7, 'Rezervasyon İptali', '2026-05-07 11:15:00', '15 numaralı rezervasyon müşteri talebiyle iptal edildi.'),
(5, 2, 'Fatura Kesimi', '2026-05-05 10:30:00', '1 numaralı rezervasyonun çıkış faturası kesildi.'),
(6, 10, 'Giriş İşlemi', '2026-05-04 12:45:00', '6 numaralı (Zeynep Öztürk) rezervasyon için giriş yapıldı.'),
(7, 7, 'Çıkış İşlemi', '2026-05-07 09:10:00', '2 numaralı rezervasyon sahibi Ayşe Demir otelden ayrıldı.'),
(8, 3, 'Veritabanı Bakımı', '2026-05-08 02:00:00', 'Hilal tarafından sistem yedeklemesi ve oda optimizasyonu yapıldı.'),
(9, 6, 'Oda Durum Güncellemesi', '2026-05-06 08:00:00', '408 numaralı oda arıza nedeniyle kullanıma kapatıldı.'),
(10, 5, 'Temizlik Bildirimi', '2026-05-08 10:10:00', '205 numaralı oda temizlik personeli Ayten tarafından temizliğe alındı.');