import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Calculator",
  description: "AI tutor chatbot",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        {children}
      </body>
    </html>
  );
}
