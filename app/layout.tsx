"use client"
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import ProtectedRoute from "@/components/ProtectedRoute";
import { usePathname } from "next/navigation";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    const pathname = usePathname();
  return (
    <html lang="en">
      <head>
        <title>Counselor | Psycortex</title>
        <meta name="description" content="" />
        <link rel="icon" href="https://psycortex.in/favicon.ico" />
      </head>
      <body>
        <AuthProvider>
          {pathname !== "/login" && <ProtectedRoute />}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
