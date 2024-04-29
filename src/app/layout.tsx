import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "GetFeedback",
    description: "App to get anonymous feedback",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <AuthProvider>
                <body className={inter.className}>
                    <Navbar />
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="light"
                    >
                        {children}
                        <Toaster />
                    </ThemeProvider>
                </body>
            </AuthProvider>
        </html>
    );
}
