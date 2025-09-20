import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthSessionProvider } from "@/components/auth/session-provider";
import { CloudinaryProvider } from "@/components/cloudinary-provider";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Akamba Handicraft Industry Co-operative Society",
  description: "Authentic handcrafted African artifacts and sculptures from skilled Akamba artisans. Discover unique carvings, masks, and cultural treasures with worldwide shipping.",
  keywords: "Akamba handicrafts, African artifacts, handcrafted sculptures, traditional carvings, African art, cultural treasures, wooden sculptures, African masks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthSessionProvider>
          <CloudinaryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster position="top-right" />
            </ThemeProvider>
          </CloudinaryProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
