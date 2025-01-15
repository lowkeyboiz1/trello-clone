'use client'

import { NoItemOverView, OverViewItem } from '@/components/OverViewItem'
import PopoverCustom from '@/components/PopoverCustom'
import { useStoreBoard } from '@/store'
import { Button } from '@nextui-org/react'
import { ArrowDown2 } from 'iconsax-react'
import { useState } from 'react'

const Workspaces = () => {
  const { workspace } = useStoreBoard()
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const noData = workspace?.length === 0
  return (
    <PopoverCustom
      isOpen={isOpen}
      noData={noData}
      onOpenChange={setIsOpen}
      placement='bottom-start'
      popoverTrigger={
        <Button onClick={() => setIsOpen(true)} endContent={<ArrowDown2 size={16} />} variant='light' className='flex !min-h-10 flex-shrink-0 bg-transparent text-white hover:bg-white/10'>
          Workspaces
        </Button>
      }
    >
      <div className='flex max-h-[300px] w-[300px] flex-col items-center gap-2 overflow-y-auto overflow-x-hidden py-2'>
        {workspace?.length === 0 ? (
          <NoItemOverView title='No workspaces' description='Your workspaces will appear here' />
        ) : (
          workspace?.map((item, index) => (
            <OverViewItem onClick={() => setIsOpen(false)} href={`/board/${item?._id}`} key={index} hiddenStar item={item}>
              {item?.title}
            </OverViewItem>
          ))
        )}
      </div>
    </PopoverCustom>
  )
}

export default Workspaces
