<<<<<<< HEAD
const misafirGovdesi = document.getElementById("misafirGovdesi");

function konaklayanlariGetir() {
    let tumKayitlar = JSON.parse(localStorage.getItem("rezervasyonKayitlari"));

    if (!tumKayitlar || tumKayitlar.length === 0) {
        tumKayitlar = [
            { id: "R-1002", musteri: "Ayşe Kaya", odaNo: "201", girisTarihi: "2026-05-12", cikisTarihi: "2026-05-14", durum: "Onaylandı", durumSinifi: "giris-yapti" }
        ];
        localStorage.setItem("rezervasyonKayitlari", JSON.stringify(tumKayitlar));
    }

    const aktifMisafirler = tumKayitlar.filter(kayit => kayit.durum === "Onaylandı");
    misafirleriEkranaBas(aktifMisafirler);
}

function misafirleriEkranaBas(misafirler) {
    misafirGovdesi.innerHTML = "";

    misafirler.forEach(misafir => {
        const satir = document.createElement("tr");

        const musteriHucresi = document.createElement("td");
        musteriHucresi.textContent = misafir.musteri;

        const odaHucresi = document.createElement("td");
        odaHucresi.textContent = misafir.odaNo;

        const girisHucresi = document.createElement("td");
        girisHucresi.textContent = misafir.girisTarihi;

        const cikisHucresi = document.createElement("td");
        cikisHucresi.textContent = misafir.cikisTarihi;

        const islemHucresi = document.createElement("td");
        const cikisButonu = document.createElement("button");
        cikisButonu.className = "islem-butonu";
        cikisButonu.style.backgroundColor = "#e67e22";
        cikisButonu.textContent = "Çıkış İşlemi Yap";

        cikisButonu.addEventListener("click", () => cikisYap(misafir.id, misafir.musteri));

        islemHucresi.appendChild(cikisButonu);

        satir.appendChild(musteriHucresi);
        satir.appendChild(odaHucresi);
        satir.appendChild(girisHucresi);
        satir.appendChild(cikisHucresi);
        satir.appendChild(islemHucresi);

        misafirGovdesi.appendChild(satir);
    });
}

function cikisYap(rezervasyonId, musteriAd) {
    const onay = confirm(musteriAd + " adlı misafirin çıkış işlemini onaylıyor musunuz?");

    if (onay) {
        let tumKayitlar = JSON.parse(localStorage.getItem("rezervasyonKayitlari"));

        let guncelListe = tumKayitlar.map(rez => {
            if (rez.id === rezervasyonId) {
                return { ...rez, durum: "Çıkış Yaptı", durumSinifi: "bekleniyor" };
            }
            return rez;
        });

        localStorage.setItem("rezervasyonKayitlari", JSON.stringify(guncelListe));

        alert(musteriAd + " adlı misafirin çıkış işlemi tamamlandı.");
        konaklayanlariGetir();
    }
}

document.addEventListener("DOMContentLoaded", konaklayanlariGetir);
=======
document.addEventListener("DOMContentLoaded", aktifMisafirleriYukle);

function aktifMisafirleriYukle() {
    // Tablonun gövdesini (satırların ekleneceği yeri) seçiyoruz
    const tabloGovdesi = document.querySelector("table tbody");
    if (!tabloGovdesi) return;

    tabloGovdesi.innerHTML = ""; // Önce tabloyu temizle

    let rezervasyonlar = [];
    try {
        rezervasyonlar = JSON.parse(localStorage.getItem("rezervasyonKayitlari")) || [];
    } catch (e) {
        rezervasyonlar = [];
    }

    // Bugünün tarihini YYYY-MM-DD formatında alalım
    const bugunTarih = new Date();
    // Saat dilimi farklarını (Türkiye saati) düzeltmek için:
    bugunTarih.setMinutes(bugunTarih.getMinutes() - bugunTarih.getTimezoneOffset());
    const bugun = bugunTarih.toISOString().split("T")[0];

    // MİSAFİR FİLTRESİ: Durumu "Onaylandı" olan VE bugün otelde olanlar
    const aktifMisafirler = rezervasyonlar.filter(r => {
        return r.durum === "Onaylandı" && r.girisTarihi <= bugun && r.cikisTarihi >= bugun;
    });

    // Eğer şu an konaklayan kimse yoksa uyarı ver
    if (aktifMisafirler.length === 0) {
        tabloGovdesi.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 2rem; color: #7f8c8d; font-style: italic;">Şu an otelde konaklayan misafir bulunmamaktadır. İleri tarihli rezervasyonları "Rezervasyonlar" sekmesinden görebilirsiniz.</td></tr>`;
        return;
    }

    // Filtreden geçen misafirleri tabloya yazdır
    aktifMisafirler.forEach(misafir => {
        const satir = document.createElement("tr");

        // İsim verisi bazen 'musteri' bazen 'isim'/'soyisim' olarak gelmiş olabilir, iki durumu da kapsıyoruz.
        const misafirAdi = misafir.musteri || (misafir.isim + " " + misafir.soyisim);

        satir.innerHTML = `
            <td style="font-weight: bold; color: #2c3e50;">${misafirAdi}</td>
            <td>${misafir.tcKimlik || "-"}</td>
            <td>
                <span style="background-color: #3498db; color: white; padding: 5px 10px; border-radius: 5px; font-weight: bold;">
                    ${misafir.odaNo}
                </span>
            </td>
            <td>${misafir.girisTarihi}</td>
            <td>${misafir.cikisTarihi}</td>
            <td>${misafir.eposta || "-"}</td>
            <td>
                <button onclick="window.location.href='admin-islemler.html'" style="background-color: #27ae60; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; transition: 0.3s;">
                    Hesap/Fatura
                </button>
            </td>
        `;
        tabloGovdesi.appendChild(satir);
    });
}
>>>>>>> 6eb49ac (Admin islemler, misafir listesi ve oda tipleri guncellendi)
