const tabloGovdesi = document.getElementById("tabloGovdesi");
const toplamRezervasyonMetni = document.getElementById("toplamRezervasyon");
const bugunGirislerMetni = document.getElementById("bugunGirisler");
const gunlukGelirMetni = document.getElementById("gunlukGelir");
const beklenenOdemeMetni = document.getElementById("beklenenOdeme");

function panoyuGuncelle() {
    let tumKayitlar = JSON.parse(localStorage.getItem("rezervasyonKayitlari")) || [];
    let odaAyarlari = JSON.parse(localStorage.getItem("otelOdaAyarlari")) || [];

    // Bugünün tarihini alıyoruz (Örn: 2026-05-15)
    const bugunTarihi = new Date().toISOString().split("T")[0];

    let toplamRez = tumKayitlar.length;
    let bugunGirisSayisi = 0;
    let kasadakiCiro = 0;
    let beklenenCiro = 0;

    tumKayitlar.forEach(misafir => {
        // 1. Bugün giriş yapacakları say
        if (misafir.girisTarihi === bugunTarihi && misafir.durum !== "İptal Edildi") {
            bugunGirisSayisi++;
        }

        // 2. Fatura Hesaplama Algoritması
        let misafirFaturasi = 0;

        // Gün sayısını hesapla
        const girisT = new Date(misafir.girisTarihi);
        const cikisT = new Date(misafir.cikisTarihi);
        const farkZaman = Math.abs(cikisT - girisT);
        const gunSayisi = Math.ceil(farkZaman / (1000 * 60 * 60 * 24)) || 1;

        // Odanın fiyatını ayarlardan bul
        const odaBilgisi = odaAyarlari.find(o => o.odaNumarasi === misafir.odaNo);
        const gunlukFiyat = odaBilgisi ? odaBilgisi.fiyat : 3000; // Bulamazsa varsayılan 3000 TL

        // Konaklama bedelini ekle (Gün x Fiyat)
        misafirFaturasi += (gunlukFiyat * gunSayisi);

        // Ekstra hizmetleri ekle (Sauna, Havuz vb.)
        if (misafir.alinanHizmetler && misafir.alinanHizmetler.length > 0) {
            misafir.alinanHizmetler.forEach(hizmet => {
                misafirFaturasi += (hizmet.fiyat * hizmet.adet);
            });
        }

        // 3. Ciroya Dağıt
        if (misafir.durum === "Onaylandı" || misafir.durum === "Çıkış Yaptı") {
            kasadakiCiro += misafirFaturasi; // Kesinleşmiş para
        } else if (misafir.durum === "Beklemede") {
            beklenenCiro += misafirFaturasi; // Gelecek para
        }
    });

    // Hesaplanan değerleri ekrana bas (Sayıları 1.500 şeklinde formatlayarak yazar)
    if (toplamRezervasyonMetni) toplamRezervasyonMetni.textContent = toplamRez;
    if (bugunGirislerMetni) bugunGirislerMetni.textContent = bugunGirisSayisi;
    if (gunlukGelirMetni) gunlukGelirMetni.textContent = kasadakiCiro.toLocaleString('tr-TR') + " TL";
    if (beklenenOdemeMetni) beklenenOdemeMetni.textContent = beklenenCiro.toLocaleString('tr-TR') + " TL";

    // Tabloyu Güncelle (Sadece Aktif İşlemler)
    tabloGovdesi.innerHTML = "";
    const aktifKayitlar = tumKayitlar.filter(k => k.durum !== "İptal Edildi" && k.durum !== "Çıkış Yaptı");

    aktifKayitlar.forEach(misafir => {
        const satir = document.createElement("tr");

        const isimHucresi = document.createElement("td");
        isimHucresi.textContent = misafir.musteri;

        const odaHucresi = document.createElement("td");
        odaHucresi.textContent = misafir.odaNo;

        const durumHucresi = document.createElement("td");
        const durumEtiketi = document.createElement("span");
        durumEtiketi.className = "durum-etiketi " + misafir.durumSinifi;
        durumEtiketi.textContent = misafir.durum;
        durumHucresi.appendChild(durumEtiketi);

        const islemHucresi = document.createElement("td");
        const islemButonu = document.createElement("button");
        islemButonu.className = "islem-butonu";
        islemButonu.textContent = "Faturaya Git";

        islemButonu.addEventListener("click", () => {
            if (misafir.durum === "Onaylandı") {
                window.location.href = "admin-islemler.html?misafirId=" + misafir.id;
            } else {
                alert("Hizmet ekleyebilmek için önce Rezervasyonlar sekmesinden bu misafirin girişini onaylamalısınız!");
                window.location.href = "admin-rezervasyonlar.html";
            }
        });

        islemHucresi.appendChild(islemButonu);

        satir.appendChild(isimHucresi);
        satir.appendChild(odaHucresi);
        satir.appendChild(durumHucresi);
        satir.appendChild(islemHucresi);

        tabloGovdesi.appendChild(satir);
    });
}

document.addEventListener("DOMContentLoaded", panoyuGuncelle);