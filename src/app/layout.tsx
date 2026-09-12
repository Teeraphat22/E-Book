import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Demo E-book Store",
  description: "ร้านขาย E-book แบบสาธิต (Demo)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${inter.className} bg-gray-50 min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="py-6 text-center text-gray-500 text-sm border-t bg-white">
          <p>© {new Date().getFullYear()} Demo E-book Store - ระบบนี้เป็นเพียงระบบสาธิต</p>
        </footer>
      </body>
    </html>
  );
}
