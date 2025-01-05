import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { inter } from "./ui/fonts";

export const metadata: Metadata = {
  title: "Food Delivery App",
  description: "Food Delivery App created wih Next.js",
};

// export const experimental_ppr = true;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
