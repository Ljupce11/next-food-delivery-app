import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import "./globals.css";
import { inter } from "../ui/fonts";
import { Providers } from "./providers";

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
        {/* The analytics script is served by Vercel (/_vercel/insights), so it
            only exists there; elsewhere (CI, `next start`) it would 404 */}
        {process.env.VERCEL && <Analytics />}
      </body>
    </html>
  );
}
