import React, { useState } from 'react'

import { Button, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react'

type TExpandButton = {
  title?: string
  isIconOnly?: boolean
  startContent?: React.ReactNode
  children?: React.ReactNode
  content?: React.ReactNode
  endContent?: React.ReactNode
  style?: string
  variant?: 'solid' | 'faded' | 'bordered' | 'light' | 'flat' | 'ghost' | 'shadow'
  placement?: 'top' | 'bottom' | 'left' | 'right'
  classNames?: any
}

const ExpandButton: React.FC<TExpandButton> = ({ title, isIconOnly, children, placement, content, startContent, endContent, style, variant, classNames, ...props }) => {
  const [isPopoverOpen, setPopoverOpen] = useState(false)

  const handlePopoverToggle = () => {
    setPopoverOpen(!isPopoverOpen)
  }

  const defaultButtonProps = {
    disableAnimation: true,
    disableRipple: true,
    radius: isIconOnly ? ('full' as const) : ('none' as const),
    variant: variant ? variant : ('light' as const),
    endContent: endContent ? endContent : <></>,
    startContent: startContent ? startContent : <></>,
    onClick: handlePopoverToggle,
    isIconOnly,
    className: `flex items-center gap-2 font-medium text-primary px-4 min-h-10 ${isIconOnly ? 'overflow-visible' : 'rounded-[3px]'} ${style ? style : ''}`,
  }

  const buttonElement = React.cloneElement(<Button {...defaultButtonProps}>{isIconOnly ? children : title}</Button>, { ...props })

  return (
    <Popover placement={placement || 'bottom'} isOpen={isPopoverOpen} onClose={() => setPopoverOpen(false)} {...classNames}>
      <PopoverTrigger>{buttonElement}</PopoverTrigger>
      <PopoverContent>{content}</PopoverContent>
    </Popover>
  )
}

export default ExpandButton
