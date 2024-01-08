import type { Metadata } from 'next'
import { poppins } from '@/components/ui/font'
import './global.css'
import Navbar from '@/components/Navbar'

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
      <body className={poppins.className}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
