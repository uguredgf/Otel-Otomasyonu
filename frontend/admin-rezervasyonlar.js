const tabloGovdesi = document.getElementById("rezervasyonGovdesi");

function rezervasyonlariGetir() {
    let kayitliRezervasyonlar = JSON.parse(localStorage.getItem("rezervasyonKayitlari"));

    if (!kayitliRezervasyonlar || kayitliRezervasyonlar.length === 0) {
        kayitliRezervasyonlar = [
            { id: "R-1001", musteri: "Ahmet Yılmaz", odaNo: "101", girisTarihi: "2026-05-10", cikisTarihi: "2026-05-15", durum: "Beklemede", durumSinifi: "bekleniyor" },
            { id: "R-1002", musteri: "Ayşe Kaya", odaNo: "201", girisTarihi: "2026-05-12", cikisTarihi: "2026-05-14", durum: "Onaylandı", durumSinifi: "giris-yapti" },
            { id: "R-1003", musteri: "Mehmet Demir", odaNo: "102", girisTarihi: "2026-05-20", cikisTarihi: "2026-05-25", durum: "Beklemede", durumSinifi: "bekleniyor" }
        ];
        localStorage.setItem("rezervasyonKayitlari", JSON.stringify(kayitliRezervasyonlar));
    }

    tabloyDoldur(kayitliRezervasyonlar);
}

function tabloyDoldur(rezervasyonlar) {
    tabloGovdesi.innerHTML = "";

    rezervasyonlar.forEach(rezervasyon => {
        const satir = document.createElement("tr");

        const idHucresi = document.createElement("td");
        idHucresi.textContent = rezervasyon.id;

        const musteriHucresi = document.createElement("td");
        musteriHucresi.textContent = rezervasyon.musteri;

        const odaHucresi = document.createElement("td");
        odaHucresi.textContent = rezervasyon.odaNo;

        const girisHucresi = document.createElement("td");
        girisHucresi.textContent = rezervasyon.girisTarihi || "Belirtilmedi";

        const cikisHucresi = document.createElement("td");
        cikisHucresi.textContent = rezervasyon.cikisTarihi || "Belirtilmedi";

        const durumHucresi = document.createElement("td");
        const durumEtiketi = document.createElement("span");
        durumEtiketi.className = "durum-etiketi " + rezervasyon.durumSinifi;
        durumEtiketi.textContent = rezervasyon.durum;
        durumHucresi.appendChild(durumEtiketi);

        const islemHucresi = document.createElement("td");

        const onaylaButonu = document.createElement("button");
        onaylaButonu.className = "islem-butonu";
        onaylaButonu.style.backgroundColor = "#27ae60";
        onaylaButonu.style.marginRight = "5px";
        onaylaButonu.textContent = "Onayla";
        onaylaButonu.addEventListener("click", () => islemYap(rezervasyon.id, "Onaylandı", "giris-yapti"));

        const iptalButonu = document.createElement("button");
        iptalButonu.className = "islem-butonu";
        iptalButonu.style.backgroundColor = "#e74c3c";
        iptalButonu.textContent = "İptal Et";
        iptalButonu.addEventListener("click", () => islemYap(rezervasyon.id, "İptal Edildi", "bekleniyor"));

        islemHucresi.appendChild(onaylaButonu);
        islemHucresi.appendChild(iptalButonu);

        satir.appendChild(idHucresi);
        satir.appendChild(musteriHucresi);
        satir.appendChild(odaHucresi);
        satir.appendChild(girisHucresi);
        satir.appendChild(cikisHucresi);
        satir.appendChild(durumHucresi);
        satir.appendChild(islemHucresi);

        tabloGovdesi.appendChild(satir);
    });
}

function islemYap(rezervasyonId, yeniDurum, yeniSinif) {
    const onay = confirm(rezervasyonId + " numaralı rezervasyonu '" + yeniDurum + "' olarak güncellemek istediğinize emin misiniz?");

    if (onay) {
        let kayitliRezervasyonlar = JSON.parse(localStorage.getItem("rezervasyonKayitlari"));

        let guncelListe = kayitliRezervasyonlar.map(rez => {
            if (rez.id === rezervasyonId) {
                return { ...rez, durum: yeniDurum, durumSinifi: yeniSinif };
            }
            return rez;
        });

        localStorage.setItem("rezervasyonKayitlari", JSON.stringify(guncelListe));

        alert(rezervasyonId + " numaralı rezervasyon başarıyla " + yeniDurum + ".");
        rezervasyonlariGetir();
    }
}

document.addEventListener("DOMContentLoaded", rezervasyonlariGetir);