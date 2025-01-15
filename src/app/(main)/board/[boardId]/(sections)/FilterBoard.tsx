'use client'
import PopoverCustom from '@/components/PopoverCustom'
import { useStoreBoard } from '@/store'
import { Button, Checkbox } from '@nextui-org/react'
import { Filter } from 'iconsax-react'
import { useState } from 'react'

const FilterBoard = () => {
  const { board, storeBoard, filterBoard } = useStoreBoard()
  const titlesOfClumns = board?.columns?.map((column) => column.title)
  const [selectedColumns, setSelectedColumns] = useState<string[]>(titlesOfClumns || [])
  const memberOfBoard = board?.memberGmails

  const handleColumnSelect = (columnTitle: string) => {
    setSelectedColumns((prev) => {
      if (prev.includes(columnTitle)) {
        return prev.filter((col) => col !== columnTitle)
      } else {
        return [...prev, columnTitle]
      }
    })
    filterBoard(board!, selectedColumns)
  }

  const handleApplyFilter = () => {
    const filteredColumns = board?.columns?.filter((column) => selectedColumns.length === 0 || selectedColumns.includes(column.title))
    storeBoard({ ...board!, columns: filteredColumns || [] })
  }

  const handleClearFilter = () => {
    setSelectedColumns([])
    storeBoard({ ...board!, columns: board?.columns || [] })
  }

  return (
    <PopoverCustom
      popoverTrigger={
        <Button
          startContent={<Filter />}
          isIconOnly
          variant='light'
          className='flex !min-h-10 w-fit flex-shrink-0 gap-4 rounded-lg px-4 text-white hover:bg-white/10'
        >
          Filter boards
        </Button>
      }
    >
      <div className='flex min-w-[280px] flex-col gap-4 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-800 p-6 text-white shadow-xl'>
        <div className='flex items-center gap-2'>
          <Filter className='h-4 w-4' />
          <span className='text-sm font-semibold tracking-wide'>Filter by Column</span>
        </div>
        <div className='flex flex-col gap-3'>
          {board?.columns?.map((column) => (
            <Checkbox
              key={column.title}
              isSelected={selectedColumns.includes(column.title)}
              onValueChange={() => handleColumnSelect(column.title)}
              classNames={{
                label: 'text-sm font-medium text-white/90',
                wrapper: 'before:border-white/30'
              }}
            >
              {column.title}
            </Checkbox>
          ))}
        </div>
        <div className='mt-2 flex gap-3'>
          <Button size='sm' className='flex-1 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20' onClick={handleClearFilter}>
            Clear
          </Button>
          <Button size='sm' className='flex-1 bg-white font-medium text-blue-600 shadow-lg transition-transform hover:scale-[1.02]' onClick={handleApplyFilter}>
            Apply
          </Button>
        </div>
      </div>
    </PopoverCustom>
  )
}

export default FilterBoard
