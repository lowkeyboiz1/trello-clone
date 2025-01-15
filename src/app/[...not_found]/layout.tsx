import { Metadata } from 'next'

import './style.css'

export const metadata: Metadata = {
  title: 'Not Found',
  description: 'Not Found',
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  )
}
