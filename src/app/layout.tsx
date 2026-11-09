import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Friendsgiving 2026 | Feast & Fellowship",
  description: "Join us for Friendsgiving 2026! RSVP, sign up for potluck dishes, and share any dietary restrictions or allergies.",
  openGraph: {
    title: "Friendsgiving 2026 Potluck & Celebration",
    description: "RSVP and coordinate dishes for Friendsgiving 2026. Good food, great friends, and grateful hearts!",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col selection:bg-autumn-200 selection:text-autumn-900">
        {children}
      </body>
    </html>
  );
}
