import { cn } from '@nextui-org/react'
import React from 'react'

const WrapperLayout = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={cn('flex h-boardContainer items-center justify-center bg-colorBoardContent', className)}>
      <div className='ct-container flex w-full justify-center py-10 text-white'>{children}</div>
    </div>
  )
}

export default WrapperLayout
