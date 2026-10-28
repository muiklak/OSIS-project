// =========================================================================
// DATA STRUKTUR ORGANISASI & PENGURUS OSIS
// Ubah nama anggota, jabatan, kelas, foto, dan kategori di file ini.
// =========================================================================

const dataPengurus = {
    badge: "Struktur Pengurus",
    judul: "Kabinet Nawasena 2026/2027",
    subjudul: "Kenali tim berdedikasi yang memimpin dan menjalankan berbagai inisiatif program kerja sekolah.",

    // Tombol Filter Kategori
    kategori: [
        { id: "all", label: "Semua Pengurus" },
        { id: "bph", label: "Pengurus Inti (BPH)" },
        { id: "sekbid1", label: "Sekbid 1 - Keagamaan" },
        { id: "sekbid2", label: "Sekbid 2 - Seni & Kreativitas" },
        { id: "sekbid3", label: "Sekbid 3 - IPTEK & Humas" }
    ],

    // Daftar Anggota Pengurus (Bisa ditambah / dihapus sesuka hati)
    anggota: [
        {
            kategori: "bph",
            badgeKategori: "BPH",
            badgeColor: "bg-brand-600/90",
            nama: "Arya Bagaskara",
            jabatan: "Ketua Umum",
            subJabatan: "Kelas XI MIPA 1",
            foto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80", // Atau "images/ketua.jpg"
            instagram: "https://instagram.com",
            email: "mailto:osis@sman1.sch.id"
        },
        {
            kategori: "bph",
            badgeKategori: "BPH",
            badgeColor: "bg-brand-600/90",
            nama: "Dimas Pratama",
            jabatan: "Wakil Ketua Umum",
            subJabatan: "Kelas XI IPS 2",
            foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80", // Atau "images/wakil.jpg"
            instagram: "https://instagram.com",
            email: ""
        },
        {
            kategori: "bph",
            badgeKategori: "BPH",
            badgeColor: "bg-brand-600/90",
            nama: "Nadia Putri Rahayu",
            jabatan: "Sekretaris Umum",
            subJabatan: "Kelas XI MIPA 3",
            foto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80", // Atau "images/sekretaris.jpg"
            instagram: "https://instagram.com",
            email: ""
        },
        {
            kategori: "bph",
            badgeKategori: "BPH",
            badgeColor: "bg-brand-600/90",
            nama: "Citra Aurelia",
            jabatan: "Bendahara Umum",
            subJabatan: "Kelas XI IPS 1",
            foto: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80", // Atau "images/bendahara.jpg"
            instagram: "https://instagram.com",
            email: ""
        },
        {
            kategori: "sekbid1",
            badgeKategori: "Sekbid 1",
            badgeColor: "bg-amber-500/90",
            nama: "Farhan Maulana",
            jabatan: "Ketua Sekbid 1",
            subJabatan: "Ketakwaan & Budi Pekerti",
            foto: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80",
            instagram: "https://instagram.com",
            email: ""
        },
        {
            kategori: "sekbid2",
            badgeKategori: "Sekbid 2",
            badgeColor: "bg-rose-500/90",
            nama: "Zahra Alifah",
            jabatan: "Ketua Sekbid 2",
            subJabatan: "Seni & Apresiasi Budaya",
            foto: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80",
            instagram: "https://instagram.com",
            email: ""
        },
        {
            kategori: "sekbid3",
            badgeKategori: "Sekbid 3",
            badgeColor: "bg-cyan-500/90",
            nama: "Rizky Hidayat",
            jabatan: "Ketua Sekbid 3",
            subJabatan: "IPTEK, IT & Komunikasi",
            foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80",
            instagram: "https://instagram.com",
            email: ""
        },
        {
            kategori: "sekbid3",
            badgeKategori: "Sekbid 3",
            badgeColor: "bg-cyan-500/90",
            nama: "Salma Nabila",
            jabatan: "Staff Media & Dokumentasi",
            subJabatan: "Kelas X MIPA 2",
            foto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80",
            instagram: "https://instagram.com",
            email: ""
        }
    ]
};
