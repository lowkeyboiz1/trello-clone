import { DropdownItem, DropdownTrigger, Dropdown, Input, DropdownMenu, Button } from '@nextui-org/react'
import { MoreHoriz as MoreHorizIcon } from '@mui/icons-material'

import { useState, memo, useEffect } from 'react'

import { useDisclosure } from '@nextui-org/react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { IColumn } from '@/types'
import { useStoreBoard, useStoreStatusOpenModal } from '@/store'
import { Trash } from 'iconsax-react'
import instance from '@/services/axiosConfig'

import Toast from '@/components/Toast'
import { CreateCard, ListCard } from '@/components/BoardContent'
import Modal from '@/components/Modal'

const Column = ({ column }: { column: IColumn }) => {
  const [orderedCards, setOrderedCards] = useState<any[]>([])
  const [cardTitle, setCardTitle] = useState<string>('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [onFixTitleColumn, setOnFixTitleColumn] = useState<boolean>(false)
  const [valueTitleColumn, setValueTitleColumn] = useState<string>(column.title)
  const { storeBoard, board } = useStoreBoard()
  const { status } = useStoreStatusOpenModal()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const listExpandColumnButton = [{ title: 'Delete Column', icon: <Trash color='red' />, handleAction: () => onOpen() }]

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column._id,
    data: { ...column }
  })

  const dndKitColumnStyle = {
    transform: CSS.Translate.toString(transform),
    transition,
    height: '100%',
    opacity: isDragging ? 0.7 : 1
  }

  const handleDeleteColumn = async () => {
    try {
      const cloneBoard: any = { ...board }
      cloneBoard.columnOrderIds = cloneBoard.columnOrderIds?.filter((columnId: string) => columnId !== column._id)
      cloneBoard.columns = cloneBoard.columns?.filter((item: IColumn) => item._id !== column._id)
      cloneBoard.cards = []
      cloneBoard.cardOrderIds = []

      storeBoard(cloneBoard)

      const data: any = await instance.delete(`v1/columns/${column._id}`)

      Toast({ message: data.deleteDefault, type: 'success' })

      onOpenChange()
    } catch (error) {
      console.log(error)
    }
  }

  const handleRenameColumn = async () => {
    if (valueTitleColumn === column.title || !valueTitleColumn) return setOnFixTitleColumn(!onFixTitleColumn)

    if (valueTitleColumn?.length <= 3 || valueTitleColumn?.length > 50) {
      return setOnFixTitleColumn(!onFixTitleColumn)
    }

    try {
      const cloneBoard: any = { ...board }

      cloneBoard.columns = cloneBoard.columns?.map((item: IColumn) => {
        if (item._id === column._id) {
          return { ...item, title: valueTitleColumn }
        }
        return item
      })

      storeBoard(cloneBoard)

      await instance.put(`v1/columns/${column._id}`, { title: valueTitleColumn })

      Toast({ message: 'Rename column successfully', type: 'success' })
      setOnFixTitleColumn(!onFixTitleColumn)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    setOrderedCards(column?.cards)
  }, [column, board, status])

  return (
    <>
      <div
        ref={status ? undefined : setNodeRef}
        {...(status ? {} : listeners)}
        {...(status ? {} : attributes)}
        style={status ? undefined : dndKitColumnStyle}
        className='min-w-[300px] max-w-[300px]'
      >
        <div className={`h-[fit-content] w-full rounded-lg bg-[#f1f2f4]`}>
          <div className='flex items-center justify-between p-2'>
            {onFixTitleColumn ? (
              <Input
                onKeyUp={(e) => {
                  if (e.key === 'Enter') {
                    handleRenameColumn()
                  }
                }}
                variant='bordered'
                autoFocus
                onBlur={() => handleRenameColumn()}
                value={valueTitleColumn}
                onChange={(e) => {
                  setValueTitleColumn(e.target.value)
                }}
                className='w-full'
              />
            ) : (
              <h3 className='w-full select-none py-2 pl-3 font-semibold' onDoubleClick={() => setOnFixTitleColumn(!onFixTitleColumn)}>
                {column?.title}
              </h3>
            )}
            <Dropdown isOpen={isDropdownOpen} onClose={() => setIsDropdownOpen(false)}>
              <DropdownTrigger>
                <div onClick={() => setIsDropdownOpen(!isDropdownOpen)} className='rounded-full p-2 hover:bg-white/60'>
                  <MoreHorizIcon className='text-black' />
                </div>
              </DropdownTrigger>
              <DropdownMenu aria-label='Static Actions'>
                {listExpandColumnButton.map((item) => (
                  <DropdownItem key={item.title} startContent={item?.icon} onClick={() => item.handleAction()}>
                    {item?.title}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
          <ListCard cards={orderedCards} />
          <CreateCard value={cardTitle} setValue={setCardTitle} column={column} />
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        modalTitle='Delete Column'
        modalFooter={
          <div className='flex items-center gap-2'>
            <Button variant='light' color='danger' onClick={handleDeleteColumn} className='px-6 py-3'>
              Delete
            </Button>
            <Button onClick={onOpenChange} className='bg-colorBoardContent px-6 py-3 text-white'>
              Cancel
            </Button>
          </div>
        }
      >
        <p>Are you sure you want to delete this column?</p>
      </Modal>
    </>
  )
}

export default Column
