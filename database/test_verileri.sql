USE otel_otomasyonu;

-- 1. Oda Türleri (6 Çeşit)
INSERT INTO Oda_Turleri (odaTur_id, odaTur_adi, odaTur_kapasite, odaTur_taban_fiyat, odaTur_aciklama) VALUES
(01, 'Ekonomik Oda', 1, 800.00, 'Arka cephe, temel ihtiyaçlar için uygun ekonomik oda.'),
(02, 'Standart Tek Kişilik', 1, 1200.00, 'Şehir manzaralı standart tek kişilik oda.'),
(03, 'Standart Çift Kişilik', 2, 1800.00, 'Doğa manzaralı çift kişilik rahat oda.'),
(04, 'Aile Süiti', 4, 3500.00, 'Çocuklu aileler için birbirine geçmeli 2 odalı süit.'),
(05, 'Balayı Süiti', 2, 5000.00, 'Deniz manzaralı, özel dekorasyonlu balayı odası.'),
(06, 'Kral Dairesi', 2, 9500.00, 'Özel jakuzili, teraslı, deniz manzaralı ultra lüks daire.');

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

-- 3. Personeller (10 Kişi - Ekip ve diğer çalışanlar) 
INSERT INTO Personeller (personel_id , personel_adi, personel_soyadi, personel_rol, personel_kullanici_adi, personel_sifre) VALUES
(001, 'Uğur', 'Erdoğan', 'Admin ', 'backend_admin_ugur', 'ugur2026'),
(002, 'Ecenur', 'Eke', 'Admin', 'frontend_admin_ece', 'ece2026'),
(003, 'Hilal', 'Çoğul', 'Admin', 'database_admin_hilal', 'hilal2026'),
(004, 'Hasan', 'Demir', 'Mutfak', 'mutfak_hasan', 'hasan2026'),
(005, 'Ayten', 'Temiz', 'Temizlik', 'temizlik_ayten', 'ayten2026'),
(006, 'Kemal', 'Müdür', 'Admin', 'admin_kemal', 'kemal2026'),
(007, 'Seda', 'Gül', 'Resepsiyonist', 'res_seda', 'seda2026'),
(008, 'Murat', 'Aşçı', 'Mutfak', 'mutfak_murat', 'murat2026'),
(009, 'Zehra', 'Pırıl', 'Temizlik', 'temizlik_zehra', 'zehra2026'),
(010, 'Tarik', 'Şoför', 'Resepsiyonist', 'res_tarik', 'tarik2026');

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

-- 5. Odalar (15 Oda)
INSERT INTO Odalar (oda_id, oda_no, oda_kat, odaTur_id, oda_durumu) VALUES
(001, '101', 1, 01, 'Boş'),
(002, '102', 1, 01, 'Dolu'),
(003, '103', 1, 02, 'Temizlikte'),
(004, '104', 1, 02, 'Boş'),
(005, '105', 1, 03, 'Boş'),
(006, '201', 2, 03, 'Dolu'),
(007, '202', 2, 04, 'Dolu'),
(008, '203', 2, 04, 'Arızalı'),
(009, '204', 2, 04, 'Boş'),
(010, '205', 2, 04, 'Temizlikte'),
(011, '301', 3, 05, 'Dolu'),
(012, '302', 3, 05, 'Boş'),
(013, '303', 3, 06, 'Boş'),
(014, '401', 4, 06, 'Dolu'),
(015, '402', 4, 06, 'Boş');

-- 6. Rezervasyonlar (15 Rezervasyon - Geçmiş, Mevcut ve Gelecek)
INSERT INTO Rezervasyonlar (rezervasyon_id, musteri_id, oda_id, rezerve_giris_tarihi, rezerve_cikis_tarihi, rezerve_durumu) VALUES
(001, 001, 002, '2026-05-01', '2026-05-05', 'Tamamlandı'),
(002, 002, 006, '2026-05-10', '2026-05-12', 'Tamamlandı'),
(003, 004, 011, '2026-05-15', '2026-05-20', 'Tamamlandı'),
(004, 005, 014, '2026-05-20', '2026-05-25', 'Tamamlandı'),
(005, 007, 007, '2026-06-01', '2026-06-10', 'Onaylandı'), -- Şu an otelde
(006, 001, 008, '2026-06-05', '2026-06-08', 'Beklemede'),
(007, 003, 015, '2026-07-12', '2026-07-23', 'İptal Edildi'),
(008, 008, 013, '2026-07-14', '2026-07-16', 'Onaylandı'),
(009, 005, 009, '2026-07-20', '2026-07-25', 'Beklemede'),
(010, 009, 012, '2026-08-01', '2026-08-07', 'Onaylandı'),
(011, 010, 013, '2026-08-05', '2026-08-10', 'İptal Edildi'),
(012, 012, 014, '2026-09-15', '2026-09-20', 'Beklemede'),
(013, 013, 012, '2026-09-01', '2026-09-05', 'Onaylandı'),
(014, 005, 014, '2026-09-10', '2026-09-12', 'Beklemede'),
(015, 013, 012, '2026-09-15', '2026-09-20', 'Onaylandı');

-- 7. Rezervasyon Hizmetleri (Ekstra Harcamalar - İlk 5 rezervasyon için)
INSERT INTO Rezervasyon_Hizmetleri (rezervasyon_hizmet_id, rezervasyon_id, hizmet_id, hizmet_adet, hizmet_islem_tarihi) VALUES
(001, 001, 001, 4, '2026-05-02 09:00:00'),
(002, 001, 003, 2, '2026-05-03 14:00:00'),
(003, 002, 004, 1, '2026-05-10 10:00:00'),
(004, 002, 002, 2, '2026-05-11 16:00:00'),
(005, 003, 005, 3, '2026-05-16 19:00:00'),
(006, 003, 007, 5, '2026-05-17 08:30:00'),
(007, 004, 006, 2, '2026-05-21 11:00:00'),
(008, 004, 009, 5, '2026-05-20 15:00:00'),
(009, 005, 001, 2, '2026-06-02 09:30:00'),
(010, 005, 010, 1, '2026-06-10 12:30:00'),
(011, 008, 001, 2, '2026-07-15 08:00:00'),
(012, 010, 002, 1, '2026-08-03 15:00:00'),
(013, 013, 005, 5, '2026-09-03 19:30:00'),
(014, 015, 004, 2, '2026-09-15 11:00:00');

-- 8. Faturalar (Sadece Tamamlanan ve Onaylananlar için)
INSERT INTO Faturalar (fatura_id, rezervasyon_id, fatura_toplam_tutar, fatura_odeme_tarihi , fatura_odeme_yontemi) VALUES
(001, 001, 4900.00, '2026-05-05 10:00:00', 'Kredi Kartı'),
(002, 002, 6800.00, '2026-05-12 11:30:00', 'Nakit'),
(003, 003, 27600.00, '2026-05-20 09:15:00', 'Kredi Kartı'),
(004, 004, 48300.00, '2026-05-25 10:45:00', 'Kredi Kartı'),
(005, 005, 17300.00, '2026-06-10 08:30:00', 'Nakit'),
(006, 008, 4200.00, '2026-07-16 11:00:00', 'Kredi Kartı'),
(007, 010, 22200.00, '2026-08-07 10:20:00', 'Nakit'),
(008, 013, 39250.00, '2026-09-05 09:40:00', 'Kredi Kartı'),
(009, 015, 50100.00, '2026-09-20 10:10:00', 'Kredi Kartı');

-- 9. İşlem Kayıtları (Loglar)
INSERT INTO Islem_Kayitlari (kayit_id, personel_id, kayit_islem_tipi, kayit_islem_tarihi, kayit_aciklama) VALUES
(001, 007, 'Rezervasyon Onayı', '2026-04-25 10:00:00', 'R001 numaralı Ahmet Yılmaz rezervasyonu onaylandı.'),
(002, 010, 'Giriş İşlemi', '2026-05-10 14:00:00', 'R002 numaralı müşteri Ayşe Demir otele giriş yaptı.'),
(003, 001, 'Sistem Ayarı', '2026-04-20 09:30:00', 'Uğur tarafından oda taban fiyatları güncellendi.'),
(004, 007, 'Rezervasyon İptali', '2026-07-10 11:15:00', 'R007 numaralı rezervasyon müşteri talebiyle iptal edildi.'),
(005, 007, 'Fatura Kesimi', '2026-05-25 10:30:00', 'R004 numaralı rezervasyonun faturası kesildi.'),
(006, 010, 'Rezervasyon Onayı', '2026-07-28 14:20:00', 'R010 numaralı rezervasyon onaylandı.'),
(007, 007, 'Çıkış İşlemi', '2026-05-20 09:10:00', 'R003 numaralı müşteri çıkış yaptı.'),
(008, 001, 'Personel Ekleme', '2026-04-22 16:45:00', 'Sisteme yeni temizlik personeli eklendi.'),
(009, 006, 'Oda Durum Güncellemesi', '2026-06-01 08:00:00', 'O008 numaralı oda arızalı olarak işaretlendi.'),
(010, 003, 'Hizmet Ekleme', '2026-06-09 15:30:00', 'R005 numaralı rezervasyona Geç Çıkış hizmeti eklendi.'),
(011, 007, 'Rezervasyon Onayı', '2026-09-01 10:00:00', 'R013 numaralı rezervasyon onaylandı.'),
(012, 007, 'Giriş İşlemi', '2026-05-20 12:45:00', '005 numaralı müşteri otele giriş yaptı.'),
(013, 010, 'Rezervasyon Onayı', '2026-08-25 09:50:00', 'R013 numaralı rezervasyon onaylandı.'),
(014, 003, 'Veritabanı Yedeği', '2026-09-01 02:00:00', 'Sistem yedeği başarıyla alındı.'),
(015, 005, 'Oda Durum Güncellemesi', '2026-05-02 10:10:00', 'O003 numaralı oda temizlikte olarak işaretlendi.');