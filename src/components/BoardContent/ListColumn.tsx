import React, { useEffect, useState } from 'react'

import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'

import { ICard, IColumn } from '@/types'
import { Column } from '@/components/BoardContent'
import CreateColumn from '@/components/CreateColumn'

const ListColumn = ({ columns }: { columns: IColumn[] }) => {
  const [titleColumn, setTitleColumn] = useState<string>('')
  const columnsDndKit = columns?.map((item) => item._id)

  return (
    <SortableContext strategy={horizontalListSortingStrategy} items={columnsDndKit}>
      <div className='flex gap-4 p-2'>
        {columns?.map((column: IColumn) => <Column key={column._id} column={column} />)}
        <CreateColumn value={titleColumn} setValue={setTitleColumn} />
      </div>
    </SortableContext>
  )
}

export default ListColumn
