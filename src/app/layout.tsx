import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SPYKI | Shubhanshu Bilgaiyan",
  description: "Personal portfolio of SPYKI - Game Developer, Video Editor, Gamer / Streamer, Web Developer, Thumbnail Designer, and Content Creator.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.className} bg-[#050505] text-slate-50 antialiased`}>{children}</body>
    </html>
  );
}
