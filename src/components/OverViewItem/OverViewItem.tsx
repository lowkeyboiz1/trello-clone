import { Avatar, Button, cn } from '@nextui-org/react'
import { Star1 } from 'iconsax-react'
import React from 'react'
import WrapperItem from './WrapperItem'
import { IBoard } from '@/types'
import { useStoreBoard } from '@/store'
import { useRouter } from 'next/navigation'

type OverViewItemProps = {
  href: string
  children: React.ReactNode
  className?: string
  isStared?: boolean
  hiddenStar?: boolean
  item: IBoard
  onClick?: () => void
}

const OverViewItem = ({ href, children, className, isStared, hiddenStar, item, onClick }: OverViewItemProps) => {
  const { updateRecentBoardAndStar } = useStoreBoard()

  const handleToggleStar = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (hiddenStar) return
    e.preventDefault()
    e.stopPropagation() // Prevent the parent `onClick` from triggering
    updateRecentBoardAndStar(item)
  }

  return (
    <WrapperItem href={href} className={cn('group z-20 justify-between', className)} onClick={() => onClick?.()}>
      <div className='flex items-center gap-2'>
        <div className='size-10'>
          <Avatar alt='workspace' radius='sm' name={(children as string)?.charAt?.(0)} className='size-full object-cover text-lg' />
        </div>
        <p className='text-sm font-medium text-white'>{children}</p>
      </div>
      <Button
        onClick={handleToggleStar}
        isIconOnly
        className='z-50 !min-h-10 !min-w-10 flex-shrink-0 translate-x-10 bg-transparent p-1 text-white duration-150 hover:text-yellow-300 group-hover:flex group-hover:translate-x-0'
      >
        {!hiddenStar && <Star1 variant={isStared ? 'Bold' : 'Outline'} className={cn('z-50', isStared ? 'text-yellow-300' : '')} />}
      </Button>
    </WrapperItem>
  )
}

export default OverViewItem
