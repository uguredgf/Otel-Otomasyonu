function escapePublicHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

document.addEventListener("DOMContentLoaded", () => {
    const publicReservationForm = document.getElementById("publicReservationForm");
    const availabilityBtn = document.getElementById("availabilityBtn");
    const roomTypeSelect = document.getElementById("guestRoomType");
    const odaGorselAlani = document.getElementById("odaGorselAlani");
    const secilenOdaResmi = document.getElementById("secilenOdaResmi");

    const odaResimleri = {
        "Tüm Odalar": "img/logo.png",
        "Ekonomik Oda": "img/ekonomikoda.jpg",
        "Standart Tek Kişilik": "img/tekkisilikoda.jpg",
        "Standart Çift Kişilik": "img/çiftkisilikoda.jpeg",
        "Aile Süiti": "img/ailesuiti.jpeg",
        "Balayı Süiti": "img/balayısuiti.jpg",
        "Kral Dairesi": "img/kraldairesi.jpg"
    };

    if (roomTypeSelect && odaGorselAlani && secilenOdaResmi) {
        roomTypeSelect.addEventListener("change", function() {
            const secilenUzunAd = this.value;
            let resimAnahtari = "Tüm Odalar";

            if (secilenUzunAd.includes("Ekonomik Oda")) resimAnahtari = "Ekonomik Oda";
            else if (secilenUzunAd.includes("Standart Tek Kişilik")) resimAnahtari = "Standart Tek Kişilik";
            else if (secilenUzunAd.includes("Standart Çift Kişilik")) resimAnahtari = "Standart Çift Kişilik";
            else if (secilenUzunAd.includes("Aile Süiti")) resimAnahtari = "Aile Süiti";
            else if (secilenUzunAd.includes("Balayı Süiti")) resimAnahtari = "Balayı Süiti";
            else if (secilenUzunAd.includes("Kral Dairesi")) resimAnahtari = "Kral Dairesi";

            if (odaResimleri[resimAnahtari]) {
                secilenOdaResmi.src = odaResimleri[resimAnahtari];
                odaGorselAlani.style.display = "block";
            }
        });
        roomTypeSelect.dispatchEvent(new Event('change'));
    }

    if (availabilityBtn) {
        availabilityBtn.addEventListener("click", async () => {
            const checkIn = document.getElementById("guestCheckIn").value;
            const checkOut = document.getElementById("guestCheckOut").value;
            const roomType = document.getElementById("guestRoomType").value;

            if (!checkIn || !checkOut || !roomType) {
                alert("Lütfen müsaitlik sorgusu için tarih ve oda seçimi yapın.");
                return;
            }

            let endpoint = `/odalar/musait?giris_tarihi=${encodeURIComponent(checkIn)}&cikis_tarihi=${encodeURIComponent(checkOut)}`;
            if (roomType !== "Tüm Odalar") {
                endpoint += `&oda_tipi=${encodeURIComponent(roomType)}`;
            }

            const result = await apiIstekAt(endpoint);
            if (!result) return;

            const target = document.getElementById("availabilityResult");
            const odalarListesi = result.odalar || result.musait_odalar;

            if (roomType === "Tüm Odalar" && Array.isArray(odalarListesi)) {
                if (odalarListesi.length > 0) {
                    let listeHTML = `<strong>${result.musait_oda_sayisi || odalarListesi.length} Müsait Oda Bulundu</strong><ul style="margin-top: 12px; padding-left: 20px; font-size: 0.95rem; color: #223142;">`;
                    odalarListesi.forEach(oda => {
                        listeHTML += `<li style="margin-bottom: 8px;">Oda ${escapePublicHtml(oda.oda_no || oda.odaNo)} - <strong>${escapePublicHtml(oda.tip || oda.oda_tipi || oda.odaTur_adi)}</strong></li>`;
                    });
                    listeHTML += `</ul><span class="badge bg-primary text-white mt-2" style="white-space: normal; line-height: 1.4;">Rezervasyon işlemini tamamlamak için lütfen yukarıdaki menüden kalmak istediğiniz manzaralı oda tipini seçiniz.</span>`;
                    target.innerHTML = `<div class="mini-card">${listeHTML}</div>`;
                } else {
                    target.innerHTML = `<div class="mini-card"><strong>Oda Bulunamadı</strong><span>Seçtiğiniz tarihlerde otelimizde maalesef boş oda bulunmuyor.</span></div>`;
                }
            } else {
                const mesajBaslik = `${result.musait_oda_sayisi || 0} oda bulundu`;
                const mesajDetay = roomType === "Tüm Odalar"
                    ? `Seçilen tarihlerde otelimizde toplam ${result.musait_oda_sayisi || 0} müsait oda var.`
                    : `${roomType} için seçilen tarihlerde müsait görünen oda sayısı: ${result.musait_oda_sayisi || 0}`;

                target.innerHTML = `<div class="mini-card"><strong>${escapePublicHtml(mesajBaslik)}</strong><span>${escapePublicHtml(mesajDetay)}</span></div>`;
            }
        });
    }

    if (publicReservationForm) {
        publicReservationForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const secilenOda = document.getElementById("guestRoomType").value;
            if (secilenOda === "Tüm Odalar") {
                alert("Lütfen rezervasyon yapmak için menüden spesifik bir oda ve manzara tipi seçiniz.");
                return;
            }

            const payload = {
                tc_kimlik: document.getElementById("guestTc").value,
                ad: document.getElementById("guestName").value,
                soyad: document.getElementById("guestSurname").value,
                telefon: document.getElementById("guestPhone").value,
                email: document.getElementById("guestEmail").value,
                oda_tipi: secilenOda,
                giris_tarihi: document.getElementById("guestCheckIn").value,
                cikis_tarihi: document.getElementById("guestCheckOut").value
            };

            const result = await apiIstekAt("/rezervasyonlar", "POST", payload);
            if (!result) return;

            alert(`Talebiniz alındı. ${result.mesaj || ''} Rezervasyonunuz yetkili onayına düşmüştür.`);
            publicReservationForm.reset();
            
            if (roomTypeSelect) {
                roomTypeSelect.dispatchEvent(new Event('change'));
            }

            const target = document.getElementById("availabilityResult");
            if (target) {
                target.innerHTML = `<div class="mini-card"><strong>Talebiniz alındı</strong><span>Rezervasyon kaydınız başarıyla oluşturuldu. Yetkili ekip onay verdikten sonra süreç tamamlanır.</span></div>`;
            }
        });
    }
});