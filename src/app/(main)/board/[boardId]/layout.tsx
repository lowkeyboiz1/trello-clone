import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Board details`,
    description: `Board details`
  }
}

export default function BoardDetailLayout({ children }: { children: React.ReactNode }) {
  return children
}
