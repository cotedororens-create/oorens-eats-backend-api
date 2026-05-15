import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { SITE_CONFIG } from "@/lib/config";
import { ThemeProvider } from "@/components/theme-provider";
import { FeexPayClientProvider } from "@/components/FeexPayClientProvider";
import { NextAuthProvider } from "@/components/NextAuthProvider";

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} — Carte & commande en ligne`,
  description: `${SITE_CONFIG.tagline}. ${SITE_CONFIG.hours}. Commandez via WhatsApp.`,
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="font-sans dark:bg-stone-950 dark:text-stone-100 transition-colors duration-300">
        <NextAuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <FeexPayClientProvider>
              <CartProvider>{children}</CartProvider>
            </FeexPayClientProvider>
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
