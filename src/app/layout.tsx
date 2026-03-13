import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "타로 길잡이 — 타로카드 학습 서비스",
  description: "타로를 처음 배우는 분들을 위한 교육 중심의 타로 학습 서비스. 78장 카드의 의미, 스프레드, 리딩 방법을 쉽고 체계적으로 배워보세요.",
  keywords: ["타로", "타로카드", "타로 배우기", "타로 입문", "타로 의미", "타로 학습"],
  openGraph: {
    title: "타로 길잡이 — 타로카드 학습 서비스",
    description: "타로를 처음 배우는 분들을 위한 교육 중심의 타로 학습 서비스. 78장 카드의 의미, 스프레드, 리딩 방법을 쉽고 체계적으로 배워보세요.",
    url: "https://tarot-guide.com", // Replace with real domain later
    siteName: "타로 길잡이",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "타로 길잡이 — 타로카드 학습 서비스",
    description: "타로를 처음 배우는 분들을 위한 교육 중심의 타로 학습 서비스.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className="antialiased min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-16 relative z-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
