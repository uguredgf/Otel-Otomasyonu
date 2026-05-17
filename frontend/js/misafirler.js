document.addEventListener("DOMContentLoaded", async () => {
    if (!requireAuth()) return;
    applyShell();
    await aktifMisafirleriYukle();
});

async function aktifMisafirleriYukle() {
    const data = await apiIstekAt("/musteriler");
    const guests = filterCheckedOutGuests(((data && data.musteriler) || []).map(normalizeGuest));
    const tbody = document.getElementById("misafirTablosu");
    if (!tbody) return;

    if (!guests.length) {
        tbody.innerHTML = "<tr><td colspan='7'><div class='empty-state'>Şu an konaklayan aktif misafir bulunmuyor.</div></td></tr>";
        return;
    }

    tbody.innerHTML = guests.map((guest) => `
        <tr>
            <td>${escapeHtml(guest.customerName)}</td>
            <td>${escapeHtml(guest.identityNo)}</td>
            <td><span class="room-badge">${escapeHtml(guest.roomNo)}</span></td>
            <td>${escapeHtml(guest.checkIn)}</td>
            <td>${escapeHtml(guest.checkOut)}</td>
            <td>${escapeHtml(guest.email)}</td>
            <td><a class="table-action" href="islemler.html?reservationId=${encodeURIComponent(guest.reservationId)}">Hesap/Fatura</a></td>
        </tr>
    `).join("");
}
