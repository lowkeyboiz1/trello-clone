'use client'

import PopoverCustom from '@/components/PopoverCustom'
import { NoItemOverView, OverViewItem, WrapperItem } from '@/components/OverViewItem'
import { Button } from '@nextui-org/react'
import { ArrowDown2 } from 'iconsax-react'
import { useStoreBoard } from '@/store'
import { IBoard } from '@/types'
import { useState } from 'react'
const Recent = () => {
  const { boardsRecent, storeBoardRecent } = useStoreBoard()
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const noData = boardsRecent?.length === 0

  const handleClickItemRecent = (item: IBoard) => {
    const newBoardsRecent = boardsRecent?.filter((board) => board?._id !== item?._id) || []
    storeBoardRecent([item, ...newBoardsRecent])
    setIsOpen(false)
  }

  return (
    <PopoverCustom
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      noData={noData}
      placement='bottom-start'
      popoverTrigger={
        <Button onClick={() => setIsOpen(true)} endContent={<ArrowDown2 size={16} />} variant='light' className='flex !min-h-10 flex-shrink-0 bg-transparent text-white hover:bg-white/10'>
          Recent
        </Button>
      }
    >
      <div className='flex max-h-[300px] w-[300px] flex-col items-center gap-2 overflow-y-auto overflow-x-hidden py-2'>
        {noData ? (
          <NoItemOverView title='No recent boards' description='Your recent boards will appear here' />
        ) : (
          boardsRecent?.map((item: IBoard, index: number) => (
            <OverViewItem onClick={() => handleClickItemRecent(item)} href={`/board/${item?._id}`} key={index} isStared={item?.isStared} item={item}>
              {item?.title}
            </OverViewItem>
          ))
        )}
      </div>
    </PopoverCustom>
  )
}

export default Recent
