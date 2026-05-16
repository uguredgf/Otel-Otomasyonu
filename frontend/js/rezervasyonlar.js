let tumRezervasyonlar = [];

document.addEventListener("DOMContentLoaded", async () => {
    if (!requireAuth()) return;
    applyShell();
    await Promise.all([rezervasyonlariYukle(), bekleyenOdemeleriYukle()]);
});

async function rezervasyonlariYukle() {
    const data = await apiIstekAt("/rezervasyonlar");
    tumRezervasyonlar = (data || []).map(normalizeReservation);
    const tbody = document.getElementById("rezervasyonTablosu");
    if (!tbody) return;

    if (!tumRezervasyonlar.length) {
        tbody.innerHTML = "<tr><td colspan='9'><div class='empty-state'>Rezervasyon bulunamadi.</div></td></tr>";
        return;
    }

    tbody.innerHTML = tumRezervasyonlar.map((reservation) => `
        <tr>
            <td>${escapeHtml(reservation.reservationId)}</td>
            <td>${escapeHtml(reservation.customerName)}</td>
            <td><span class="room-badge">${escapeHtml(reservation.roomNo)}</span></td>
            <td>${escapeHtml(reservation.roomType)}</td>
            <td>${escapeHtml(reservation.checkIn)}</td>
            <td>${escapeHtml(reservation.checkOut)}</td>
            <td>${durumRozeti(reservation.status)}</td>
            <td>${escapeHtml(reservation.paymentStatus)}</td>
            <td>${aksiyonButonlari(reservation)}</td>
        </tr>
    `).join("");

    bindReservationActions();
}

async function bekleyenOdemeleriYukle() {
    const target = document.getElementById("bekleyenOdemeListesi");
    if (!target) return;

    const data = await apiIstekAt("/finans/odeme-bekleyenler");
    if (!data || !data.length) {
        target.innerHTML = "<div class='mini-note'>Su an bekleyen odeme kaydi gorunmuyor.</div>";
        return;
    }

    target.innerHTML = data.slice(0, 5).map((item) => `
        <div class="mini-list-item">
            <span>${escapeHtml(item.musteri_adi || item.ad || "Misafir")}</span>
            <strong>${formatCurrency(item.tutar || item.toplam_tutar || 0)}</strong>
        </div>
    `).join("");
}

const rezervasyonFormu = document.getElementById("rezervasyonFormu");
if (rezervasyonFormu) {
    rezervasyonFormu.addEventListener("submit", async (event) => {
        event.preventDefault();

        const payload = {
            tc_kimlik: document.getElementById("rezTc").value,
            ad: document.getElementById("rezAd").value,
            soyad: document.getElementById("rezSoyad").value,
            telefon: document.getElementById("rezTelefon").value,
            email: document.getElementById("rezEmail").value,
            oda_tipi: document.getElementById("rezOdaTipi").value,
            giris_tarihi: document.getElementById("rezGiris").value,
            cikis_tarihi: document.getElementById("rezCikis").value
        };

        const result = await apiIstekAt("/rezervasyonlar", "POST", payload);
        if (!result) return;

        addOperationLog(
            "rezervasyon",
            `${payload.ad} ${payload.soyad} icin yeni rezervasyon olusturuldu`,
            `${payload.giris_tarihi} - ${payload.cikis_tarihi} tarihleri arasinda ${payload.oda_tipi} oda talebi kaydedildi.`
        );

        alert(`Basarili! ${result.mesaj}`);
        rezervasyonFormu.reset();
        await rezervasyonlariYukle();
    });
}

function aksiyonButonlari(reservation) {
    const actions = [];

    if (reservation.status === "Beklemede") {
        actions.push(`<button class="table-action reservation-action" data-action="approve" data-id="${reservation.reservationId}">Onayla</button>`);
        actions.push(`<button class="secondary-btn reservation-action" data-action="cancel" data-id="${reservation.reservationId}">Iptal Et</button>`);
    } else if (reservation.status === "Onaylandı") {
        actions.push(`<a class="table-action" href="islemler.html?reservationId=${encodeURIComponent(reservation.reservationId)}">Faturaya Git</a>`);
        actions.push(`<button class="secondary-btn reservation-action" data-action="cancel" data-id="${reservation.reservationId}">Iptal Et</button>`);
    } else {
        actions.push("<span class='mini-note'>Islem yok</span>");
    }

    return `<div class="action-row">${actions.join("")}</div>`;
}

function durumRozeti(status) {
    if (status === "Onaylandı") {
        return '<span class="status-badge">Onaylandi</span>';
    }
    if (status === "İptal Edildi") {
        return '<span class="status-badge danger">Iptal Edildi</span>';
    }
    if (status === "Tamamlandı") {
        return '<span class="status-badge warning">Tamamlandi</span>';
    }
    return '<span class="status-badge warning">Beklemede</span>';
}

function bindReservationActions() {
    document.querySelectorAll(".reservation-action").forEach((button) => {
        button.addEventListener("click", async () => {
            const reservationId = button.getAttribute("data-id");
            const action = button.getAttribute("data-action");
            const reservation = tumRezervasyonlar.find((item) => String(item.reservationId) === String(reservationId));
            if (!reservation) return;

            const yeniDurum = action === "approve" ? "Onaylandı" : "İptal Edildi";
            const result = await apiIstekAt("/rezervasyonlar/durum", "PUT", {
                rezervasyon_id: Number(reservation.reservationId),
                yeni_durum: yeniDurum
            });

            if (!result) return;

            syncReservationStatusEffects(reservation, yeniDurum);
            addOperationLog(
                "rezervasyon",
                `${reservation.customerName} rezervasyonu guncellendi`,
                `${reservation.reservationId} numarali rezervasyon '${yeniDurum}' durumuna alindi.`
            );

            alert(result.mesaj);
            await Promise.all([rezervasyonlariYukle(), bekleyenOdemeleriYukle()]);
        });
    });
}
