"use client";

import { Noto_Kufi_Arabic } from "next/font/google";
import Script from 'next/script';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTopButton from "@/components/BackToTopButton";

const NewChatbot = dynamic(() => import('@/components/NewChatbot'), { ssr: false });

const notoKufiArabic = Noto_Kufi_Arabic({ 
  subsets: ["arabic"],
  weight: ['400', '700', '900'] 
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isBlogPage = pathname?.startsWith('/blog');

  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* إصلاح اختفاء الأيقونة */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* كود Google AdSense - يظهر فقط في المدونة */}
        {isBlogPage && (
          <Script
            id="adsense-id"
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1856280071157486"
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}

        {/* علامة جوجل الجديدة (G-3XLS7S2Y2Y) */}
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
        {/* أكواد التتبع السابقة (لضمان الاستمرارية) */}
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
