document.addEventListener("DOMContentLoaded", async () => {
    let secilenSpesifikOdaNo = null;

    const roomSelect = document.getElementById("resRoomType");
    const checkInInput = document.getElementById("resCheckIn");
    const checkOutInput = document.getElementById("resCheckOut");
    const vitrinBos = document.getElementById("vitrinBos");
    const vitrinDoluOda = document.getElementById("vitrinDoluOda");
    const vitrinDoluManzara = document.getElementById("vitrinDoluManzara");
    const vitrinDoluBanyo = document.getElementById("vitrinDoluBanyo");
    const vitrinGorsel = document.getElementById("vitrinGorsel");
    const vitrinOdaIsmi = document.getElementById("vitrinOdaIsmi");
    const vitrinManzara = document.getElementById("vitrinManzara");
    const vitrinBanyo = document.getElementById("vitrinBanyo");
    const vitrinManzaraIsmi = document.getElementById("vitrinManzaraIsmi");
    const vitrinFiyat = document.getElementById("vitrinFiyat");
    const form = document.getElementById("yeniRezervasyonFormu");
    const btnSorgula = document.getElementById("btnSorgula");
    const btnRezervasyon = document.getElementById("btnRezervasyon");
    const sorguSonucu = document.getElementById("sorguSonucu");
    const katPlaniGorsel = document.getElementById("katPlaniGorsel");
    const odaDetaylariAlani = document.getElementById("odaDetaylariAlani");
    
    // Modal Elementleri
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    const captionText = document.getElementById("modalCaption");
    const closeBtn = document.querySelector(".close-modal");

    if (vitrinGorsel) vitrinGorsel.style.cursor = "pointer";
    if (vitrinManzara) vitrinManzara.style.cursor = "pointer";
    if (vitrinBanyo) vitrinBanyo.style.cursor = "pointer";

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

    // Modal (Lightbox) İşlemleri
    if (katPlaniGorsel && modal && modalImg && closeBtn) {
        katPlaniGorsel.addEventListener("click", function() {
            modal.style.display = "flex";
            modalImg.src = this.src;
            captionText.textContent = "Mirage Coast Hotel - Genel Kat ve Cephe Planı";
        });
    }
    if (vitrinGorsel && modal && modalImg && closeBtn) {
        vitrinGorsel.addEventListener("click", function() {
            modal.style.display = "flex";
            modalImg.src = this.src;
            captionText.textContent = vitrinOdaIsmi.textContent;
        });
    }
    if (vitrinManzara && modal && modalImg && closeBtn) {
        vitrinManzara.addEventListener("click", function() {
            modal.style.display = "flex";
            modalImg.src = this.src;
            captionText.textContent = vitrinManzaraIsmi.textContent.replace(/\s+/g, ' ').trim();
        });
    }
    // Banyo görseli için Modal eklentisi
    if (vitrinBanyo && modal && modalImg && closeBtn) {
        vitrinBanyo.addEventListener("click", function() {
            modal.style.display = "flex";
            modalImg.src = this.src;
            captionText.textContent = "Banyo / Tuvalet Detayı";
        });
    }

    if (closeBtn) closeBtn.addEventListener("click", () => modal.style.display = "none");
    if (modal) modal.addEventListener("click", (e) => { if (e.target === modal) modal.style.display = "none"; });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && modal && modal.style.display === "flex") modal.style.display = "none"; });

    // Arayüz Sıfırlama
    function kilitleriSifirla() {
        btnRezervasyon.disabled = true;
        sorguSonucu.innerHTML = "";
        secilenSpesifikOdaNo = null;
        
        const musteriAlani = document.getElementById("musteriBilgileriAlani");
        if(musteriAlani) {
            musteriAlani.style.opacity = "0.4";
            musteriAlani.style.pointerEvents = "none";
        }
        
        const odaKutusu = document.getElementById("secilebilirOdalarKutusu");
        if(odaKutusu) odaKutusu.style.display = "none";

        if(odaDetaylariAlani) odaDetaylariAlani.style.display = "none";
    }

    if (checkInInput) checkInInput.addEventListener("change", kilitleriSifirla);
    if (checkOutInput) checkOutInput.addEventListener("change", kilitleriSifirla);
    if (roomSelect) roomSelect.addEventListener("change", kilitleriSifirla);

    // Müsaitlik Sorgulama İşlemleri
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

            btnSorgula.textContent = "Plan Çıkarılıyor...";
            btnSorgula.disabled = true;

            let tipParametresi = roomType === "Tüm Odalar" ? "all" : encodeURIComponent(roomType);
            const endpoint = `/odalar/musait?giris_tarihi=${checkIn}&cikis_tarihi=${checkOut}&oda_tipi=${tipParametresi}`;
            
            const result = await apiIstekAt(endpoint);

            btnSorgula.textContent = "Müsaitlik Sorgula";
            btnSorgula.disabled = false;

            const odaSayisi = result?.musait_oda_sayisi || (result?.odalar ? result.odalar.length : 0);

            if (odaSayisi > 0) {
                sorguSonucu.innerHTML = `<i class="fa-solid fa-arrow-right"></i> Müsaitlik bulundu! Lütfen <strong>sağ taraftaki plandan</strong> bir oda seçiniz.`;
                sorguSonucu.style.color = "#0284c7";
                
                const sagKutu = document.getElementById("secilebilirOdalarKutusu");
                const katSekmeleri = document.getElementById("katSekmeleri");
                const odaGridAlani = document.getElementById("odaGridAlani");
                
                if (sagKutu && katSekmeleri && odaGridAlani) {
                    sagKutu.style.display = "block";
                    
                    const musaitNumaralar = result.odalar.map(o => (o.oda_no || o.roomNo).toString());
                    const katSet = new Set();
                    musaitNumaralar.forEach(no => {
                        let kat = no.length > 2 ? no.substring(0, no.length - 2) : "1";
                        katSet.add(kat);
                    });
                    const siraliKatlar = Array.from(katSet).sort((a,b) => parseInt(a) - parseInt(b));

                    katSekmeleri.innerHTML = "";
                    siraliKatlar.forEach((kat, index) => {
                        const btn = document.createElement("div");
                        btn.className = `floor-tab ${index === 0 ? 'active' : ''}`;
                        btn.innerHTML = `<i class="fa-solid fa-layer-group me-1"></i> ${kat}. Kat`;
                        btn.addEventListener("click", () => {
                            document.querySelectorAll('.floor-tab').forEach(t => t.classList.remove('active'));
                            btn.classList.add('active');
                            odalariCiz(kat);
                        });
                        katSekmeleri.appendChild(btn);
                    });

                    function odalariCiz(katNo) {
                        odaGridAlani.innerHTML = "";
                        
                        for(let i = 1; i <= 10; i++) {
                            const odaNo = `${katNo}${i.toString().padStart(2, '0')}`;
                            const isMusait = musaitNumaralar.includes(odaNo);
                            const isSelected = secilenSpesifikOdaNo === odaNo;

                            const roomBox = document.createElement("div");
                            roomBox.className = `room-box ${isMusait ? 'available' : ''} ${isSelected ? 'selected' : ''}`;
                            const ikon = isSelected ? 'fa-door-open' : (isMusait ? 'fa-door-closed' : 'fa-ban');
                            roomBox.innerHTML = `<span>${odaNo}</span><i class="fa-solid ${ikon} mt-1"></i>`;
                            
                            if (isMusait) {
                                const odaVerisi = result.odalar.find(o => (o.oda_no || o.roomNo).toString() === odaNo);
                                const odaTipi = odaVerisi ? (odaVerisi.oda_tipi || odaVerisi.type || odaVerisi.odaTur_adi || roomType) : roomType;

                                roomBox.addEventListener("click", () => {
                                    document.querySelectorAll('.room-box.selected').forEach(b => {
                                        b.classList.remove('selected');
                                        b.querySelector('i').className = "fa-solid fa-door-closed mt-1";
                                    });
                                    
                                    roomBox.classList.add('selected');
                                    roomBox.querySelector('i').className = "fa-solid fa-door-open mt-1";
                                    secilenSpesifikOdaNo = odaNo;
                                    
                                    const musteriAlani = document.getElementById("musteriBilgileriAlani");
                                    if (musteriAlani) {
                                        musteriAlani.style.opacity = "1";
                                        musteriAlani.style.pointerEvents = "auto";
                                    }
                                    btnRezervasyon.disabled = false;
                                    
                                    sorguSonucu.innerHTML = `<i class="fa-solid fa-check-circle"></i> <strong>Oda ${secilenSpesifikOdaNo}</strong> plan üzerinden seçildi. İşleme devam edebilirsiniz.`;
                                    sorguSonucu.style.color = "#16a34a";

                                    // FOTOĞRAFLARI ÇAĞIRMA İŞLEMİ
                                    let odaAnahtar = ""; let manzaraAnahtar = "";
                                    if (odaTipi.includes("Ekonomik")) odaAnahtar = "Ekonomik Oda";
                                    else if (odaTipi.includes("Tek Kişilik")) odaAnahtar = "Standart Tek Kişilik";
                                    else if (odaTipi.includes("Çift Kişilik")) odaAnahtar = "Standart Çift Kişilik";
                                    else if (odaTipi.includes("Aile")) odaAnahtar = "Aile Süiti";
                                    else if (odaTipi.includes("Balayı")) odaAnahtar = "Balayı Süiti";
                                    else if (odaTipi.includes("Kral")) odaAnahtar = "Kral Dairesi";

                                    if (odaTipi.includes("Arka Cephe")) manzaraAnahtar = "Arka Cephe";
                                    else if (odaTipi.includes("Bahçe ve Havuz")) manzaraAnahtar = "Bahçe ve Havuz";
                                    else if (odaTipi.includes("Jakuzili")) manzaraAnahtar = "Jakuzili";
                                    else if (odaTipi.includes("Özel Havuzlu")) manzaraAnahtar = "Özel Havuzlu";
                                    else if (odaTipi.includes("Deniz Manzaralı")) manzaraAnahtar = "Deniz Manzaralı";

                                    if(odaDetaylariAlani) odaDetaylariAlani.style.display = "block";

                                    // Oda Görseli
                                    if (odaAnahtar && odaResimleri[odaAnahtar]) {
                                        vitrinGorsel.src = odaResimleri[odaAnahtar];
                                        vitrinOdaIsmi.textContent = odaAnahtar;
                                        const dinamikFiyat = odaFiyatlari[odaTipi] || odaFiyatlari[odaAnahtar] || "";
                                        if (vitrinFiyat) vitrinFiyat.textContent = dinamikFiyat ? "Günlük: " + dinamikFiyat : "";
                                    }

                                    // Manzara Görseli
                                    if (manzaraAnahtar && manzaraResimleri[manzaraAnahtar]) {
                                        vitrinManzara.src = manzaraResimleri[manzaraAnahtar];
                                        vitrinManzaraIsmi.innerHTML = `<i class="fa-solid fa-eye me-2"></i>${manzaraAnahtar} Manzarası`;
                                        vitrinDoluManzara.style.display = "block";
                                    } else {
                                        vitrinDoluManzara.style.display = "none";
                                    }

                                    // Banyo Görseli Mantığı
                                    if (odaTipi.includes("Kral") || odaTipi.includes("Balayı")) {
                                        vitrinBanyo.src = "img/lukstuvalet.png";
                                    } else {
                                        vitrinBanyo.src = "img/ekotuvalet.png";
                                    }
                                    if (vitrinDoluBanyo) vitrinDoluBanyo.style.display = "block";
                                });
                            }
                            odaGridAlani.appendChild(roomBox);
                        }
                    }

                    if(siraliKatlar.length > 0) {
                        odalariCiz(siraliKatlar[0]);
                    }
                }
            } else {
                sorguSonucu.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Maalesef bu tarihlerde müsait oda yok.`;
                sorguSonucu.style.color = "#dc2626";
                const sagKutu = document.getElementById("secilebilirOdalarKutusu");
                if (sagKutu) sagKutu.style.display = "none";
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
                oda_no: secilenSpesifikOdaNo,
                giris_tarihi: checkInInput.value,
                cikis_tarihi: checkOutInput.value
            };

            const result = await apiIstekAt("/rezervasyonlar", "POST", payload);
            
            if (!result) {
                alert(`Uyarı: Uğur'un backend API'si henüz hazır değil. Ancak Frontend verileri başarıyla topladı! \n\nSeçilen Oda: ${secilenSpesifikOdaNo}`);
            } else {
                alert("Rezervasyon talebiniz başarıyla alındı! Yetkili onayına düşmüştür.");
            }
            
            form.reset();
            kilitleriSifirla();
        });
    }

    const urlParams = new URLSearchParams(window.location.search);
    const gelenOdaTipi = urlParams.get('oda');

    if (gelenOdaTipi && roomSelect) {
        for (let i = 0; i < roomSelect.options.length; i++) {
            if (roomSelect.options[i].value.includes(gelenOdaTipi)) {
                roomSelect.selectedIndex = i; 
                roomSelect.dispatchEvent(new Event('change'));

                const bilgiKutusu = document.createElement("div");
                bilgiKutusu.className = "mt-2 p-2 rounded bg-light border-start border-4 border-info shadow-sm";
                bilgiKutusu.innerHTML = `<i class="fa-solid fa-circle-info text-info me-2"></i><span style="font-size: 0.85rem; color: #475569;">Oda tercihiniz aktarıldı. Dilerseniz yukarıdaki menüden <strong>farklı bir manzara seçeneği</strong> belirleyebilirsiniz.</span>`;
                
                roomSelect.parentNode.appendChild(bilgiKutusu);
                break; 
            }
        }
    }
});