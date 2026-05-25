import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Aviation Photography Portfolio",
    template: "%s | Aviation Photography Portfolio",
  },
  description:
    "A clean Austrian red and white photography portfolio with uploadable Cloudinary galleries.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
