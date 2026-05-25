document.addEventListener("DOMContentLoaded", async () => {
    const roomSelect = document.getElementById("resRoomType");
    const checkInInput = document.getElementById("resCheckIn");
    const checkOutInput = document.getElementById("resCheckOut");
    const vitrinBos = document.getElementById("vitrinBos");
    const vitrinDoluOda = document.getElementById("vitrinDoluOda");
    const vitrinDoluManzara = document.getElementById("vitrinDoluManzara");
    const vitrinGorsel = document.getElementById("vitrinGorsel");
    const vitrinOdaIsmi = document.getElementById("vitrinOdaIsmi");
    const vitrinManzara = document.getElementById("vitrinManzara");
    const vitrinManzaraIsmi = document.getElementById("vitrinManzaraIsmi");
    const vitrinFiyat = document.getElementById("vitrinFiyat");
    const form = document.getElementById("yeniRezervasyonFormu");
    const btnSorgula = document.getElementById("btnSorgula");
    const btnRezervasyon = document.getElementById("btnRezervasyon");
    const sorguSonucu = document.getElementById("sorguSonucu");
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    const captionText = document.getElementById("modalCaption");
    const closeBtn = document.querySelector(".close-modal");

    if (vitrinGorsel) vitrinGorsel.style.cursor = "pointer";
    if (vitrinManzara) vitrinManzara.style.cursor = "pointer";

    const odaResimleri = {
        "Ekonomik Oda": "img/ekonomikoda.png",
        "Standart Tek Kişilik": "img/tekkisi.png",
        "Standart Çift Kişilik": "img/ciftkisi.png",
        "Aile Süiti": "img/aileodasi.png",
        "Balayı Süiti": "img/balayisuiti.png",
        "Kral Dairesi": "img/kral.png"
    };

    const manzaraResimleri = {
        "Arka Cephe": "img/sehirmanz.png",
        "Bahçe ve Havuz": "img/bahcehavuz.png",
        "Deniz Manzaralı": "img/denizmanzarası.png",
        "Jakuzili": "img/jakuzili_deniz.png",
        "Özel Havuzlu": "img/havuzlu_deniz.png"
    };

    let odaFiyatlari = {};

    async function fiyatlariVeritabanindanCek() {
        const veriler = await apiIstekAt("/odalar/fiyatlar");
        if (veriler && Array.isArray(veriler)) {
            veriler.forEach(o => {
                const anahtar = o.oda_tipi || o.odaTur_adi || o.type;
                const fiyatDegeri = o.fiyat || o.taban_fiyat || o.price;
                if (anahtar && fiyatDegeri) {
                    odaFiyatlari[anahtar] = fiyatDegeri + " TL";
                }
            });
        }
    }

    await fiyatlariVeritabanindanCek();

    if (roomSelect) {
        roomSelect.addEventListener("change", function() {
            const secilenDeger = this.value;
            let odaAnahtar = "";
            let manzaraAnahtar = "";

            if (secilenDeger === "Tüm Odalar") {
                vitrinBos.style.display = "none";
                vitrinGorsel.src = "img/otelindisii.png";
                vitrinOdaIsmi.textContent = "Genel Otel Müsaitliği";
                vitrinDoluOda.style.display = "block";
                vitrinDoluManzara.style.display = "none";
                if (vitrinFiyat) {
                    vitrinFiyat.textContent = "Farklı Fiyat Seçenekleri";
                }
                return;
            }

            if (secilenDeger.includes("Ekonomik")) odaAnahtar = "Ekonomik Oda";
            else if (secilenDeger.includes("Tek Kişilik")) odaAnahtar = "Standart Tek Kişilik";
            else if (secilenDeger.includes("Çift Kişilik")) odaAnahtar = "Standart Çift Kişilik";
            else if (secilenDeger.includes("Aile")) odaAnahtar = "Aile Süiti";
            else if (secilenDeger.includes("Balayı")) odaAnahtar = "Balayı Süiti";
            else if (secilenDeger.includes("Kral")) odaAnahtar = "Kral Dairesi";

            if (secilenDeger.includes("Arka Cephe")) manzaraAnahtar = "Arka Cephe";
            else if (secilenDeger.includes("Bahçe ve Havuz")) manzaraAnahtar = "Bahçe ve Havuz";
            else if (secilenDeger.includes("Jakuzili")) manzaraAnahtar = "Jakuzili";
            else if (secilenDeger.includes("Özel Havuzlu")) manzaraAnahtar = "Özel Havuzlu";
            else if (secilenDeger.includes("Deniz Manzaralı")) manzaraAnahtar = "Deniz Manzaralı";

            if (odaAnahtar && odaResimleri[odaAnahtar]) {
                vitrinBos.style.display = "none";
                
                vitrinGorsel.src = odaResimleri[odaAnahtar];
                vitrinOdaIsmi.textContent = odaAnahtar;
                vitrinDoluOda.style.display = "block";

                if (vitrinFiyat) {
                    const dinamikFiyat = odaFiyatlari[secilenDeger] || odaFiyatlari[odaAnahtar] || "Yükleniyor...";
                    vitrinFiyat.textContent = "Günlük: " + dinamikFiyat;
                }

                if (manzaraAnahtar && manzaraResimleri[manzaraAnahtar]) {
                    vitrinManzara.src = manzaraResimleri[manzaraAnahtar];
                    vitrinManzaraIsmi.innerHTML = `<i class="fa-solid fa-eye me-2"></i>${manzaraAnahtar} Manzarası`;
                    vitrinDoluManzara.style.display = "block";
                } else {
                    vitrinDoluManzara.style.display = "none";
                }
            }
        });
    }

    if (vitrinGorsel && modal && modalImg) {
        vitrinGorsel.addEventListener("click", () => {
            modal.style.display = "block";
            modalImg.src = vitrinGorsel.src;
            captionText.textContent = vitrinOdaIsmi.textContent;
        });
    }

    if (vitrinManzara && modal && modalImg) {
        vitrinManzara.addEventListener("click", () => {
            modal.style.display = "block";
            modalImg.src = vitrinManzara.src;
            captionText.textContent = "Oda Manzarası";
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
        });
    }

    if (modal) {
        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        });
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal && modal.style.display === "block") {
            modal.style.display = "none";
        }
    });

    function kilitleriSifirla() {
        btnRezervasyon.disabled = true;
        sorguSonucu.textContent = "";
    }

    if (checkInInput) checkInInput.addEventListener("change", kilitleriSifirla);
    if (checkOutInput) checkOutInput.addEventListener("change", kilitleriSifirla);
    if (roomSelect) roomSelect.addEventListener("change", kilitleriSifirla);

    if (btnSorgula) {
        btnSorgula.addEventListener("click", async () => {
            const checkIn = checkInInput.value;
            const checkOut = checkOutInput.value;
            const roomType = roomSelect.value;

            if (!checkIn || !checkOut || !roomType) {
                sorguSonucu.textContent = "⚠️ Lütfen tarih ve oda seçimi yapın.";
                sorguSonucu.style.color = "#d97706";
                return;
            }

            btnSorgula.textContent = "Sorgulanıyor...";
            btnSorgula.disabled = true;

            let tipParametresi = roomType === "Tüm Odalar" ? "all" : encodeURIComponent(roomType);
            const endpoint = `/odalar/musait?giris_tarihi=${checkIn}&cikis_tarihi=${checkOut}&oda_tipi=${tipParametresi}`;
            
            const result = await apiIstekAt(endpoint);

            btnSorgula.textContent = "Müsaitlik Sorgula";
            btnSorgula.disabled = false;

            const odaSayisi = result?.musait_oda_sayisi || (result?.odalar ? result.odalar.length : 0);

            if (odaSayisi > 0) {
                let mesajMetni = roomType === "Tüm Odalar" 
                    ? `Seçilen tarihlerde otelimizde toplam <strong>${odaSayisi} adet</strong> boş oda bulunuyor!` 
                    : `Seçilen tarihlerde bu oda tipinden <strong>${odaSayisi} adet</strong> boş yerimiz var!`;
                    
                sorguSonucu.innerHTML = `<i class="fa-solid fa-check-circle"></i> ${mesajMetni}`;
                sorguSonucu.style.color = "#16a34a";
                
                if (roomType !== "Tüm Odalar") {
                    btnRezervasyon.disabled = false;
                } else {
                    sorguSonucu.innerHTML += `<br><span style="font-size: 0.8rem; color: #64748b;">Rezervasyon yapmak için spesifik bir oda tipi seçmelisiniz.</span>`;
                    btnRezervasyon.disabled = true;
                }
            } else {
                sorguSonucu.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Maalesef bu tarihlerde müsait oda yok.`;
                sorguSonucu.style.color = "#dc2626";
                btnRezervasyon.disabled = true;
            }
        });
    }

    if (form) {
        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            const payload = {
                tc_kimlik: document.getElementById("resTc").value,
                ad: document.getElementById("resName").value,
                soyad: document.getElementById("resSurname").value,
                telefon: document.getElementById("resPhone").value,
                email: document.getElementById("resEmail").value,
                oda_tipi: roomSelect.value,
                giris_tarihi: checkInInput.value,
                cikis_tarihi: checkOutInput.value
            };

            const result = await apiIstekAt("/rezervasyonlar", "POST", payload);
            if (!result) return;

            alert("Rezervasyon talebiniz başarıyla alındı! Yetkili onayına düşmüştür.");
            
            form.reset();
            kilitleriSifirla();
            vitrinBos.style.display = "flex";
            vitrinDoluOda.style.display = "none";
            vitrinDoluManzara.style.display = "none";
        });
    }
});