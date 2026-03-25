import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import CartButton from "@/components/CartButton";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Frame & Focus | Luxury Art Prints",
  description: "Frame & Focus Prints — High-end luxury e-commerce platform for fine art prints.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-white text-black min-h-screen selection:bg-black selection:text-white`}
      >
        <CartProvider>
          <CartButton />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
