
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
    <html lang="en">
      <head>
        <title>Counselor  | Psycortex</title>
        <meta
          name="description"
          content=""
        />
        <link rel="icon" href="https://psycortex.in/favicon.ico" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
