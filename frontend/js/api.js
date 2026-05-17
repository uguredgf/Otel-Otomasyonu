// js/api.js

const BASE_URL = "http://127.0.0.1:8000";

// Tüm backend isteklerini yönetecek ana fonksiyon
async function apiIstekAt(endpoint, method = "GET", bodyData = null) {
    const ayarlar = {
        method: method,
        headers: { 
            "Content-Type": "application/json" 
        }
    };
    
    // Eğer post/put işlemiyse veriyi JSON'a çevirip ekle
    if (bodyData) {
        ayarlar.body = JSON.stringify(bodyData);
    }
    
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, ayarlar);
        const data = await response.json();
        
        // Backend'den 400, 422, 500 gibi bir hata gelirse yakala
        if (!response.ok) {
            throw new Error(data.detail || "İşlem başarısız oldu.");
        }
        return data;
    } catch (error) {
        console.error("API Hatası:", error);
        alert(error.message); // Ekranda hatayı göster
        return null;
    }
}