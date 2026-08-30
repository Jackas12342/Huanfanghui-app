import type { Metadata } from "next";
import { Instrument_Sans, Noto_Sans_SC } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans_SC({ variable: "--font-noto", subsets: ["latin"] });
const instrumentSans = Instrument_Sans({ variable: "--font-instrument", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "换房 Match｜找到想要你这套房的人",
  description: "让房产置换从漫长等待，变成一次精准匹配。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN" className={`${notoSans.variable} ${instrumentSans.variable}`}><body>{children}</body></html>;
}
