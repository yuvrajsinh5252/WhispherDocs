import type { Metadata } from 'next'
import './global.css'
import Navbar from '@/components/Navbar'
import { Providers } from '@/components/Providers'
import 'react-loading-skeleton/dist/skeleton.css'
import { Toaster } from '@/components/ui/toaster'
import "simplebar-react/dist/simplebar.min.css";
import { ThemeProvider } from '@/components/theme/theme-provider'
import { constructMetadata } from '@/lib/utils'

export const metadata = constructMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className='no-scrollbar'>
      <Providers>
        <body className="font-poppins">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
          >
            <Toaster />
            <Navbar />
            {children}
          </ThemeProvider>
        </body>
      </Providers>
    </html>
  )
}
