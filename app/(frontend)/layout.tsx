import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeModeScript } from "flowbite-react";
import Header from "./components/Header";
import InitMiniapp from "./components/InitMiniapp";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { TelegramAuthProvider } from "./context/TelegramAuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meka Crochet - Telegram Mini App",
  description: "Handcrafted crochet items and accessories",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <ThemeModeScript />
        <InitMiniapp />
      </head>

      <body>
        <TelegramAuthProvider>
          <CartProvider>
            <FavoritesProvider>
              <Header />
              <div className="w-full flex justify-center">
                {children}
              </div>
            </FavoritesProvider>
          </CartProvider>
        </TelegramAuthProvider>
      </body>
    </html>
  );
}

