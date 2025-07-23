import { Toaster } from "react-hot-toast";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

import "./globals.css";

import Navbar from "@/components/shared/Navbar";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "RSWM",
    manifest: "/manifest.json",
    icons: { apple: "/wastelogo.png" },
    description: "RSWM - Simplifying your Waste Management",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
            </head>
            <body className={`${inter.className} bg-white text-black min-h-screen min-w-full w-full h-full`}>
                <Toaster position="top-left" />
                <NextTopLoader color="#008000" initialPosition={0.08} crawlSpeed={200} height={3} crawl={true} easing="ease" speed={200} zIndex={1600} showAtBottom={false} />
                <Navbar />
                {children}
            </body>
        </html>
    );
}
