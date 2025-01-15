'use client'
import PopoverCustom from '@/components/PopoverCustom'
import { BOARD_TYPE } from '@/constants'
import { useStoreBoard } from '@/store'
import { VpnLock as VpnLockIcon } from '@mui/icons-material'
import { Button } from '@nextui-org/react'
import { useState } from 'react'
import ItemTypeBoard from './ItemTypeBoard'

const SelectTypeOfWorkspace = () => {
  const { board } = useStoreBoard()

  const [typeBoard, setTypeBoard] = useState<string>(board?.type || BOARD_TYPE.PRIVATE)
  const listTypeBoard = [
    {
      type: BOARD_TYPE.PUBLIC,
      description: 'Anyone with the link can access'
    },
    {
      type: BOARD_TYPE.PRIVATE,
      description: 'All team members can access'
    }
  ]
  return (
    <PopoverCustom
      popoverTrigger={
        <Button
          startContent={<VpnLockIcon />}
          isIconOnly
          variant='light'
          className='flex !min-h-10 w-fit flex-shrink-0 gap-4 rounded-lg px-4 text-white hover:bg-white/10'
        >
          Workspace Visibility
        </Button>
      }
    >
      <div className='flex flex-col gap-2 bg-gradient-to-br from-blue-600 to-indigo-800 py-2 text-white'>
        <span className='text-sm'>Workspace Visibility</span>
        <span className='text-xs text-white/50'>Choose who can see your workspace</span>
        <div className='flex w-full flex-col gap-2'>
          {listTypeBoard.map((item) => (
            <ItemTypeBoard key={item.type} item={item} typeBoard={typeBoard} setTypeBoard={setTypeBoard} />
          ))}
        </div>
        <Button className='min-h-10 w-full text-blue-600' color='primary' variant='shadow'>
          Save
        </Button>
      </div>
    </PopoverCustom>
  )
}

export default SelectTypeOfWorkspace
