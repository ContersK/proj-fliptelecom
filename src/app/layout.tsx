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
    <html lang="pt-BR">
      <body className={inter.className}>
        <Provider>
          <header />
          {children}
          <footer />
        </Provider>
      </body>
    </html>
  );
}
