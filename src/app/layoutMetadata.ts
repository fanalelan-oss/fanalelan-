import { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://fan-alelan.com';

export const metadataConfig: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "فن الإعلان للدعاية والإعلان | واجهات كلادينج ولوحات محلات بالرياض",
    template: "%s | فن الإعلان بالرياض"
  },
  description: "فن الإعلان: متخصصون في تنفيذ واجهات الكلادينج الفاخرة، الحروف البارزة المضيئة، استيكرات السيارات، وأعمال الحديد بالليزر في كافة أحياء ومناطق الرياض. جودة تنفيذ بضمان 15 سنة.",
  keywords: [
    'كلادينج الرياض', 'واجهات كلادينج', 'لوحات محلات الرياض', 'حروف بارزة مضيئة', 
    'تصميم لوحات إعلانية', 'استيكرات سيارات الرياض', 'تغليف سيارات شركات', 
    'أعمال حديد ليزر', 'شروط بلدية الرياض للوحات 2024', 'منصة بلدي لوحات',
    'الواح الخليج كلادينج', 'عرب بوند الرياض', 'مقاولات دعاية وإعلان',
    'حروف أكريليك', 'لوحات زنكور', 'مظلات وسواتر الرياض', 'قص ليزر حديد'
  ],
  authors: [{ name: "فن الإعلان للدعاية والإعلان" }],
  creator: "فن الإعلان",
  publisher: "فن الإعلان للمقاولات",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "فن الإعلان | واجهات كلادينج ولوحات إعلانية بالرياض",
    description: "نحول رؤيتك إلى واقع. تنفيذ واجهات كلادينج ولوحات حروف بارزة في كل مناطق الرياض.",
    url: BASE_URL,
    siteName: "فن الإعلان",
    images: [
      {
        url: `${BASE_URL}/android-chrome-512x512.png`,
        width: 512,
        height: 512,
        alt: "شعار فن الإعلان للدعاية والإعلان",
      },
    ],
    locale: "ar_SA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "فن الإعلان | واجهات كلادينج ولوحات إعلانية بالرياض",
    description: "متخصصون في تصميم وتنفيذ واجهات الكلادينج واللوحات الإعلانية بالرياض.",
    images: [`${BASE_URL}/android-chrome-512x512.png`],
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
  manifest: `${BASE_URL}/manifest.json`,
};
