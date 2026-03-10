import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";
import { AuditProvider } from "@/context/AuditContext";
import Image from "next/image";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  weight: ["400", "500", "600", "700", "800"],
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
    <html lang="fr" className={urbanist.variable}>
      <body className="antialiased min-h-screen text-slate-800 selection:bg-indigo-300/40">
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
          <div className="absolute top-24 -left-24 w-80 h-80 rounded-full bg-violet-300/25 blur-3xl" />
          <div className="absolute top-[35%] -right-20 w-72 h-72 rounded-full bg-rose-300/20 blur-3xl" />
          <div className="absolute bottom-16 left-1/3 w-64 h-64 rounded-full bg-indigo-300/20 blur-3xl" />
        </div>
        <div className="fixed inset-0 -z-[5] pointer-events-none flex items-center justify-center" aria-hidden>
          <Image
            src="/collab-logo-watermark.png"
            alt=""
            width={1100}
            height={720}
            className="w-[85vw] max-w-5xl h-auto opacity-[0.08] md:opacity-[0.1]"
            priority
          />
        </div>
        <AuditProvider>
          {children}
        </AuditProvider>
      </body>
    </html>
  );
}
