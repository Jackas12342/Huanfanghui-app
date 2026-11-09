import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "换房 Match｜找到想要你这套房的人",
  description: "让房产置换从漫长等待，变成一次精准匹配。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
