'use client'

import { Button, Input } from '@nextui-org/react'
import { ChangeEvent, useEffect, useState } from 'react'

import AddIcon from '@mui/icons-material/Add'
import { AddButton, CloseButton } from '../Button'
import Toast from '@/components/Toast'
import { useStoreBoard } from '@/store'
import { IBoard } from '@/types'

type TCreateColumn = { value: string; setValue: (value: string) => void }

const CreateColumn = ({ value, setValue }: TCreateColumn) => {
  const [isCreateNewColumn, setIsCreateNewColumn] = useState<boolean>(false)
  const [onSending, setOnSending] = useState<boolean>(false)

  const { createNewColumn } = useStoreBoard()
  const board = useStoreBoard((state) => state.board)

  const handleToggleCreateNewColumn = () => setIsCreateNewColumn(!isCreateNewColumn)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  const handleAddColumn: () => void = async () => {
    if (value === '') return Toast({ message: 'Enter column title', type: 'error' })
    setOnSending(true)
  }

  const handleSendingColumn = async () => {
    if (value.length <= 3 || value.length > 50) {
      Toast({ message: 'Column name must be at least 4 and max 50 characters', type: 'error' })
      setIsCreateNewColumn(false)
      setOnSending(false)
      return
    }

    try {
      await createNewColumn(board as IBoard, value)

      Toast({ message: 'Add Column Successful', type: 'success' })
    } catch (error) {
      console.log(error)
    } finally {
      setValue('')
      setIsCreateNewColumn(false)
      setOnSending(false)
    }
  }

  useEffect(() => {
    onSending && handleSendingColumn()
  }, [onSending])

  return (
    <div>
      {isCreateNewColumn ? (
        <div className='flex w-[300px] flex-col gap-2 rounded-lg bg-white/10 p-2'>
          <Input
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddColumn()
              }
            }}
            autoFocus
            value={value}
            onChange={handleInputChange}
            placeholder='Enter column title'
          />
          <div className='flex items-center gap-2'>
            <AddButton onClick={handleAddColumn}>Add column</AddButton>
            <CloseButton onClick={handleToggleCreateNewColumn} />
          </div>
        </div>
      ) : (
        <Button onPress={handleToggleCreateNewColumn} startContent={<AddIcon />} className='bg-white/10 px-5 py-3 text-white'>
          Add new column
        </Button>
      )}
    </div>
  )
}

export default CreateColumn
