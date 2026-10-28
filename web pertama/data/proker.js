// =========================================================================
// DATA PROGRAM KERJA UNGGULAN (PROKER)
// Ubah daftar program kerja, deskripsi, tanggal, lokasi, dan foto di file ini.
// =========================================================================

const dataProker = {
    badge: "Agenda & Aksi",
    judul: "Program Kerja Unggulan",
    subjudul: "Daftar agenda prioritas OSIS untuk meningkatkan kreativitas, sportivitas, dan solidaritas antar siswa.",

    // Daftar Program Kerja
    daftar: [
        {
            judul: "Smansa Cup & Pentas Seni Akbar",
            sekbid: "Sekbid Olahraga & Seni",
            deskripsi: "Turnamen olahraga antar sekolah se-kabupaten dilanjutkan festival pentas seni dan bintang tamu nasional.",
            status: "Mendatang (Des 2026)",
            statusColor: "bg-emerald-500",
            statusIcon: "fa-solid fa-check-circle",
            lokasi: "Lapangan Utama",
            peserta: "Terbuka Umum",
            gambar: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80" // Atau "images/proker-cup.jpg"
        },
        {
            judul: "LDKS (Latihan Kepemimpinan Siswa)",
            sekbid: "Pengurus Inti & Sekbid 4",
            deskripsi: "Pembekalan mental kepemimpinan, manajemen organisasi, dan kedisiplinan bagi calon pengurus baru.",
            status: "Rutin Tahunan",
            statusColor: "bg-brand-600",
            statusIcon: "fa-solid fa-calendar",
            lokasi: "Villa Bunga, Bogor",
            peserta: "Siswa Terpilih",
            gambar: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=600&auto=format&fit=crop&q=80" // Atau "images/proker-ldks.jpg"
        },
        {
            judul: "Smansa Berbagi (Bakti Sosial)",
            sekbid: "Sekbid Hubungan Masyarakat",
            deskripsi: "Penggalangan sembako dan donasi buku pelajaran untuk panti asuhan serta masyarakat sekitar sekolah.",
            status: "Terlaksana",
            statusColor: "bg-amber-500",
            statusIcon: "fa-solid fa-heart",
            lokasi: "Lingkungan Sekitar",
            peserta: "Seluruh Siswa",
            gambar: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&auto=format&fit=crop&q=80" // Atau "images/proker-baksos.jpg"
        }
    ]
};
