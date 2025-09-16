import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = Roboto_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "あんしんスコアライト",
  description: "原材料写真を撮るだけで、アレルギー対応が一瞬で分かる",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body className={`${inter.variable} ${mono.variable} bg-white text-gray-800`}>
        {children}
      </body>
    </html>
  );
}
