"use client"
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import ProtectedRoute from "@/components/ProtectedRoute";
import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


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
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          {pathname !== "/login" && pathname !== "/apply" && <ProtectedRoute />}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
