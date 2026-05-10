<<<<<<< HEAD
const misafirSecimi = document.getElementById("misafirSecimi");
const hizmetSecimi = document.getElementById("hizmetSecimi");
const hizmetAdeti = document.getElementById("hizmetAdeti");
const hizmetEkleButonu = document.getElementById("hizmetEkleButonu");
const faturaGovdesi = document.getElementById("faturaGovdesi");
const genelToplamMetni = document.getElementById("genelToplam");

const hizmetFiyatListesi = {
    "Sauna": 800,
    "Havuz": 500,
    "Masaj": 1500,
    "Oda Servisi": 400,
    "Mini Bar": 300
};

function sayfaYukle() {
    let tumKayitlar = JSON.parse(localStorage.getItem("rezervasyonKayitlari")) || [];
    const aktifMisafirler = tumKayitlar.filter(kayit => kayit.durum === "Onaylandı");

    misafirSecimi.innerHTML = '<option value="">Misafir Seçiniz...</option>';
    aktifMisafirler.forEach(misafir => {
        const secenek = document.createElement("option");
        secenek.value = misafir.id;
        secenek.textContent = misafir.odaNo + " Numaralı Oda - " + misafir.musteri;
        misafirSecimi.appendChild(secenek);
    });

    misafirSecimi.addEventListener("change", faturaGuncelle);
    hizmetEkleButonu.addEventListener("click", hizmetEkle);

    // EKLENEN YENİ KISIM: URL'den ID yakalama
    const urlParametreleri = new URLSearchParams(window.location.search);
    const gelenMisafirId = urlParametreleri.get('misafirId');

    if (gelenMisafirId) {
        // Eğer linkte bir ID varsa, listeden otomatik olarak o kişiyi seç
        misafirSecimi.value = gelenMisafirId;
        // Seçim yapıldığı için faturasını hemen sağ tarafa yansıt
        faturaGuncelle();
    }
}

function faturaGuncelle() {
    const seciliId = misafirSecimi.value;
    if (!seciliId) {
        faturaGovdesi.innerHTML = "";
        genelToplamMetni.textContent = "0 TL";
        return;
    }

    let tumKayitlar = JSON.parse(localStorage.getItem("rezervasyonKayitlari")) || [];
    const misafir = tumKayitlar.find(kayit => kayit.id === seciliId);

    let toplamTutar = 3000;
    faturaGovdesi.innerHTML = "";

    const odaSatiri = document.createElement("tr");
    odaSatiri.innerHTML = "<td>Konaklama Bedeli (Sabit)</td><td>1</td><td>3000 TL</td><td>3000 TL</td>";
    faturaGovdesi.appendChild(odaSatiri);

    if (misafir.alinanHizmetler && misafir.alinanHizmetler.length > 0) {
        misafir.alinanHizmetler.forEach(hizmet => {
            const islemTutari = hizmet.adet * hizmet.fiyat;
            toplamTutar += islemTutari;

            const satir = document.createElement("tr");
            satir.innerHTML = "<td>" + hizmet.isim + "</td><td>" + hizmet.adet + "</td><td>" + hizmet.fiyat + " TL</td><td>" + islemTutari + " TL</td>";
            faturaGovdesi.appendChild(satir);
        });
    }

    genelToplamMetni.textContent = toplamTutar + " TL";
}

function hizmetEkle() {
    const seciliId = misafirSecimi.value;
    const seciliHizmet = hizmetSecimi.value;
    const adet = parseInt(hizmetAdeti.value);

    if (!seciliId || !seciliHizmet || isNaN(adet) || adet < 1) {
        alert("Lütfen misafir, hizmet ve geçerli bir adet seçiniz.");
        return;
    }

    let tumKayitlar = JSON.parse(localStorage.getItem("rezervasyonKayitlari")) || [];
    const misafirIndeksi = tumKayitlar.findIndex(kayit => kayit.id === seciliId);

    if (!tumKayitlar[misafirIndeksi].alinanHizmetler) {
        tumKayitlar[misafirIndeksi].alinanHizmetler = [];
    }

    const yeniHizmet = {
        isim: seciliHizmet,
        fiyat: hizmetFiyatListesi[seciliHizmet],
        adet: adet
    };

    tumKayitlar[misafirIndeksi].alinanHizmetler.push(yeniHizmet);
    localStorage.setItem("rezervasyonKayitlari", JSON.stringify(tumKayitlar));

    alert(seciliHizmet + " başarıyla eklendi.");
    faturaGuncelle();
}

document.addEventListener("DOMContentLoaded", sayfaYukle);
=======
// 1. HİLAL'İN VERİTABANINDAKİ EKSTRA HİZMETLER LİSTESİ
const hizmetlerListesi = [
    { id: 1, ad: "Açık Büfe Kahvaltı", fiyat: 300 },
    { id: 2, ad: "SPA & Masaj", fiyat: 1200 },
    { id: 3, ad: "Minibar Kullanımı", fiyat: 250 },
    { id: 4, ad: "Havaalanı VIP Transfer", fiyat: 800 },
    { id: 5, ad: "Oda Servisi (Akşam Yemeği)", fiyat: 600 },
    { id: 6, ad: "Kuru Temizleme", fiyat: 150 },
    { id: 7, ad: "Ütü Hizmeti", fiyat: 100 },
    { id: 8, ad: "Kapalı Havuz Girişi", fiyat: 200 },
    { id: 9, ad: "Otopark ve Vale", fiyat: 100 },
    { id: 10, ad: "Geç Çıkış (Late Check-out)", fiyat: 500 }
];

document.addEventListener("DOMContentLoaded", () => {
    hizmetleriYukle();
    aktifMisafirleriYukle();

    // Dinleyicileri (Event Listeners) Bağlama
    const aktifMisafirSecimi = document.getElementById("aktifMisafirSecimi");
    if (aktifMisafirSecimi) aktifMisafirSecimi.addEventListener("change", faturaGoster);

    const hizmetEkleBtn = document.getElementById("hizmetEkleBtn");
    if (hizmetEkleBtn) hizmetEkleBtn.addEventListener("click", hizmetEkle);

    const faturayiKapatBtn = document.getElementById("faturayiKapatBtn");
    if (faturayiKapatBtn) faturayiKapatBtn.addEventListener("click", cikisYapVeFaturaKes);
});

// --- MENÜLERİ DOLDURMA İŞLEMLERİ ---

function hizmetleriYukle() {
    const select = document.getElementById("hizmetSecimi");
    if (!select) return;

    hizmetlerListesi.forEach(h => {
        const opt = document.createElement("option");
        opt.value = h.id;
        opt.textContent = `${h.ad} - ${h.fiyat} TL`;
        select.appendChild(opt);
    });
}

function aktifMisafirleriYukle() {
    const select = document.getElementById("aktifMisafirSecimi");
    if (!select) return;

    let rezervasyonlar = [];
    try {
        rezervasyonlar = JSON.parse(localStorage.getItem("rezervasyonKayitlari")) || [];
    } catch (e) {
        rezervasyonlar = [];
    }

    const bugun = new Date().toISOString().split("T")[0];

    // Sadece "Onaylandı" durumunda olan ve şu an tarihsel olarak otelde bulunan misafirler
    const suanOtelde = rezervasyonlar.filter(r => r.durum === "Onaylandı" && bugun >= r.girisTarihi && bugun <= r.cikisTarihi);

    select.innerHTML = '<option value="">-- Misafir Seçin --</option>';
    suanOtelde.forEach(r => {
        const opt = document.createElement("option");
        opt.value = r.id;
        opt.textContent = `${r.musteri} (Oda: ${r.odaNo})`;
        select.appendChild(opt);
    });
}

// --- HİZMET EKLEME VE FATURA GÖSTERİMİ ---

function hizmetEkle() {
    const rezId = document.getElementById("aktifMisafirSecimi").value;
    const hizmetId = document.getElementById("hizmetSecimi").value;

    if (!rezId || !hizmetId) {
        alert("Lütfen bir misafir ve eklenecek hizmeti seçin!");
        return;
    }

    const hizmet = hizmetlerListesi.find(h => h.id == hizmetId);
    let rezervasyonlar = JSON.parse(localStorage.getItem("rezervasyonKayitlari")) || [];

    const index = rezervasyonlar.findIndex(r => r.id === rezId);
    if (index !== -1) {
        // Eğer misafirin daha önce eklentisi yoksa listeyi (array) oluştur
        if (!rezervasyonlar[index].ekstralar) rezervasyonlar[index].ekstralar = [];

        rezervasyonlar[index].ekstralar.push({
            tarih: new Date().toLocaleDateString(),
            ad: hizmet.ad,
            fiyat: hizmet.fiyat
        });

        localStorage.setItem("rezervasyonKayitlari", JSON.stringify(rezervasyonlar));
        alert(hizmet.ad + " faturaya başarıyla eklendi.");
        faturaGoster(); // Tabloyu anında güncelle
    }
}

function faturaGoster() {
    const rezId = document.getElementById("aktifMisafirSecimi").value;
    const faturaBolumu = document.getElementById("faturaBolumu");
    const faturaGovdesi = document.getElementById("faturaGovdesi");
    const faturaBaslik = document.getElementById("faturaBaslik");

    // Eğer misafir seçimi temizlendiyse faturayı gizle
    if (!rezId) {
        if (faturaBolumu) faturaBolumu.style.display = "none";
        return;
    }

    let rezervasyonlar = JSON.parse(localStorage.getItem("rezervasyonKayitlari")) || [];
    const rez = rezervasyonlar.find(r => r.id === rezId);

    if (!rez) return;

    if (faturaBolumu) faturaBolumu.style.display = "block";
    if (faturaBaslik) faturaBaslik.textContent = `${rez.musteri} - Oda ${rez.odaNo} Fatura Detayı`;
    if (faturaGovdesi) faturaGovdesi.innerHTML = "";

    let toplam = 0;

    // 1. ODA ÜCRETİ HESAPLAMA (Gece Sayısı * Oda Gecelik Fiyatı)
    const giris = new Date(rez.girisTarihi);
    const cikis = new Date(rez.cikisTarihi);
    // Gün farkını hesapla (Eğer aynı gün çıkış yapıyorsa en az 1 gece say)
    const geceSayisi = Math.max(1, Math.ceil((cikis - giris) / (1000 * 60 * 60 * 24)));

    let odalar = JSON.parse(localStorage.getItem("otelOdaAyarlari")) || [];
    const oda = odalar.find(o => o.odaNumarasi === rez.odaNo);
    // Eğer oda bulunamazsa güvenlik için 1000 TL varsay
    const gecelikFiyat = oda ? oda.fiyat : 1000;
    const odaToplamFiyat = gecelikFiyat * geceSayisi;

    if (faturaGovdesi) {
        faturaGovdesi.innerHTML += `
            <tr style="background-color: #f8f9fa; font-weight: bold;">
                <td>${rez.girisTarihi} / ${rez.cikisTarihi}</td>
                <td>Konaklama (${geceSayisi} Gece x ${gecelikFiyat} TL)</td>
                <td>${odaToplamFiyat} TL</td>
            </tr>`;
    }
    toplam += odaToplamFiyat;

    // 2. EKSTRA HİZMETLERİ EKLENME
    if (rez.ekstralar && rez.ekstralar.length > 0) {
        rez.ekstralar.forEach(e => {
            if (faturaGovdesi) {
                faturaGovdesi.innerHTML += `
                    <tr>
                        <td>${e.tarih}</td>
                        <td>${e.ad}</td>
                        <td>${e.fiyat} TL</td>
                    </tr>`;
            }
            toplam += e.fiyat;
        });
    }

    const genelToplamAlan = document.getElementById("genelToplam");
    if (genelToplamAlan) genelToplamAlan.textContent = `Genel Toplam: ${toplam} TL`;
}

// --- ZİRVE NOKTASI: ÇIKIŞ YAPMA VE ODAYI TEMİZLİĞE ALMA ---

function cikisYapVeFaturaKes() {
    const rezId = document.getElementById("aktifMisafirSecimi").value;

    if (!rezId) {
        alert("Lütfen çıkış yapacak misafiri seçin.");
        return;
    }

    const onay = confirm("Ödeme alındı ve misafir otelden çıkış yapıyor. Onaylıyor musunuz? (Misafirin odası 'Temizlikte' moduna geçecektir.)");

    if (onay) {
        let rezervasyonlar = JSON.parse(localStorage.getItem("rezervasyonKayitlari")) || [];
        let odalar = JSON.parse(localStorage.getItem("otelOdaAyarlari")) || [];

        // 1. Misafirin durumunu "Çıkış Yaptı" olarak işaretle
        let guncelRezervasyonlar = rezervasyonlar.map(rez => {
            if (rez.id === rezId) {
                return { ...rez, durum: "Çıkış Yaptı", durumSinifi: "bekleniyor" }; // bekleniyor sınıfı gri renk verir
            }
            return rez;
        });
        localStorage.setItem("rezervasyonKayitlari", JSON.stringify(guncelRezervasyonlar));

        // 2. Çıkış yapan misafirin odasını bul ve "Temizlikte" moduna al
        const cikisYapanRez = rezervasyonlar.find(r => r.id === rezId);

        if (cikisYapanRez) {
            let guncelOdalar = odalar.map(oda => {
                if (oda.odaNumarasi === cikisYapanRez.odaNo) {
                    return { ...oda, durum: "Temizlikte", durumSinifi: "oda-temizlik" };
                }
                return oda;
            });
            localStorage.setItem("otelOdaAyarlari", JSON.stringify(guncelOdalar));
        }

        alert("İşlem Başarılı! Hesap kapatıldı, misafir çıkışı yapıldı ve oda temizlik listesine eklendi.");

        // 3. Ekranı sıfırla
        document.getElementById("aktifMisafirSecimi").value = "";
        document.getElementById("faturaBolumu").style.display = "none";

        // Misafir listesini yenile (çıkan kişi listeden düşsün)
        aktifMisafirleriYukle();
    }
}
>>>>>>> 6eb49ac (Admin islemler, misafir listesi ve oda tipleri guncellendi)
