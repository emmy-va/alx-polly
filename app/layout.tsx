import { AuthProvider } from "@/lib/AuthContext";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link"; // Import Link 
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
  title: "ALX Polly",
  description: "Polling app dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <AuthProvider>
          <header className="w-full px-6 py-3 border-b flex items-center justify-between bg-white">
            <span className="font-bold text-xl">ALX Polly</span>
            <nav className="flex gap-6">
              <Link href="/polls" className="hover:underline">My Polls</Link>
            </nav>
            <div className="flex items-center gap-2">
              {/* Use Link for the button */}
              <Link
                href="/create-poll"
                className="bg-blue-900 text-white px-3 py-1 rounded hover:bg-blue-800"
              >
                Create Poll
              </Link>
              <span className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center">U</span>
            </div>
          </header>
          <main className="max-w-6xl mx-auto p-6">
            {children}
          </main>
          <footer className="w-full text-center py-4 border-t text-xs text-muted-foreground bg-white">
            &copy; {new Date().getFullYear()} Polly. All rights reserved.
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
