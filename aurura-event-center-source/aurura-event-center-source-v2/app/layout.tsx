import type { Metadata } from "next";
import { Playfair_Display, Jost } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/language-context";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileActionBar } from "@/components/MobileActionBar";
import { venue } from "@/lib/config";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: `${venue.name} | Premium Event Venue in Cedar Hollow, TX`,
  description:
    "A refined ballroom for weddings, quinceañeras, and unforgettable celebrations. Explore packages, build your event, and schedule a tour at Aurura Event Center.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${playfair.variable} ${jost.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-ivory text-charcoal">
        <LanguageProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <MobileActionBar />
        </LanguageProvider>
      </body>
    </html>
  );
}
