import type { Metadata } from 'next'
import './global.css'
import Navbar from '@/components/Navbar'
import { Providers } from '@/components/Providers'
import 'react-loading-skeleton/dist/skeleton.css'
import { Toaster } from '@/components/ui/toaster'
import "simplebar-react/dist/simplebar.min.css";

export const metadata: Metadata = {
  title: 'WhisperDocs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className='no-scrollbar'>
      <Providers>
        <body className="font-poppins">
          <Toaster />
          <Navbar />
          {children}
        </body>
      </Providers>
    </html>
  )
}
