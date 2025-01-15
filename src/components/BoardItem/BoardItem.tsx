'use client'

import { useStoreBoard } from '@/store'
import { IBoard, TBoards } from '@/types'
import { Button, Listbox, ListboxItem, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react'
import { MoreCircle, Star1 } from 'iconsax-react'
import Link from 'next/link'
import { memo, useEffect, useState } from 'react'
import Modal from '../Modal'
import Toast from '../Toast'

type TBoardItem = {
  board: TBoards
  hiddenAction?: boolean
}
const BoardItem = ({ board, hiddenAction }: TBoardItem) => {
  const [onSending, setOnSending] = useState<boolean>(false)
  const [isOpenPopover, setIsOpenPopover] = useState<boolean>(false)
  const [isOpenModalDelete, setIsOpenModalDelete] = useState<boolean>(false)
  const [onDeleting, setOnDeleting] = useState<boolean>(false)
  const { deleteBoard, updateRecentBoardAndStar } = useStoreBoard()

  const _handleToggleStar = (e: any) => {
    if (hiddenAction) return
    e.preventDefault()
    setOnSending(true)
  }

  const handleToggleStartApi = async () => {
    try {
      // await starBoard(board?._id, !board?.isStared)
      await updateRecentBoardAndStar(board as IBoard)
    } catch (error) {
      console.log(error)
    } finally {
      setOnSending(false)
    }
  }

  const handleDeleteBoard = async () => {
    try {
      await deleteBoard(board?._id)
      //khang
      Toast({ message: 'Board deleted successfully', type: 'success' })
    } catch (error) {
      console.log(error)
    } finally {
      setOnDeleting(false)
      setIsOpenModalDelete(false)
    }
  }

  const handleOpenModalDelete = () => {
    setIsOpenPopover(false)
    setIsOpenModalDelete(true)
  }

  useEffect(() => {
    onSending && handleToggleStartApi()
  }, [onSending])

  useEffect(() => {
    onDeleting && handleDeleteBoard()
  }, [onDeleting])

  return (
    <div className='group relative flex h-[100px] min-w-[200px] flex-col justify-between overflow-hidden rounded-md border border-white/10 bg-white/5 p-2 backdrop-blur-sm hover:bg-white/10'>
      <Modal isOpen={isOpenModalDelete} onOpenChange={setIsOpenModalDelete} modalTitle={`Delete board #${board?.title}`}>
        <p>Are you sure you want to delete this board?</p>
        <div className='flex justify-between gap-2'>
          <Button isLoading={onDeleting} onPress={() => setOnDeleting(true)} variant='light' color='danger' className='w-full px-4 py-2'>
            Delete
          </Button>
          <Button onPress={() => setIsOpenModalDelete(false)} className='w-full px-4 py-2' variant='bordered'>
            Cancel
          </Button>
        </div>
      </Modal>
      <Link href={`/board/${board?._id}`} className='absolute inset-0 z-10' />
      <p className='line-clamp-1 max-w-[140px]'>{board?.title}</p>
      <p className='line-clamp-1 max-w-[140px]'>{board?.description}</p>
      {!hiddenAction && (
        <Popover
          classNames={{
            content: 'p-0.5'
          }}
          placement='right'
          className='z-20'
          isOpen={isOpenPopover}
          onOpenChange={setIsOpenPopover}
        >
          <PopoverTrigger>
            <Button
              disableRipple
              className='absolute right-0 top-2 translate-x-[100%] bg-transparent p-0 duration-200 group-hover:translate-x-[10px]'
              onClick={(e) => e.preventDefault()}
            >
              {/* dots icon */}
              <MoreCircle className='text-white' />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Listbox aria-label='Actions'>
              <ListboxItem key='delete' className='text-danger' color='danger' onClick={handleOpenModalDelete}>
                Delete board
              </ListboxItem>
            </Listbox>
          </PopoverContent>
        </Popover>
      )}
      {!hiddenAction && (
        <Button
          as={'button'}
          disableRipple
          isDisabled={onSending}
          onClick={_handleToggleStar}
          className='absolute bottom-2 right-0 z-[200] translate-x-[100%] bg-transparent p-0 duration-200 group-hover:translate-x-[10px]'
        >
          <Star1 variant={board?.isStared ? 'Bold' : 'Outline'} className={board?.isStared ? 'text-yellow-500' : 'text-white'} />
        </Button>
      )}
    </div>
  )
}

export default BoardItem
