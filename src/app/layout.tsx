import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vaidya Sahay AI — Your Health Companion | MASQUERADE '26",
  description:
    "An intelligent, compassionate AI healthcare assistant built for the MASQUERADE '26 AI chatbot competition. Provides symptom triage, evidence-based guidance, and emergency care direction.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f8fafc] text-slate-800 antialiased selection:bg-emerald-100 selection:text-emerald-900">
        {children}
      </body>
    </html>
  );
}
