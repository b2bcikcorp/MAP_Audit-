import type { Metadata } from "next";
import { Urbanist, DM_Sans } from "next/font/google";
import "./globals.css";
import { AuditProvider } from "@/context/AuditContext";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
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
    <html lang="fr" className={`${urbanist.variable} ${dmSans.variable}`}>
      <body className="antialiased min-h-screen text-slate-800 selection:bg-indigo-200/40">
        <div className="fixed inset-0 -z-10 bg-white/35 pointer-events-none" aria-hidden />
        <AuditProvider>
          {children}
        </AuditProvider>
      </body>
    </html>
  );
}
