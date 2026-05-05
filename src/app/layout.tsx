import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "혼밥서울 (ホンバプソウル)",
  description: "おひとりさま専用・ソウルグルメマップ",
  other: {
    referrer: "unsafe-url",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: 0,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${notoSansJP.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-gray-50 text-gray-900">
        <Script
          src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}&submodules=geocoder`}
          strategy="beforeInteractive"
        />
        {/* Mobile container wrapper */}
        <div className="w-full h-[100dvh] max-w-md mx-auto bg-white shadow-xl relative overflow-hidden flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
