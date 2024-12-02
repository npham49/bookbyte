import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/navbars/header";
import Providers from "@/components/providers";

export const metadata: Metadata = {
  title: "BookBytes",
  description:
    "BookBytes is a platform for sharing book summaries and short form contents.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      signUpForceRedirectUrl={"/onboarding"}
      signInForceRedirectUrl={"/dashboard"}
    >
      <html lang="en" suppressHydrationWarning>
        <body>
          <Providers>
            <Header />
            <main className="container max-w-screen-lg mx-auto">
              {children}
            </main>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
