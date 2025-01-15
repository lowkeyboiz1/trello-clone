'use client'

import { Input } from '@nextui-org/react'
import React, { memo } from 'react'

type TModalBodyCreateNewBoard = {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  titleBoard: string
  handleConfirmCreateNewBoard: () => void
}

const ModalBodyCreateNewBoard = ({ handleChange, titleBoard, handleConfirmCreateNewBoard }: TModalBodyCreateNewBoard) => {
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col gap-2'>
        <label>
          Title <span className='text-red-700'>*</span>
        </label>
        <Input
          maxLength={30}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleConfirmCreateNewBoard()
            }
          }}
          value={titleBoard}
          placeholder={`Enter your board name`}
          onChange={handleChange}
          isRequired
          type='text'
        />
      </div>
    </div>
  )
}

export default ModalBodyCreateNewBoard
