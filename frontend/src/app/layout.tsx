import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="py-4 bg-blue-500">
          <nav>
            <ul className="flex space-x-4 justify-center">
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/register">Register</a>
              </li>
            </ul>
          </nav>
        </header>
        <main className="container mx-auto py-8">{children}</main>
        <footer className="py-4 bg-darkblue-100 text-center">
          <p>© 2023 MyApp. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
