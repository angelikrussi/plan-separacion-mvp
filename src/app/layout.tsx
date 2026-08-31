import type { Metadata } from "next";
import "./globals.css";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "LuckyHouse — Plan separe",
  description: "Aparta, abona y recibe tu producto.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-app">
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
