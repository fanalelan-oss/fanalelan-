import type { Metadata } from "next";
import { Noto_Kufi_Arabic } from "next/font/google";
import Script from 'next/script';
import dynamic from 'next/dynamic';
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTopButton from "@/components/BackToTopButton";

const NewChatbot = dynamic(() => import('@/components/NewChatbot'), { ssr: false });

const notoKufiArabic = Noto_Kufi_Arabic({ 
  subsets: ["arabic"],
  weight: ['400', '700', '900'] 
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://fan-alelan.com';

// الـ Metadata الأصلية - ستعيد الأيقونة فوراً
export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "فن الإعلان للدعاية والإعلان | واجهات كلادينج ولوحات محلات بالرياض",
    template: "%s | فن الإعلان بالرياض"
  },
  description: "فن الإعلان: متخصصون في تنفيذ واجهات الكلادينج الفاخرة، الحروف البارزة المضيئة، استيكرات السيارات، وأعمال الحديد بالليزر في كافة أحياء ومناطق الرياض.",
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: `${BASE_URL}/manifest.json`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* كود أدسنس - سيعمل في كل الموقع لضمان قبول المراجعة */}
        <Script
          id="adsbygoogle-init"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1856280071157486"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* علامة جوجل الجديدة G-3XLS7S2Y2Y */}
        <Script 
          async 
          src="https://www.googletagmanager.com/gtag/js?id=G-3XLS7S2Y2Y" 
          strategy="afterInteractive"
        />
        <Script id="google-tag-new">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-3XLS7S2Y2Y');
          `}
        </Script>
      </head>
      <body className={`${notoKufiArabic.className} bg-gray-900 overflow-x-hidden`} suppressHydrationWarning={true}>
        {/* الأكواد القديمة */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-5VHBDX5V7W"></Script>
        <Script id="google-analytics-ads">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-5VHBDX5V7W');
            gtag('config', 'AW-17953122842');
            gtag('config', 'AW-17979231936');
          `}
        </Script>
        <Header /> 
        <div className="relative">
          {children}
        </div>
        <Footer />
        <NewChatbot />
        <BackToTopButton />
      </body>
    </html>
  );
}
