'use client'

import React from 'react'
import { Drawer as VaulDrawer } from 'vaul'

type VaulDrawerProps = {
  isOpen: boolean
  onClose: () => void
  className?: string
  children: React.ReactNode
}

const Drawer = ({ isOpen, onClose, className, children, ...props }: VaulDrawerProps) => {
  return (
    <VaulDrawer.Root open={isOpen} onOpenChange={onClose} {...props}>
      <VaulDrawer.Portal>
        <VaulDrawer.Overlay className='fixed inset-0 bg-black/40' />
        <VaulDrawer.Content className={`h-fit fixed bottom-0 left-0 right-0 mt-24 flex flex-col rounded-t-[10px] bg-gray-100 outline-none ${className}`}>
          <div className='flex flex-col items-center justify-center gap-2'>
            <div className='h-10 w-12 rounded-full bg-red-300' />
            {children}
          </div>
        </VaulDrawer.Content>
      </VaulDrawer.Portal>
    </VaulDrawer.Root>
  )
}

export default Drawer
