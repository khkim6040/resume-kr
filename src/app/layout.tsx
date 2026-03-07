import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const pretendard = localFont({
  src: [
    { path: "../../public/fonts/Pretendard-Regular.ttf", weight: "400" },
    { path: "../../public/fonts/Pretendard-Medium.ttf", weight: "500" },
    { path: "../../public/fonts/Pretendard-SemiBold.ttf", weight: "600" },
    { path: "../../public/fonts/Pretendard-Bold.ttf", weight: "700" },
  ],
  variable: "--font-pretendard",
  display: "swap",
});

export const metadata: Metadata = {
  title: "이력서 빌더",
  description: "한국어에 최적화된 이력서 빌더",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${pretendard.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
