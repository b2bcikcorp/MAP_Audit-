import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuditProvider } from "@/context/AuditContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MAPIG - Audit Notion",
  description: "Présentation interactive de l'audit Notion pour MAPIG",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0f0f0f] text-gray-200 min-h-screen selection:bg-indigo-500/30`}
      >
        <AuditProvider>
          {children}
        </AuditProvider>
      </body>
    </html>
  );
}
