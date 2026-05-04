const odaListesiAlani = document.getElementById("odaListesi");
const aramaFormu = document.getElementById("aramaFormu");

let tumOdalarSistemi = [];

function odalariGetir() {
    let yoneticiOdalari = JSON.parse(localStorage.getItem("otelOdaAyarlari"));

    if (yoneticiOdalari && yoneticiOdalari.length > 0) {
        tumOdalarSistemi = yoneticiOdalari;
        odalariEkranaBas(tumOdalarSistemi);
    } else {
        tumOdalarSistemi = [
            { odaNumarasi: "101", tip: "Standart Oda", fiyat: 1500, kapasite: 2, durum: "Müsait" },
            { odaNumarasi: "102", tip: "Lüks Süit", fiyat: 3000, kapasite: 3, durum: "Müsait" },
            { odaNumarasi: "103", tip: "Standart Oda", fiyat: 1500, kapasite: 2, durum: "Müsait" },
            { odaNumarasi: "201", tip: "Aile Odası", fiyat: 2500, kapasite: 4, durum: "Müsait" },
            { odaNumarasi: "202", tip: "Lüks Süit", fiyat: 3000, kapasite: 3, durum: "Müsait" },
            { odaNumarasi: "301", tip: "Kral Dairesi", fiyat: 5000, kapasite: 5, durum: "Müsait" }
        ];
        localStorage.setItem("otelOdaAyarlari", JSON.stringify(tumOdalarSistemi));
        odalariEkranaBas(tumOdalarSistemi);
    }
}

function odalariEkranaBas(odalar) {
    odaListesiAlani.innerHTML = "";

    if (odalar.length === 0) {
        odaListesiAlani.innerHTML = "<p style='grid-column: 1/-1; text-align:center; font-size:1.2rem;'>Seçtiğiniz tarihlerde müsait odamız bulunmamaktadır. Lütfen farklı tarihler deneyiniz.</p>";
        return;
    }

    odalar.forEach(oda => {
        const kart = document.createElement("div");
        kart.className = "oda-karti";

        const baslik = document.createElement("h3");
        baslik.textContent = oda.tip + " (No: " + oda.odaNumarasi + ")";

        const kapasiteBilgisi = document.createElement("p");
        kapasiteBilgisi.innerHTML = "<strong>Kapasite:</strong> " + oda.kapasite + " Kişilik";
        kapasiteBilgisi.style.color = "#2c3e50";

        const fiyatBilgisi = document.createElement("p");
        fiyatBilgisi.textContent = "Fiyat: " + oda.fiyat + " TL / Gece";

        const rezervasyonButonu = document.createElement("button");
        rezervasyonButonu.textContent = "Hemen Rezervasyon Yap";

        rezervasyonButonu.addEventListener("click", () => {
            window.location.href = `rezervasyon.html?odaNo=${oda.odaNumarasi}&kapasite=${oda.kapasite}`;
        });

        kart.appendChild(baslik);
        kart.appendChild(kapasiteBilgisi);
        kart.appendChild(fiyatBilgisi);
        kart.appendChild(rezervasyonButonu);

        odaListesiAlani.appendChild(kart);
    });
}

aramaFormu.addEventListener("submit", (olay) => {
    olay.preventDefault();

    const giris = document.getElementById("girisTarihi").value;
    const cikis = document.getElementById("cikisTarihi").value;

    if (new Date(giris) >= new Date(cikis)) {
        alert("Hata: Çıkış tarihi giriş tarihinden önce veya aynı gün olamaz.");
        return;
    }

    let kayitliRezervasyonlar = JSON.parse(localStorage.getItem("rezervasyonKayitlari")) || [];

    const musaitOdalar = tumOdalarSistemi.filter(oda => {
        const cakismaVar = kayitliRezervasyonlar.some(rezervasyon => {
            if (rezervasyon.odaNo === oda.odaNumarasi && rezervasyon.durum !== "İptal Edildi" && rezervasyon.durum !== "Çıkış Yaptı") {
                const eskiGiris = new Date(rezervasyon.girisTarihi);
                const eskiCikis = new Date(rezervasyon.cikisTarihi);
                const yeniGiris = new Date(giris);
                const yeniCikis = new Date(cikis);

                return (yeniGiris < eskiCikis) && (yeniCikis > eskiGiris);
            }
            return false;
        });

        return !cakismaVar;
    });

    odalariEkranaBas(musaitOdalar);
    document.getElementById("odalarimiz").scrollIntoView({ behavior: "smooth" });
});

document.addEventListener("DOMContentLoaded", odalariGetir);