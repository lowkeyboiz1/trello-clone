'use client'

import { useStoreBoard } from '@/store'
import { IBoard, IColumn } from '@/types'
import { Add as AddIcon } from '@mui/icons-material'
import { Button, Input } from '@nextui-org/react'
import { ChangeEvent, useState } from 'react'
import { AddButton, CloseButton } from '../Button'
import Toast from '../Toast'

type TCreateCard = { column: IColumn; value: string; setValue: (value: string) => void }

const CreateCard = ({ column, value, setValue }: TCreateCard) => {
  const { createNewCard, board } = useStoreBoard()

  const [isCreateNewCard, setIsCreateNewCard] = useState<boolean>(false)
  const handleToggleCreateNewCard = () => setIsCreateNewCard(!isCreateNewCard)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  const handleAddCard: () => void = async () => {
    try {
      if (value?.length <= 3 || value?.length > 50) {
        Toast({ message: 'card name must be at least 4 and max 50 characters', type: 'error' })
        return setIsCreateNewCard(false)
      }
      if (value === '') {
        Toast({ message: 'Enter card title', type: 'error' })
      } else {
        await createNewCard(column, board as IBoard, value)
        setValue('')
        setIsCreateNewCard(false)
        Toast({ message: 'Add Card Successful', type: 'success' })
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div className='p-2'>
        {isCreateNewCard ? (
          <div className='flex items-center gap-2'>
            <Input
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddCard()
                }
              }}
              classNames={{
                inputWrapper: 'group-data-[focus=true]:border-[#00a8ff] data-[hover=true]:border-[#00a8ff] border-[#00a8ff]',
                input: 'placeholder:text-[#00a8ff] text-[#00a8ff]'
              }}
              variant='bordered'
              placeholder='Enter card title'
              value={value}
              onChange={handleInputChange}
            />
            <AddButton className='bg-[#00a8ff]' onPress={handleAddCard}>
              Add
            </AddButton>
            <CloseButton onPress={handleToggleCreateNewCard} />
          </div>
        ) : (
          <div className='flex items-center'>
            <Button
              onPress={handleToggleCreateNewCard}
              startContent={<AddIcon className='text-[#091E42]' />}
              className='w-full justify-start rounded-lg bg-transparent p-2 hover:bg-[#091E4224]'
            >
              Add a card
            </Button>
          </div>
        )}
      </div>
    </>
  )
}

export default CreateCard
