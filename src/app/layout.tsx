import "./globals.css";
import { NavSheet } from "@/components/ui/nav-sheet";
import { Header } from "../components/header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-dark-900">
        <Header />
        {children}
      </body>
    </html>
  );
}
