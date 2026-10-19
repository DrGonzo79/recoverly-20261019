import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Recoverly — turn invoice leaks into supplier credits",
  description: "A fictional-data prototype for restaurant supplier recovery audits."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
