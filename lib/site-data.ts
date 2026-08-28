import {
  Baby,
  BookOpenText,
  BriefcaseBusiness,
  Handshake,
  HeartHandshake,
  Landmark,
  Scale,
  ScrollText,
  ShieldCheck
} from "lucide-react";

type LawyerCertificate = {
  negeri: string;
  title: string;
  href: string;
  type: "image" | "pdf";
};

type Lawyer = {
  name: string;
  role: string;
  image: string;
  email?: string;
  highlight: string;
  qualifications: string[];
  certificates: LawyerCertificate[];
  practice: string;
};

export const firm = {
  name: "Nuaim Razak & Partners",
  tagline: "Khidmat Guaman Syarie",
  positioning: "Bantuan Guaman Syarie & Nasihat Perundangan Syariah",
  phoneDisplay: "011-6505 5757",
  phoneHref: "tel:+601165055757",
  whatsappNumber: "601165055757",
  whatsappHref:
    "https://wa.me/601165055757?text=Assalamualaikum%2C%20saya%20ingin%20membuat%20temujanji%20konsultasi%20guaman%20Syarie.",
  email: "nuaimrazak.bangi@gmail.com",
  emailHref: "mailto:nuaimrazak.bangi@gmail.com",
  address: "11-2, Jln Puteri 3A/1, Bandar Puteri Bangi, 43000 Kajang, Selangor",
  hours: "Isnin - Jumaat, 09:00 - 18:00",
  mapHref: "https://maps.google.com/?q=11-2%2C%20Jln%20Puteri%203A%2F1%2C%20Bandar%20Puteri%20Bangi%2C%2043000%20Kajang%2C%20Selangor"
};

export const navigation = [
  { label: "Home", href: "/" },
  { label: "Tentang Kami", href: "/tentang-kami" },
  { label: "Bidang Amalan", href: "/bidang-amalan" },
  { label: "Peguam", href: "/peguam" },
  { label: "Galeri", href: "/galeri" },
  { label: "Artikel", href: "/artikel" },
  { label: "Hubungi Kami", href: "/hubungi-kami" }
];

export const aboutParagraphs = [
  "Firma ini lahir dari aspirasi En. Muhammad Nuaim Bin Majemi dan En. Abdul Razak Bin Mohamad Rawi untuk menawarkan khidmat guaman syarie yang lebih komprehensif dan harmonis.",
  "Kami mempunyai pengalaman yang luas dalam mengendalikan kes-kes di Mahkamah Syariah sama ada di peringkat Mahkamah Rendah, Mahkamah Tinggi dan Mahkamah Rayuan.",
  "Kami komited untuk memberikan khidmat guaman Syarie kepada anda dalam memastikan hak anda dibela dengan sewajarnya."
];

export const trustBadges = [
  "Pengalaman di Mahkamah Syariah",
  "Khidmat Guaman Syarie",
  "Konsultasi & Temujanji",
  "Pendekatan Profesional dan Berhemah"
];

export const services = [
  {
    title: "Jenayah Syariah",
    slug: "jenayah-syariah",
    description: "Menawarkan perkhidmatan Guaman Syarie bagi membela pihak yang tertuduh.",
    details:
      "Bantuan guaman untuk kes jenayah Syariah, termasuk semakan pertuduhan, penyediaan representasi dan kehadiran di mahkamah mengikut prosedur yang berkaitan.",
    icon: ShieldCheck,
    labels: ["Kes jenayah Syariah", "Pembelaan tertuduh", "Nasihat awal"]
  },
  {
    title: "Mahkamah Keluarga",
    slug: "mahkamah-keluarga",
    description: "Permohonan pengesahan nasab anak, permohonan sabitan nusyuz dan sebagainya.",
    details:
      "Khidmat guaman bagi urusan kekeluargaan Islam yang memerlukan perintah atau pengesahan Mahkamah Syariah.",
    icon: Baby,
    labels: ["Pengesahan nasab", "Sabitan nusyuz", "Hadhanah / hak penjagaan anak"]
  },
  {
    title: "Undang-undang Perkahwinan",
    slug: "undang-undang-perkahwinan",
    description:
      "Permohonan wali hakim, permohonan nafkah isteri, tuntutan nafkah iddah dan sebagainya.",
    details:
      "Nasihat dan tindakan guaman untuk isu berkaitan perkahwinan, perceraian, rujuk dan tuntutan nafkah.",
    icon: HeartHandshake,
    labels: ["Perceraian", "Rujuk", "Nafkah isteri", "Nafkah anak", "Nafkah iddah", "Wali hakim"]
  },
  {
    title: "Pengantaraan Keluarga",
    slug: "pengantaraan-keluarga",
    description: "Menawarkan perkhidmatan pengantaraan keluarga bagi memudahkan proses rundingan.",
    details:
      "Pendekatan perbincangan berstruktur untuk membantu pihak-pihak mencari penyelesaian secara lebih tenang dan berhemah.",
    icon: Handshake,
    labels: ["Pengantaraan keluarga", "Rundingan", "Penyelesaian berhemah"]
  },
  {
    title: "Faraid",
    slug: "faraid",
    description: "Menawarkan perkhidmatan Guaman Syarie yang berkaitan pembahagian harta pusaka.",
    details:
      "Panduan undang-undang Syariah berkaitan pembahagian harta pusaka, tuntutan dan proses berkaitan faraid.",
    icon: Scale,
    labels: ["Harta pusaka", "Faraid", "Pembahagian harta"]
  },
  {
    title: "Hibah & Wasiat",
    slug: "hibah-wasiat",
    description: "Menawarkan perkhidmatan Guaman Syarie yang berkaitan pengurusan harta Islam.",
    details:
      "Khidmat nasihat dan dokumentasi berkaitan hibah, wasiat serta perancangan pengurusan harta Islam.",
    icon: ScrollText,
    labels: ["Hibah", "Wasiat", "Pengurusan harta Islam"]
  }
];

export const lawyers: Lawyer[] = [
  {
    name: "Muhammad Nuaim Bin Majemi",
    role: "Rakan Kongsi",
    image: "/images/nuaim-majemi.jpeg",
    email: "nbm.syariahlawyer@gmail.com",
    highlight: "Mula mendapat tauliah Peguam Syarie pada tahun 2012.",
    qualifications: [
      "Sarjana Muda Pengajian Islam (Syariah), UKM",
      "Diploma Amalan dan Perundangan Islam, UKM",
      "Mula mendapat tauliah Peguam Syarie pada tahun 2012",
      "Bekas EXCO Persatuan Peguam Syarie Malaysia (PGSM)"
    ],
    certificates: [
      {
        negeri: "Wilayah Persekutuan",
        title: "Perakuan Amalan Tahun 2025",
        href: "/certificates/nuaim-wilayah-persekutuan-2025.jpeg",
        type: "image"
      }
    ],
    practice:
      "Beramal sebagai Peguam Syarie di Wilayah Persekutuan, Selangor, Melaka, Negeri Sembilan, Johor, Kedah, Perak, Pulau Pinang, Pahang, Perlis dan Kelantan."
  },
  {
    name: "Dr. Yusri Bin Mohamad",
    role: "Rakan Kongsi",
    image: "/images/dr-yusri.png",
    highlight: "Berdaftar sebagai Peguam Syarie di Wilayah Persekutuan sejak tahun 2002.",
    qualifications: [
      "Mula berdaftar sebagai Peguam Syarie di Wilayah Persekutuan sejak tahun 2002",
      "Pengerusi Jawatankuasa Syariah Bank Muamalat Malaysia Berhad dan Syarikat Takaful FWD",
      "Pernah memimpin Yayasan Dakwah Islamiah Malaysia (YADIM)",
      "Mantan Ahli Majlis Agama Islam Wilayah Persekutuan (MAIWP)",
      "Mantan Ahli Lembaga Pengarah dan Jawatankuasa di bawah MAIWP",
      "Mantan Pensyarah Kanan Kuliyyah Undang-Undang Ahmad Ibrahim, IIUM"
    ],
    certificates: [],
    practice: "Berpengalaman dalam bidang guaman Syarie, institusi Syariah dan pentadbiran agama Islam."
  },
  {
    name: "Abdul Razak Bin Mohamad Rawi",
    role: "Rakan Kongsi",
    image: "/images/abdul-razak.jpeg",
    highlight: "Mula mendapat tauliah Peguam Syarie pada tahun 2014.",
    qualifications: [
      "Sarjana Muda Pengajian Islam (Syariah), UKM",
      "Diploma Latihan & Amalan Guaman Syarie, UiTM",
      "Mula mendapat tauliah Peguam Syarie pada tahun 2014",
      "Memiliki Sijil Mediator dari Accord Group, Australia"
    ],
    certificates: [],
    practice:
      "Beramal sebagai Peguam Syarie di Wilayah Persekutuan, Selangor, Perak, Melaka, Negeri Sembilan dan Kelantan."
  }
];

export const faqs = [
  {
    question: "Mengapa saya perlu mempercayai Firma Guaman anda?",
    answer:
      "Nuaim Razak & Partners mempunyai pengalaman yang luas dalam mengendalikan kes-kes di Mahkamah Syariah sama ada di peringkat Mahkamah Rendah, Mahkamah Tinggi dan Mahkamah Rayuan."
  },
  {
    question: "Apakah jenis-jenis kes yang diuruskan oleh Firma Nuaim Razak & Partners?",
    answer:
      "Kami menawarkan khidmat Guaman Syarie dalam bidang kekeluargaan Islam, perkahwinan, faraid, hibah, wasiat, pengantaraan keluarga dan jenayah Syariah."
  },
  {
    question: "Bilakah waktu operasi syarikat?",
    answer:
      "Kami beroperasi dari hari Isnin hingga Jumaat, dari jam 9 pagi hingga 6 petang, bergantung kepada jadual temujanji."
  },
  {
    question: "Adakah firma guaman anda mengenakan caj konsultasi?",
    answer:
      "Sila hubungi firma melalui WhatsApp atau telefon untuk mendapatkan maklumat terkini tentang kadar konsultasi dan kaedah pembayaran."
  }
];

export const blogPosts = [
  {
    title: "Kita Adalah Penyambung Warisan",
    category: "Malaysia",
    date: "28/11/2021",
    excerpt:
      "KITA ADALAH PENYAMBUNG WARISAN Nikmat Kemerdekaan Kemerdekaan sebuah negara adalah nikmat terbesar kurniaan Allah SWT...",
    image: "/images/blog-malaysia.png",
    href: "https://www.nuaimrazak.com/kita-adalah-penyambung-warisan/"
  },
  {
    title: "Cerai dan Rujuk Bukannya Perkara Main-Main",
    category: "Undang-Undang Keluarga",
    date: "28/11/2021",
    excerpt:
      "CERAI DAN RUJUK BUKANNYA PERKARA MAIN-MAIN. Dua tiga minggu ini saya sangat teruja apabila aktiviti hujung minggu...",
    image: "/images/blog-cerai-rujuk.png",
    href: "https://www.nuaimrazak.com/cerai-dan-rujuk-bukannya-perkara-main-main/"
  },
  {
    title: "Ancaman Pihak Ketiga Dalam Perkahwinan",
    category: "Undang-Undang Keluarga",
    date: "28/11/2021",
    excerpt:
      "ANCAMAN PIHAK KETIGA DALAM PERKAHWINAN. Kehidupan berumah tangga adalah suatu kehidupan yang sangat kompleks...",
    image: "/images/blog-pihak-ketiga.png",
    href: "https://www.nuaimrazak.com/ancaman-pihak-ketiga-dalam-perkahwinan/"
  },
  {
    title: "AHLUSSUNNAH WAL JAMA'AH: GOLONGAN YANG SELAMAT",
    category: "Islam",
    date: "28/11/2021",
    excerpt: "AHLUSSUNNAH WAL JAMA'AH: GOLONGAN YANG SELAMAT...",
    image: "/images/blog-ahlussunnah.jpg",
    href: "https://www.nuaimrazak.com/ahlussunnah-wal-jamaah-golongan-yang-selamat/"
  }
];

export const whyChooseUs = [
  {
    title: "Pengalaman Mahkamah Syariah",
    copy:
      "Berpengalaman mengendalikan kes di Mahkamah Rendah Syariah, Mahkamah Tinggi Syariah dan Mahkamah Rayuan Syariah.",
    icon: Landmark
  },
  {
    title: "Nasihat Yang Jelas",
    copy:
      "Kami membantu anda memahami proses undang-undang Syariah dengan penerangan yang mudah, teratur dan profesional.",
    icon: BookOpenText
  },
  {
    title: "Pendekatan Berhemah",
    copy: "Setiap kes dikendalikan secara teliti, sulit dan berhemah mengikut keperluan klien.",
    icon: BriefcaseBusiness
  },
  {
    title: "Fokus Membela Hak",
    copy:
      "Komitmen kami adalah untuk memastikan hak anda dibela dengan sewajarnya melalui saluran undang-undang Syariah.",
    icon: Scale
  }
];

export const caseTypes = [
  "Perceraian",
  "Rujuk",
  "Hadhanah / hak penjagaan anak",
  "Nafkah isteri",
  "Nafkah anak",
  "Nafkah iddah",
  "Wali hakim",
  "Sabitan nusyuz",
  "Pengesahan nasab",
  "Faraid / harta pusaka",
  "Hibah",
  "Wasiat",
  "Pengantaraan keluarga",
  "Kes jenayah Syariah",
  "Lain-lain"
];
