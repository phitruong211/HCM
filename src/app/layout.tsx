import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hành Trình Tư Tưởng Hồ Chí Minh — Bản đồ lịch sử tương tác",
  description:
    "Khám phá hành trình hình thành và phát triển tư tưởng Hồ Chí Minh qua bản đồ tương tác Mapbox GL JS. 5 giai đoạn, 24+ sự kiện lịch sử quan trọng từ 1890 đến 1969.",
  keywords: [
    "Hồ Chí Minh",
    "tư tưởng Hồ Chí Minh",
    "lịch sử Việt Nam",
    "bản đồ lịch sử",
    "interactive map",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
