const publicReservationForm = document.getElementById("publicReservationForm");
const availabilityBtn = document.getElementById("availabilityBtn");

if (availabilityBtn) {
    availabilityBtn.addEventListener("click", musaitlikSorgula);
}

if (publicReservationForm) {
    publicReservationForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const payload = getPublicReservationPayload();
        const result = await apiIstekAt("/rezervasyonlar", "POST", payload);
        if (!result) return;

        alert(`Talebiniz alindi. ${result.mesaj} Rezervasyonunuz yetkili onayina dusmustur.`);
        publicReservationForm.reset();
        renderAvailabilityMessage(
            "Talebiniz alindi",
            "Rezervasyon kaydiniz basariyla olusturuldu. Yetkili ekip onay verdikten sonra surec tamamlanir."
        );
    });
}

async function musaitlikSorgula() {
    const checkIn = document.getElementById("guestCheckIn").value;
    const checkOut = document.getElementById("guestCheckOut").value;
    const roomType = document.getElementById("guestRoomType").value;

    if (!checkIn || !checkOut || !roomType) {
        alert("Lutfen musaitlik sorgusu icin tarih ve oda tipi secin.");
        return;
    }

    // DEĞİŞİKLİK: URL'nin sonuna &oda_tipi= parametresini güvenli bir şekilde ekledik!
    const result = await apiIstekAt(
        `/odalar/musait?giris_tarihi=${encodeURIComponent(checkIn)}&cikis_tarihi=${encodeURIComponent(checkOut)}&oda_tipi=${encodeURIComponent(roomType)}`
    );
    if (!result) return;

    renderAvailabilityMessage(
        `${result.musait_oda_sayisi || 0} oda bulundu`,
        `${roomType} icin secilen tarihlerde musait gorunen oda sayisi: ${result.musait_oda_sayisi || 0}`
    );
}

function getPublicReservationPayload() {
    return {
        tc_kimlik: document.getElementById("guestTc").value,
        ad: document.getElementById("guestName").value,
        soyad: document.getElementById("guestSurname").value,
        telefon: document.getElementById("guestPhone").value,
        email: document.getElementById("guestEmail").value,
        oda_tipi: document.getElementById("guestRoomType").value,
        giris_tarihi: document.getElementById("guestCheckIn").value,
        cikis_tarihi: document.getElementById("guestCheckOut").value
    };
}

function renderAvailabilityMessage(title, text) {
    const target = document.getElementById("availabilityResult");
    if (!target) return;

    target.innerHTML = `
        <div class="mini-card">
            <strong>${escapePublicHtml(title)}</strong>
            <span>${escapePublicHtml(text)}</span>
        </div>
    `;
}

function escapePublicHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}
