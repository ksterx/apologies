import "./globals.css";
import type { Metadata } from "next";
import { M_PLUS_Rounded_1c } from "next/font/google";
import type { ReactNode } from "react";

const mPlusRounded = M_PLUS_Rounded_1c({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ごめんねジェネレーター",
  description: "タップすると土下座しながら謝ってくれるドット絵キャラのNext.jsデモ",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={mPlusRounded.className}>{children}</body>
    </html>
  );
}
