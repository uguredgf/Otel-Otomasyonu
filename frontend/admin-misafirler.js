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