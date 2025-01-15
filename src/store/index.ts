import { MESSAGE_TYPES } from '@/constants'
import instance from '@/services/axiosConfig'
import { IBoard, ICard, IColumn, TListMessages, TMessage, TUserInfo } from '@/types'
import { generatePlaceholderCard, mapOrder } from '@/utils'
import { isEmpty } from 'lodash'
import { create } from 'zustand'

type TBoardState = {
  board?: IBoard
  allBoards?: IBoard[]
  boardsRecent?: IBoard[]
  boardsStar?: IBoard[]
  workspace?: IBoard[]
  storeWorkspace: (workspace: IBoard[]) => void
  storeBoard: (board: IBoard) => void
  storeBoardRecent: (board: IBoard[]) => void
  storeBoardStar: (board: IBoard[]) => void
  fetchBoardDetail: (boardId: string, email: string) => Promise<IBoard>
  createNewColumn: (board: IBoard, title: string) => Promise<void>
  createNewCard: (column: IColumn, board: IBoard, title: string) => Promise<void>
  moveColumn: (column: IColumn, board: IBoard, title: string) => Promise<void>
  starBoard: (boardId: string, isStared: boolean) => Promise<void>
  fetchAllBoards: () => Promise<void>
  storeAllBoards: (boards: IBoard[]) => void
  deleteBoard: (boardId: string) => Promise<void>
  deleteMemberBoard: (boardId: string, email: string) => Promise<void>
  updateRecentBoardAndStar: (board: IBoard) => Promise<void>
  filterBoard: (board: IBoard, columns: string[]) => void
}

export const useStoreBoard = create<TBoardState>((set, get) => ({
  storeBoard: (board) => {
    set({ board })
  },

  storeAllBoards: (allBoards: IBoard[]) => {
    set({ allBoards })
  },

  filterBoard: (board, columns) => {
    const cloneBoard = { ...board }

    const columnsOfBoard = cloneBoard?.columns?.map((column) => column)

    const titles = ['fmndskfmnkasfd', 'xzcxzcxz']
    const memberHasAssignGmails = ['z@gmail.com', 'xzcxzcxz']
    const filteredColumns = columnsOfBoard?.filter((column) => titles.includes(column.title))

    // const filteredColumns = filterData(board?.columns || [], columns, !board?.memberGmails ? [] : board?.memberGmails?.map((member) => member.email))
    // console.log({ filteredColumns })
    // set({ board: { ...board, columns: filteredColumns || [] } })
  },

  storeBoardRecent: (boardsRecent) => {
    set({ boardsRecent })
  },

  storeBoardStar: (boardsStar) => {
    set({ boardsStar })
  },

  updateRecentBoardAndStar: async (board) => {
    const { boardsRecent, boardsStar } = get()

    if (!board) return

    if (board.isStared) {
      // Remove from starred and add to recent
      const updatedBoardsStar = boardsStar?.filter((item) => item._id !== board._id) || []
      const updatedBoardsRecent = [...(boardsRecent || []), board]

      set({
        boardsStar: updatedBoardsStar,
        boardsRecent: updatedBoardsRecent.filter(
          (item, index, self) => self.findIndex((b) => b._id === item._id) === index // Ensure no duplicates
        )
      })
    } else {
      // Add to starred and remove from recent
      const updatedBoardsStar = [...(boardsStar || []), board]
      const updatedBoardsRecent = boardsRecent?.filter((item) => item._id !== board._id) || []

      set({
        boardsStar: updatedBoardsStar,
        boardsRecent: updatedBoardsRecent
      })
    }

    // Toggle board's `isStared` status
    board.isStared = !board.isStared
    await get().starBoard(board?._id, board?.isStared)
  },

  storeWorkspace: (workspace) => {
    set({ workspace })
  },

  fetchAllBoards: async () => {
    try {
      const data: any = await instance.get(`/v1/boards/get-all`)
      get().storeWorkspace(data?.workspace)
      get().storeBoardRecent(data?.boards?.filter((item: IBoard) => !item?.isStared))
      get().storeBoardStar(data?.boards?.filter((item: IBoard) => item?.isStared))
      get().storeAllBoards(data?.boards)

      return data
    } catch (error) {
      console.log(error)
    }
  },

  fetchBoardDetail: async (boardId, email) => {
    try {
      const data: any = await instance.get(`/v1/boards/${boardId}?email=${email}`)
      const cloneData = { ...data }

      cloneData.columns = mapOrder(cloneData?.columns, cloneData?.columnOrderIds, '_id')

      cloneData?.columns?.forEach((column: any) => {
        if (column.cards.length === 0) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
          column.cards = mapOrder(column?.cards, column?.cardOrderIds, '_id')
        }
      })

      set({ board: { ...cloneData } })
      return cloneData
    } catch (error) {
      window.location.href = '/board-not-found'
      console.log(error)
    }
  },

  deleteBoard: async (boardId) => {
    await instance.delete(`/v1/boards/${boardId}`)
  },

  createNewColumn: async (board, title) => {
    try {
      const payload = {
        boardId: board?._id,
        title: title.trim()
      }
      const column: any = await instance.post('/v1/columns', payload)
      const cloneColumn = { ...column }

      if (isEmpty(cloneColumn.cards)) {
        cloneColumn.cards = [generatePlaceholderCard(cloneColumn)]
        cloneColumn.cardOrderIds = [generatePlaceholderCard(cloneColumn)._id]
      }

      const newBoard = { ...board, columns: [...board?.columns, cloneColumn], columnOrderIds: [...board?.columnOrderIds, cloneColumn?._id] }
      set({ board: newBoard })
    } catch (error) {
      console.log(error)
    }
  },

  createNewCard: async (column, board, title) => {
    const clonedColumn = { ...column }
    const payload = {
      title: title.trim(),
      boardId: board?._id,
      columnId: column?._id
    }
    const card: any = await instance.post('/v1/cards', payload)

    clonedColumn.cards.push(card)

    clonedColumn.cardOrderIds.push(card?._id)
    const newBoard: any = { ...board, columns: board?.columns.map((col) => (col?._id === column?._id ? clonedColumn : col)) }
    newBoard.cards.push(card)
    set({ board: newBoard })
  },

  moveColumn: async (column, board, title) => {
    const payload = {
      title,
      boardId: board?._id,
      columnId: column?._id
    }
    const card: any = await instance.post('/v1/cards', payload)

    const clonedColumn = { ...column }
    clonedColumn.cards.push(card)
    clonedColumn.cardOrderIds.push(card?._id)

    const newBoard = { ...board, columns: board?.columns.map((col) => (col?._id === column?._id ? clonedColumn : col)) }

    set({ board: newBoard })
  },

  deleteMemberBoard: async (boardId, email) => {
    await instance.delete(`/v1/boards/${boardId}/members`, { data: { email } })
    const { board } = get()
    if (!board) return
    set({ board: { ...board, memberGmails: board.memberGmails?.filter((member) => member.email !== email) } })
  },
  starBoard: async (boardId, isStared) => {
    await instance.put('/v1/boards/' + boardId, { isStared })
  }
}))

type TUserState = {
  userInfo?: TUserInfo
  storeUser: (user: TUserInfo) => void
}

export const useStoreUser = create<TUserState>((set) => ({
  storeUser: (userInfo) => {
    set({ userInfo })
  }
}))

type TRoleOfBoard = {
  role?: string
  storeRoleOfBoard: (role: string) => void
}

export const useStoreRoleOfBoard = create<TRoleOfBoard>((set) => ({
  storeRoleOfBoard: (role) => {
    set({ role })
  }
}))

type TStatusOpenModal = {
  status?: boolean
  storeStatusOpenModal: (status: boolean) => void
}

export const useStoreStatusOpenModal = create<TStatusOpenModal>((set) => ({
  storeStatusOpenModal: (status) => {
    set({ status })
  }
}))

type TCardState = {
  currentCard?: ICard
  storeCurrentCard: (card: ICard) => void
}

export const useStoreCard = create<TCardState>((set) => ({
  storeCurrentCard: (currentCard) => {
    set({ currentCard })
  }
}))

type TListMessagesPins = {
  listMessagesPins: TListMessages[]
  storeListMessagesPins: (listMessagesPins: TListMessages[]) => void
  currentChat: TListMessages | null
  storeCurrentChat: (currentChat: TListMessages | null) => void
}

export const useStoreListMessagesPins = create<TListMessagesPins>((set) => ({
  listMessagesPins: [],
  currentChat: null,
  storeListMessagesPins: (listMessagesPins) => {
    set({ listMessagesPins })
  },
  storeCurrentChat: (currentChat) => {
    set({ currentChat })
  }
}))

type TConversation = {
  conversation: TMessage[]
  allConversation: TMessage[]
  storeConversation: (conversation: TMessage[]) => void
  storeAllConversationFromApi: (allConversation: TMessage[]) => void
}

export const useStoreConversation = create<TConversation>((set) => ({
  conversation: [],
  allConversation: [],

  storeConversation: (conversation) => {
    set({ conversation })
  },

  storeAllConversationFromApi: (allConversation) => {
    set({ allConversation })
  }
}))

type TListConversation = {
  listConversations: TMessage[]
  storeListConversations: (listConversation: TMessage[]) => void
}

export const useStoreListConversation = create<TListConversation>((set) => ({
  listConversations: [],
  storeListConversations: (listConversations) => {
    set({ listConversations })
  }
}))

type TCurrentConversation = {
  currentConversation: TMessage[] | null
  storeCurrentConversation: (currentConversation: TMessage[] | null) => void
}

export const useStoreCurrentConversation = create<TCurrentConversation>((set) => ({
  currentConversation: null,
  storeCurrentConversation: (currentConversation) => {
    set({ currentConversation })
  }
}))

type TListPinConversation = {
  listPinConversation: TMessage[]
  storeListPinConversation: (listPinConversation: TMessage[]) => void
}

export const useStoreListPinConversation = create<TListPinConversation>((set) => ({
  listPinConversation: [],
  storeListPinConversation: (listPinConversation) => {
    set({ listPinConversation })
  }
}))

type TTyping = {
  typing: boolean
  storeTyping: (typing: boolean) => void
}

export const useStoreTyping = create<TTyping>((set) => ({
  typing: false,
  storeTyping: (typing) => {
    set({ typing })
  }
}))

// 1) api => 1. storeListConversations   => done
// 2) click to 1 conversation =>  1. storeCurrentConversation, 2. storeListPinConversation => done
// 3) send message => 1. storeCurrentConversation 2. storeListConversations => done
// 4) click 1 Avatar pin => 1. storeCurrentConversation
// 5) delete 1 Avatar pin => 1. storeListPinConversation (if when opening the pin message => storeListPinConversation  => done
// 6) click to 1 icon chat with user => 1. storeCurrentConversation 2. storeListPinConversation
