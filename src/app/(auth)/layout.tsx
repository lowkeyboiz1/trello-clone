import { GoogleOAuthProvider } from '@react-oauth/google'
import type { Metadata } from 'next'

import { GoogleTagManager } from '@next/third-parties/google'
import './auth.css'
export const metadata: Metadata = {
  title: 'Login to NTTU Workspace',
  description: 'Login to NTTU Workspace'
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <GoogleTagManager gtmId='G-06FGH3XJJZ' />
      {/* <script src='https://alwingulla.com/88/tag.min.js' data-zone='65681' async data-cfasync='false'></script>
      <script async data-cfasync='false' src='thubanoa.com/1?z=7480785'></script>
      <meta name='google-adsense-account' content='ca-pub-8862200387332284' />
      <meta name='monetag' content='bf1b32bb19ba22d925d491d8d77913fa' /> */}
      <body>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}>{children}</GoogleOAuthProvider>
      </body>
    </html>
  )
}
