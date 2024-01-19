import type { Metadata } from 'next'
import { poppins } from '@/components/ui/font'
import './global.css'
import Navbar from '@/components/Navbar'
import { Providers } from '@/components/Providers'
import 'react-loading-skeleton/dist/skeleton.css'

export const metadata: Metadata = {
  title: 'WhisperDocs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Providers>
        <body className={poppins.className}>
          <Navbar />
          {children}
        </body>
      </Providers>
    </html>
  )
}
