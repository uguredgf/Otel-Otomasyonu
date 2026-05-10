<<<<<<< HEAD
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
=======
document.addEventListener("DOMContentLoaded", () => {
    rezervasyonlariGetir();
});

function rezervasyonlariGetir() {
    let tumKayitlar = JSON.parse(localStorage.getItem("rezervasyonKayitlari")) || [];
    rezervasyonlariEkranaBas(tumKayitlar);
}

function rezervasyonlariEkranaBas(kayitlar) {
    // Tablonun gövdesini seçiyoruz
    const tabloGovdesi = document.querySelector("tbody");
    if (!tabloGovdesi) return;

    tabloGovdesi.innerHTML = "";

    kayitlar.forEach(kayit => {
        const satir = document.createElement("tr");

        const idHucresi = document.createElement("td");
        idHucresi.textContent = kayit.id;

        const musteriHucresi = document.createElement("td");
        musteriHucresi.textContent = kayit.musteri;

        const odaHucresi = document.createElement("td");
        odaHucresi.textContent = kayit.odaNo;

        const girisHucresi = document.createElement("td");
        girisHucresi.textContent = kayit.girisTarihi;

        const cikisHucresi = document.createElement("td");
        cikisHucresi.textContent = kayit.cikisTarihi;

        const durumHucresi = document.createElement("td");
        const durumEtiketi = document.createElement("span");
        // Önceden kaydedilmiş CSS sınıfını kullanıyoruz
        durumEtiketi.className = "durum-etiketi " + (kayit.durumSinifi || "bekleniyor");
        durumEtiketi.textContent = kayit.durum;
>>>>>>> 6eb49ac (Admin islemler, misafir listesi ve oda tipleri guncellendi)
        durumHucresi.appendChild(durumEtiketi);

        const islemHucresi = document.createElement("td");

<<<<<<< HEAD
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
=======
        // --- İŞTE SİHRİN OLDUĞU YER (BUTON GİZLEME KONTROLÜ) ---
        if (kayit.durum === "Beklemede") {
            // Beklemedeki rezervasyon için hem Onayla hem İptal Et butonu gösterilir
            const onaylaButonu = document.createElement("button");
            onaylaButonu.className = "islem-butonu";
            onaylaButonu.style.backgroundColor = "#27ae60";
            onaylaButonu.style.marginRight = "5px";
            onaylaButonu.textContent = "Onayla";
            onaylaButonu.addEventListener("click", () => durumuGuncelle(kayit.id, "Onaylandı", "onaylandi"));

            const iptalButonu = document.createElement("button");
            iptalButonu.className = "islem-butonu";
            iptalButonu.style.backgroundColor = "#e74c3c";
            iptalButonu.textContent = "İptal Et";
            iptalButonu.addEventListener("click", () => durumuGuncelle(kayit.id, "İptal Edildi", "iptal"));

            islemHucresi.appendChild(onaylaButonu);
            islemHucresi.appendChild(iptalButonu);

        } else if (kayit.durum === "Onaylandı") {
            // Zaten onaylanmış birisi için sadece "İptal Et" butonu bırakılır (gelmekten vazgeçerse diye)
            const iptalButonu = document.createElement("button");
            iptalButonu.className = "islem-butonu";
            iptalButonu.style.backgroundColor = "#e74c3c";
            iptalButonu.textContent = "İptal Et";
            iptalButonu.addEventListener("click", () => durumuGuncelle(kayit.id, "İptal Edildi", "iptal"));

            islemHucresi.appendChild(iptalButonu);

        } else {
            // Çıkış Yaptı veya İptal Edildi ise hiçbir buton gösterme, sadece tire (-) koy
            islemHucresi.textContent = "-";
            islemHucresi.style.color = "#7f8c8d";
            islemHucresi.style.fontWeight = "bold";
        }
>>>>>>> 6eb49ac (Admin islemler, misafir listesi ve oda tipleri guncellendi)

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

<<<<<<< HEAD
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
=======
function durumuGuncelle(id, yeniDurum, yeniSinif) {
    // İşlem yapmadan önce emin misin diye soralım
    const onay = confirm(`Bu rezervasyonun durumunu '${yeniDurum}' olarak değiştirmek istediğinize emin misiniz?`);

    if (onay) {
        let tumKayitlar = JSON.parse(localStorage.getItem("rezervasyonKayitlari")) || [];

        let guncelListe = tumKayitlar.map(kayit => {
            if (kayit.id === id) {
                return { ...kayit, durum: yeniDurum, durumSinifi: yeniSinif };
            }
            return kayit;
        });

        localStorage.setItem("rezervasyonKayitlari", JSON.stringify(guncelListe));
        rezervasyonlariGetir(); // Sayfayı yenilemeden tabloyu anında güncelle
    }
}
>>>>>>> 6eb49ac (Admin islemler, misafir listesi ve oda tipleri guncellendi)
