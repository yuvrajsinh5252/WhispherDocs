import type { Metadata } from 'next'
import { poppins } from '@/components/ui/font'
import './global.css'
import Navbar from '@/components/Navbar'
import { ClerkProvider } from '@clerk/nextjs'

export const metadata: Metadata = {
  title: 'WhisperDocs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={poppins.className}>
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
