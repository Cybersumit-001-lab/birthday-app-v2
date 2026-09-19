import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans, DM_Serif_Display, Dancing_Script } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-cursive",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ITOrigin Birthday Hub | Employee Recognition & Milestones",
  description:
    "Official internal employee birthday celebration platform for ITOrigin. Register celebration dates, discover upcoming team milestones, and send warm wishes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${plusJakarta.variable} ${dmSerif.variable} ${dancingScript.variable}`}>
      <body className="min-h-screen bg-[#06080d] text-slate-100 antialiased selection:bg-red-600 selection:text-white flex flex-col">
        <AuthProvider>
          <Header />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
