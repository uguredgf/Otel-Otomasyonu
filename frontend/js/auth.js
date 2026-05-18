// js/auth.js

document.getElementById("loginForm").addEventListener("submit", async function(event) {
    // Sayfanın yenilenmesini engelle
    event.preventDefault();

    // Inputlardaki verileri al
    const kullaniciAdi = document.getElementById("kullaniciAdi").value;
    const sifre = document.getElementById("sifre").value;

    
    const loginVerisi = {
        kullanici_adi: kullaniciAdi,
        sifre: sifre
    };

    // api.js'deki fonksiyonu kullanarak POST isteği at
    const sonuc = await apiIstekAt("/login", "POST", loginVerisi);

    // Eğer backend'den başarılı yanıt döndüyse (null değilse)
    // Eğer backend'den başarılı yanıt döndüyse
    if (sonuc) {
        localStorage.setItem("rol", sonuc.role);
        localStorage.setItem("token", sonuc.token);
        
        // ŞU SATIRIN BAŞINDAKİ ÇİFT SLAŞI SİLDİK:
        window.location.href = "dashboard.html"; 
    }
});