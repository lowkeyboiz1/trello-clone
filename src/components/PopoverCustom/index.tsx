import { Popover, PopoverContent, PopoverProps, PopoverTrigger } from '@nextui-org/react'
import React from 'react'

type TPopoverCustom = {
  noData?: boolean
  popoverTrigger: React.ReactNode
  children: React.ReactNode
} & Omit<PopoverProps, 'children'>

const PopoverCustom = ({ noData = false, popoverTrigger, children, ...props }: TPopoverCustom) => {
  return (
    <Popover
      {...props}
      classNames={{
        content: `${noData ? 'bg-white' : 'bg-gradient-to-br from-blue-600 to-indigo-800'}`,
      }}
    >
      <PopoverTrigger>{popoverTrigger}</PopoverTrigger>
      <PopoverContent>{children}</PopoverContent>
    </Popover>
  )
}

export default PopoverCustom
