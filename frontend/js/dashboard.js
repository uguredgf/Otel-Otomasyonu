document.addEventListener("DOMContentLoaded", async () => {
    if (!requireAuth()) return;
    applyShell();
    await Promise.all([dashboardOzetiniGetir(), aktifMisafirleriGetir()]);
});

async function dashboardOzetiniGetir() {
    const veri = await apiIstekAt("/dashboard/ozet");
    if (!veri) return;

    metinYaz("k_toplam_misafir", veri.dolu_oda_sayisi || 0);
    metinYaz("k_musait_oda", veri.bos_oda_sayisi || 0);
    metinYaz("k_bekleyen_fatura", `${paraFormatla(veri.toplam_ciro || 0)} TL`);

    const toplamOda = (veri.dolu_oda_sayisi || 0) + (veri.bos_oda_sayisi || 0);
    const dolulukOrani = toplamOda > 0
        ? Math.round(((veri.dolu_oda_sayisi || 0) / toplamOda) * 100)
        : 0;

    metinYaz("k_doluluk_orani", `%${dolulukOrani}`);
}

async function aktifMisafirleriGetir() {
    const misafirler = filterCheckedOutGuests((await apiIstekAt("/aktif-misafirler") || []).map(normalizeGuest));
    const tabloGovdesi = document.getElementById("misafirTablosu");

    if (!tabloGovdesi) return;
    tabloGovdesi.innerHTML = "";

    if (misafirler && misafirler.length > 0) {
        let bugunCikisSayisi = 0;
        const bugun = formatDateKey(new Date());

        misafirler.forEach((misafir) => {
            const cikisAnahtari = formatDateKey(misafir.checkOut);
            if (cikisAnahtari === bugun) {
                bugunCikisSayisi += 1;
            }

            tabloGovdesi.innerHTML += `
                <tr>
                    <td>${escapeHtml(misafir.customerName)}</td>
                    <td><span class="room-badge">${escapeHtml(misafir.roomNo)}</span></td>
                    <td><span class="status-badge">Onaylandi</span></td>
                    <td>${escapeHtml(misafir.checkIn)}</td>
                    <td>${escapeHtml(misafir.checkOut)}</td>
                    <td>
                        <a class="table-action" href="islemler.html?reservationId=${encodeURIComponent(misafir.reservationId)}">Faturaya Git</a>
                    </td>
                </tr>
            `;
        });

        metinYaz("k_aktif_misafir", misafirler.length);
        metinYaz("k_bugun_cikis", bugunCikisSayisi);
        metinYaz("k_toplam_misafir", misafirler.length);
    } else {
        tabloGovdesi.innerHTML = `
            <tr>
                <td colspan="6">
                    <div class="empty-state">Su an otelde aktif misafir bulunmuyor.</div>
                </td>
            </tr>
        `;
        metinYaz("k_aktif_misafir", 0);
        metinYaz("k_bugun_cikis", 0);
        metinYaz("k_toplam_misafir", 0);
    }
}

const rezervasyonFormu = document.getElementById("formRezervasyon");
if (rezervasyonFormu) {
    rezervasyonFormu.addEventListener("submit", async (event) => {
        event.preventDefault();

        const yeniRezervasyonVerisi = {
            tc_kimlik: document.getElementById("rezTc").value,
            ad: document.getElementById("rezAd").value,
            soyad: document.getElementById("rezSoyad").value,
            telefon: document.getElementById("rezTelefon").value,
            email: document.getElementById("rezEmail").value,
            oda_tipi: document.getElementById("rezOdaTipi").value,
            giris_tarihi: document.getElementById("rezGiris").value,
            cikis_tarihi: document.getElementById("rezCikis").value
        };

        const sonuc = await apiIstekAt("/rezervasyonlar", "POST", yeniRezervasyonVerisi);

        if (sonuc) {
            alert(`Harika! ${sonuc.mesaj}`);
            rezervasyonFormu.reset();
            addOperationLog(
                "rezervasyon",
                `${yeniRezervasyonVerisi.ad} ${yeniRezervasyonVerisi.soyad} icin rezervasyon olusturuldu`,
                `${yeniRezervasyonVerisi.giris_tarihi} - ${yeniRezervasyonVerisi.cikis_tarihi} tarihleri arasinda ${yeniRezervasyonVerisi.oda_tipi} oda talebi alindi.`
            );

            const modal = bootstrap.Modal.getInstance(document.getElementById("rezervasyonModal"));
            if (modal) modal.hide();

            await Promise.all([dashboardOzetiniGetir(), aktifMisafirleriGetir()]);
        }
    });
}

function paraFormatla(tutar) {
    return new Intl.NumberFormat("tr-TR").format(Number(tutar) || 0);
}

function metinYaz(id, deger) {
    const alan = document.getElementById(id);
    if (alan) alan.textContent = deger;
}
