import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";

import { ThemeProvider } from "@/components/Providers/theme-provider";
import "./globals.css";
import { ApolloWrapper } from "@/components/Providers/ApolloWrapper";
import { NextAuthProvider } from "@/components/Providers/NextAuthProvider";
import { VantaProvider } from "@/components/Providers/VantaProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next.js GraphQL Demo",
  description: "Next.js app with GraphQL, Prisma and MongoDB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/vanta/dist/vanta.birds.min.js"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextAuthProvider>
          <ApolloWrapper>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <VantaProvider>
                <div className="h-screen overflow-y-auto overflow-x-hidden">
                  {children}
                </div>
              </VantaProvider>
            </ThemeProvider>
          </ApolloWrapper>
        </NextAuthProvider>
      </body>
    </html>
  );
}
