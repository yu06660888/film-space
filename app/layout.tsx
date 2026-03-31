import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "影像感官日记",
  description: "私密的个人观影感官记录",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="h-full bg-[#f5f5f7] text-[#1d1d1f] overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
