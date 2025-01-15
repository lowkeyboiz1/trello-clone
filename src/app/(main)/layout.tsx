import Header from '@/(layout)/Header'
import PinMessage from '@/components/PinMessage'
import Providers from '@/components/Providers'
import { GoogleTagManager } from '@next/third-parties/google'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NTTU Workspace',
  description: 'NTTU Workspace'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <GoogleTagManager gtmId='G-06FGH3XJJZ' />
      <body>
        <Providers>
          <Header />
          <div className='relative'>
            {children}
            <PinMessage />
          </div>
        </Providers>
      </body>
    </html>
  )
}
