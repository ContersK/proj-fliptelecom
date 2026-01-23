import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import { Provider } from "@/components/ui/provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flip Telecom - Comissões",
  description: "Sistema de comissões da Flip Telecom",
};
export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    // o suppressHydrationWarning é para evitar avisos de inconsistência entre server e client
    <html lang="pt-BR" suppressHydrationWarning={true}>
      <body className={inter.className} suppressHydrationWarning={true}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
