import { cn } from '@nextui-org/react'
import Link from 'next/link'
import React from 'react'

const WrapperItem = ({ children, className, href, onClick }: { children: React.ReactNode; className?: string; href?: string; onClick?: () => void }) => {
  return (
    <div
      className={cn('relative flex w-full items-center gap-2 rounded-lg border border-white/20 bg-white/5 p-2 transition-colors hover:bg-white/10', className)}
      style={{ opacity: 1, willChange: 'opacity, transform', transform: 'none' }}
      onClick={() => onClick?.()}
    >
      {href && <Link href={href} className='absolute inset-0 z-10' />}
      {children}
    </div>
  )
}

export default WrapperItem
