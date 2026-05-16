document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const loginVerisi = {
        kullanici_adi: document.getElementById("kullaniciAdi").value,
        sifre: document.getElementById("sifre").value
    };

    const sonuc = await apiIstekAt("/login", "POST", loginVerisi);
    if (!sonuc) return;

    localStorage.setItem("rol", sonuc.role);
    localStorage.setItem("token", sonuc.token);
    window.location.href = "dashboard.html";
});
