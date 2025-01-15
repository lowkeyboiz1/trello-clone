'use client'

import { NoItemOverView, OverViewItem } from '@/components/OverViewItem'
import PopoverCustom from '@/components/PopoverCustom'
import { useStoreBoard } from '@/store'
import { IBoard } from '@/types'
import { Button } from '@nextui-org/react'
import { ArrowDown2 } from 'iconsax-react'
import { useState } from 'react'

const Starred = () => {
  const { boardsStar } = useStoreBoard()
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const noData = boardsStar?.length === 0
  return (
    <PopoverCustom
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      noData={noData}
      placement='bottom-start'
      popoverTrigger={
        <Button onClick={() => setIsOpen(true)} endContent={<ArrowDown2 size={16} />} variant='light' className='flex !min-h-10 flex-shrink-0 bg-transparent text-white hover:bg-white/10'>
          Starred
        </Button>
      }
    >
      <div className='flex max-h-[300px] min-w-[300px] max-w-[300px] flex-col items-center gap-2 overflow-y-auto overflow-x-hidden py-2'>
        {noData ? (
          <NoItemOverView title='No starred boards' description='Your starred boards will appear here' />
        ) : (
          boardsStar?.map((item: IBoard, index: number) => (
            <OverViewItem href={`/board/${item?._id}`} key={index} isStared={item?.isStared} item={item} onClick={() => setIsOpen(false)}>
              {item?.title}
            </OverViewItem>
          ))
        )}
      </div>
    </PopoverCustom>
  )
}

export default Starred
