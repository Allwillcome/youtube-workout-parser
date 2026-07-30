import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FitParser - YouTube Workout Video Parser",
  description: "Convert YouTube fitness videos into structured, verifiable, and shareable workout plans.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-100 antialiased`}>
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
