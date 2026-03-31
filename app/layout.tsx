import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Film Space — 个人影视手帐",
  description: "私密、高质感的个人观影记录工具",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full bg-white text-gray-900">
        <Header />
        {children}
      </body>
    </html>
  );
}
