// =========================================================================
// DATA PROGRAM DONASI OSIS (1 MENU TUNGGAL: QRIS & TRANSFER E-WALLET / BANK)
// =========================================================================

const dataDonasi = {
    badge: "⚡ DUKUNG PROGRAM OSIS",
    judul: "Kotak Donasi & Kemitraan",
    deskripsiSingkat: "Dukungan sukarela untuk kegiatan siswa, santunan sosial, dan kelengkapan sarana OSIS sepanjang tahun.",
    
    // Target & Realisasi Penggalangan Dana
    targetDonasi: "Rp 25.000.000",
    terkumpulDonasi: "Rp 18.750.000",
    persentase: 75,
    totalDonatur: 142,

    // 1 Menu Tunggal: Metode QRIS & E-Wallet / Transfer
    qris: {
        nama: "QRIS All Payment Resmi OSIS",
        instruksi: "Bisa di-scan langsung dari GoPay, OVO, DANA, ShopeePay, BCA Mobile, Livin Mandiri & semua m-Banking.",
        gambar: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=DONASI-OSIS-SMKN-BATUJAYA-2026",
        nmid: "ID1020039482910"
    },

    // Daftar Rekening E-Wallet & Bank Transfer
    metodeTransfer: [
        {
            tipe: "E-Wallet",
            nama: "DANA / GoPay",
            nomor: "0812-3456-7890",
            atasNama: "BENDAHARA OSIS (CITRA)",
            icon: "fa-solid fa-mobile-screen-button",
            warna: "text-retro-pink"
        },
        {
            tipe: "E-Wallet",
            nama: "OVO / ShopeePay",
            nomor: "0812-3456-7890",
            atasNama: "BENDAHARA OSIS (CITRA)",
            icon: "fa-solid fa-wallet",
            warna: "text-purple-600"
        },
        {
            tipe: "Bank Transfer",
            nama: "Bank BCA",
            nomor: "827-092-1144",
            atasNama: "CITRA AURELIA (BENDAHARA)",
            icon: "fa-solid fa-building-columns",
            warna: "text-blue-600"
        },
        {
            tipe: "Bank Transfer",
            nama: "Bank Mandiri",
            nomor: "132-00-9876543-1",
            atasNama: "OSIS SMKN BATUJAYA",
            icon: "fa-solid fa-credit-card",
            warna: "text-amber-600"
        }
    ],

    // Pilihan Cepat Nominal
    nominalPilihan: [
        { label: "Rp 10.000", nilai: 10000 },
        { label: "Rp 25.000", nilai: 25000 },
        { label: "Rp 50.000", nilai: 50000 },
        { label: "Rp 100.000", nilai: 100000 }
    ],

    // Link WhatsApp Konfirmasi Bukti Donasi
    waKonfirmasi: "https://wa.me/6281234567890?text=Halo%20Humas%20OSIS,%20saya%20sudah%20melakukan%20donasi/transfer%20untuk%20program%20OSIS.%20Berikut%20bukti%20transfernya."
};
