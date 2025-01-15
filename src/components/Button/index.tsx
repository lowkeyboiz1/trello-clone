'use client'

import { Button, ButtonProps } from '@nextui-org/react'
import CloseIcon from '@mui/icons-material/Close'
import { twMerge } from 'tailwind-merge'
import { ArrowDown2 } from 'iconsax-react'

type TAddButton = { children: string; className?: string } & ButtonProps
export const AddButton = ({ children, className, ...props }: TAddButton) => {
  return (
    <Button {...props} className={twMerge('bg-green-400 px-4 py-2 text-white', className)}>
      {children}
    </Button>
  )
}

export const CloseButton = ({ ...props }: ButtonProps) => {
  return (
    <Button {...props} isIconOnly radius='full' className='bg-transparent p-2 text-red-500'>
      <CloseIcon />
    </Button>
  )
}
