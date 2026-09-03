import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartContext";
import { InitialLoader } from "@/components/ui/InitialLoader";
import { PageProgress } from "@/components/ui/PageProgress";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "TERRANOVA AGRO-INDUSTRIE | Excellence Agro-Pastorale & Précision Industrielle",
  description: "Plateforme agro-industrielle de référence : céréales certifiées, bétail de race, produits laitiers de ferme, semences hybrides et équipements agricoles.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icon-192.png",
  },
  openGraph: {
    title: "TERRANOVA AGRO-INDUSTRIE | Excellence Agro-Pastorale",
    description: "Vente directe de produits agricoles, bétail d'élite, intrants et équipements avec paiement Orange Money / MTN MoMo et facturation instantanée.",
    url: "https://terranova.agri",
    siteName: "TERRANOVA AGRO-INDUSTRIE",
    locale: "fr_FR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#1E281F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="bg-sand-50 text-clay-900 font-sans antialiased selection:bg-terracotta-500 selection:text-white">
        <CartProvider>
          {/* Top page navigation loading bar */}
          <Suspense fallback={null}>
            <PageProgress />
          </Suspense>

          {/* Premium branded initial loading screen */}
          <InitialLoader brandName="TERRANOVA" tagline="Excellence Agro-Pastorale & Précision Industrielle" />

          {children}
        </CartProvider>

        {/* PWA Service Worker Registration Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('[PWA] ServiceWorker registered with scope: ', registration.scope);
                    },
                    function(err) {
                      console.log('[PWA] ServiceWorker registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
