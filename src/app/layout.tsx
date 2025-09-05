import "./global.css";
import Navbar from "@/components/Navbar";
import { Providers } from "@/components/Providers";
import "react-loading-skeleton/dist/skeleton.css";
import { Toaster } from "@/components/ui/toaster";
import "simplebar-react/dist/simplebar.min.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { constructMetadata } from "@/lib/utils";
import JsonLd from "@/components/JsonLd";

export const metadata = constructMetadata({
  canonical: "https://whispherdocs.yuvrajsinh.dev",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="no-scrollbar">
      <head>
        <link rel="canonical" href="https://whispherdocs.yuvrajsinh.dev" />
        <JsonLd type="website" />
        <JsonLd type="organization" />
      </head>
      <link rel="icon" href="/favicon.ico" />
      <body className="font-poppins">
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="system">
            <Toaster />
            <Navbar />
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
