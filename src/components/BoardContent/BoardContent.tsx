'use client'

import {
  DndContext,
  DragOverlay,
  DropAnimation,
  PointerSensor,
  closestCorners,
  defaultDropAnimationSideEffects,
  getFirstCollision,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { memo, useCallback, useEffect, useRef, useState } from 'react'

import { generatePlaceholderCard } from '@/utils'

import { CardContent } from '@/components/BoardContent'

import { Column, ListColumn } from '@/components/BoardContent'
import { IBoard, ICard, IColumn } from '@/types'
import { ITEM_TYPE } from '@/constants'
import instance from '@/services/axiosConfig'
import { useStoreBoard } from '@/store'

function BoardContent() {
  const { board, storeBoard } = useStoreBoard()
  const [orderedColumns, setOrderedColumns] = useState<any[]>([])
  const [activeDragItemId, setActiveDragItemId] = useState<null | string>(null)
  const [activeItemDragStart, setActiveItemDragStart] = useState<any>({})
  const [activeItemType, setActiveItemType] = useState<(typeof ITEM_TYPE)[keyof typeof ITEM_TYPE] | null>(null)
  const [activeDragItemData, setActiveDragItemData] = useState<any>(null)
  const [oldCloumnWhenDraggingCard, setOldCloumnWhenDraggingCard] = useState<any>(null)

  const lastOverId = useRef<any>(null)

  const mouseSensor = useSensor(PointerSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 10
    }
  })

  const touchSensor = useSensor(PointerSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 500
    }
  })

  //conver sensors before passing to DndContext
  const sensors = useSensors(mouseSensor, touchSensor)

  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5'
        }
      }
    })
  }

  const collisionDetectionStrategy = useCallback(
    (args: any) => {
      if (activeItemType === ITEM_TYPE.COLUMN) {
        const pointerCollisions = pointerWithin(args)

        // Collision detection algorithms return an array of collisions
        if (pointerCollisions.length > 0) {
          return pointerCollisions
        }

        // If there are no collisions with the pointer, return rectangle intersections
        return rectIntersection(args)
      }

      const pointerIntersections = pointerWithin(args)

      if (!pointerIntersections?.length) return

      let overId = getFirstCollision(pointerIntersections, 'id')

      if (overId) {
        const checkColumn = orderedColumns.find((column) => column._id == overId)

        if (checkColumn) {
          overId = closestCorners({
            ...args,
            droppableContainers: args?.droppableContainers.filter((container: any) => {
              return container.id !== overId && checkColumn?.cardOrderIds?.includes(container.id)
            })
          })?.[0]?.id
        }

        lastOverId.current = overId
        return [{ id: overId }]
      }

      return lastOverId.current ? [{ id: lastOverId.current }] : []
    },
    [activeItemType, orderedColumns]
  )

  const _handleFindColumnByCardId = (id: string | number) => {
    return orderedColumns?.find((column) => column?.cards?.map((card: ICard) => card._id)?.includes(id))
  }

  const moveCardBetweenDifferenctColumns = (
    overCardId: string,
    overColumn: IColumn,
    active: any,
    over: any,
    activeColumn: IColumn,
    activeDraggingCardId: string,
    activeDraggingCardData: ICard,
    triggerForm: '_handleDragEnd' | '_handleDragOver'
  ) => {
    setOrderedColumns((prevColumns) => {
      let newCardIndex: number

      //find index active over card
      const overCardIndex = overColumn?.cards?.findIndex((card: ICard) => card._id === overCardId)

      const isBelowOverItem = active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0
      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

      //clone orderedcolumn
      const nextColumns = JSON.parse(JSON.stringify(prevColumns))

      const nextActiveColumn = nextColumns.find((column: IColumn) => column?._id === activeColumn._id)
      const nextOverColumn = nextColumns.find((column: IColumn) => column?._id === overColumn._id)

      //nextActiveColumn is old Column
      if (nextActiveColumn) {
        //delete card active
        nextActiveColumn.cards = nextActiveColumn.cards.filter((card: ICard) => card._id !== activeDraggingCardId)

        // add FE_PlaceholderCard if column is empty
        if (!nextActiveColumn?.cards?.length) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }

        //arrange cardOrderIds of Column
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map((card: ICard) => card._id)
      }

      //nextOverColumn is new Column
      if (nextOverColumn) {
        //check exits overcolumn, and delete
        nextOverColumn.cards = nextOverColumn.cards.filter((card: ICard) => card?._id !== activeDraggingCardId)
        //add cardover to overColumn follow new index (newCardIndex)

        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn?._id
        }

        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)

        // delete placeholder card if cards length > 1
        if (nextOverColumn.cards.length > 1) {
          nextOverColumn.cards = nextOverColumn.cards.filter((card: ICard) => !card?.FE_PlaceholderCard)
        }

        //update cardOrderIds
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map((card: ICard) => card._id)
      }

      if (triggerForm === '_handleDragEnd') {
        moveCardToDifferentColumn(activeDraggingCardId, oldCloumnWhenDraggingCard._id, nextOverColumn._id, nextColumns)
      }

      const cloneBoard = { ...board } as IBoard
      cloneBoard.columns = nextColumns
      storeBoard(cloneBoard)
      return [...nextColumns]
    })
  }

  const moveColumn = async (dndOrderedColumns: IColumn[], board: IBoard) => {
    const cloneBoard = { ...board }
    const dndOrderedColumnsIds = dndOrderedColumns.map((item) => item._id)
    cloneBoard.columnOrderIds = dndOrderedColumnsIds
    cloneBoard.columns = dndOrderedColumns

    try {
      await instance.put(`/v1/boards/${board?._id}`, {
        columns: dndOrderedColumns,
        columnOrderIds: dndOrderedColumnsIds
      })
    } catch (error) {
      console.log(error)
    }

    storeBoard(cloneBoard)
  }

  const moveCardInTheSameColumn = async (dndOrderedCards: ICard[], dndOrderedCardsIds: string[], columnId: string) => {
    const cloneBoard: any = { ...board }

    const columnToUpdate = cloneBoard.columns.find((column: IColumn) => column?._id === columnId)

    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardsIds
    }

    try {
      await instance.put(`/v1/columns/${columnId}`, {
        cardOrderIds: dndOrderedCardsIds
      })
      storeBoard(cloneBoard)
    } catch (error) {
      console.log(error)
    }
  }

  const moveCardToDifferentColumn = async (currentCardId: string, prevColumnId: string, nextColumnId: string, dndOrderedColumns: IColumn[]) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map((item) => item._id)
    const cloneBoard: any = { ...board }

    let prevCardOrderIds: any = dndOrderedColumns.find((c) => c._id === prevColumnId)?.cardOrderIds || []

    if (prevCardOrderIds[0]?.includes('placeholder-card')) prevCardOrderIds = []

    let nextCardOrderIds: any = dndOrderedColumns.find((c) => c._id === nextColumnId)?.cardOrderIds || []

    const payload = {
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find((c) => c._id === nextColumnId)?.cardOrderIds.filter((cardId) => !cardId.includes('placeholder-card'))
    }

    try {
      const data = await instance.put('/v1/boards/supports/moving_card', payload)
    } catch (error) {
      console.log(error)
    }
  }

  const _handleDragStart = (e: any) => {
    const { active } = e
    setActiveDragItemId(e?.active?.id)
    setActiveItemDragStart(active)
    setActiveItemType(!!active?.data?.current?.cards ? ITEM_TYPE.COLUMN : ITEM_TYPE.CARD)
    setActiveDragItemData(active?.data?.current)

    if (!active?.data?.current?.cardOrderIds) {
      setOldCloumnWhenDraggingCard(_handleFindColumnByCardId(e?.active?.id))
    }
  }

  const _handleDragOver = (e: any) => {
    if (activeItemType === ITEM_TYPE.COLUMN) return

    const { active, over } = e
    if (!active || !over) return

    //activeDraggingCardId is card dragging
    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData }
    } = active
    const { id: overCardId } = over

    const activeColumn = _handleFindColumnByCardId(active?.id)
    const overColumn = _handleFindColumnByCardId(over?.id)

    if (!activeColumn || !overColumn) return

    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferenctColumns(overCardId, overColumn, active, over, activeColumn, activeDraggingCardId, activeDraggingCardData, '_handleDragOver')
    }
  }

  const _handleDragEnd = (e: any) => {
    const { active, over } = e

    // check exits over
    if (!active || !over) return
    //drag and drop card action
    if (activeItemType === 'ACTIVE_ITEM_CARD') {
      //activeDraggingCardId is card dragging
      const {
        id: activeDraggingCardId,
        data: { current: activeDraggingCardData }
      } = active
      const { id: overCardId } = over

      const activeColumn = _handleFindColumnByCardId(active?.id)
      const overColumn = _handleFindColumnByCardId(over?.id)

      if (!activeColumn || !overColumn) return

      //drag and drop between 2 difference column
      if (oldCloumnWhenDraggingCard?._id !== overColumn?._id) {
        moveCardBetweenDifferenctColumns(overCardId, overColumn, active, over, activeColumn, activeDraggingCardId, activeDraggingCardData, '_handleDragEnd')
      } else {
        const oldCardIndex = oldCloumnWhenDraggingCard?.cards?.findIndex((card: ICard) => card._id === activeDragItemId)
        const newCardIndex = overColumn?.cards?.findIndex((card: ICard) => card._id === overCardId)
        const dndOrderedCards: any = arrayMove(oldCloumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)
        const dndOrderedCardsIds = dndOrderedCards.map((item: any) => item._id)

        moveCardInTheSameColumn(dndOrderedCards, dndOrderedCardsIds, oldCloumnWhenDraggingCard?._id)

        setOrderedColumns((prev) => {
          const nextColumns = JSON.parse(JSON.stringify(prev))

          const targetColumn = nextColumns.find((column: IColumn) => column._id === overColumn._id)
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCardsIds

          return nextColumns
        })
      }
    }

    //drag and drop column action
    if (activeItemType === ITEM_TYPE.COLUMN) {
      if (active.id !== over.id) {
        const oldColumnIndex = orderedColumns.findIndex((item) => item._id === active.id)
        const newColumnIndex = orderedColumns.findIndex((item) => item._id === over.id)

        const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)

        //array index after dragend
        moveColumn(dndOrderedColumns, board as any)
        //update state
        setOrderedColumns(dndOrderedColumns)
      }
    }

    //reset data
    setActiveItemDragStart(null)
    setActiveItemType(null)
    setActiveDragItemId(null)
    setOldCloumnWhenDraggingCard(null)
    setActiveDragItemData(null)
  }

  useEffect(() => {
    setOrderedColumns(board?.columns || [])
  }, [board])

  return (
    <div className='h-boardContent overflow-x-auto bg-colorBoardContent'>
      <DndContext
        collisionDetection={collisionDetectionStrategy as any}
        onDragStart={_handleDragStart}
        onDragEnd={_handleDragEnd}
        sensors={sensors}
        onDragOver={_handleDragOver}
      >
        <ListColumn columns={orderedColumns} />
        <DragOverlay dropAnimation={dropAnimation}>
          {activeItemDragStart?.id && activeItemType === ITEM_TYPE.COLUMN ? (
            <Column column={activeDragItemData} />
          ) : (
            <div className='rotate-2'>
              <CardContent card={activeDragItemData} />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

export default BoardContent
