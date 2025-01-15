import { BOARD_MEMBER_ROLE, BOARD_TYPE, MEMBER_STATUS, MESSAGE_TYPES, NOTIFICATION_STATUS, NOTIFICATION_TYPES } from '@/constants'

export type ICard = {
  _id: string
  boardId: string
  columnId: string
  title: string
  description: string | null
  cover: string | null
  memberIds: string[]
  comments: string[]
  assignMembers?: IMember[]
  attachments: string[]
  FE_PlaceholderCard?: boolean
}

export type IColumn = {
  _id: string
  boardId: string
  title: string
  cardOrderIds: string[]
  cards: ICard[]
}

export type IBoard = {
  _id: string
  title: string
  description: string
  type: (typeof BOARD_TYPE)[keyof typeof BOARD_TYPE]
  ownerId: string
  memberIds: string[]
  columnOrderIds: string[]
  columns: IColumn[]
  updateAt: Date | null
  _destroy: boolean
  slug: string
  createAt: Date
  memberGmails: IMember[]
  isStared: boolean
}

export type IMember = {
  _id?: string
  picture?: string
  name?: string
  email: string
  status?: (typeof MEMBER_STATUS)[keyof typeof MEMBER_STATUS]
  role?: (typeof BOARD_MEMBER_ROLE)[keyof typeof BOARD_MEMBER_ROLE]
}

export type TUserInfo = {
  id: string
  email: string
  verified_email: boolean
  name: string
  given_name: string
  family_name: string
  picture: string
  locale: string
}

type Invitation = {
  boardId: string
  boardTitle: string
  status: 'pending' | 'accepted' | 'declined'
}

export type TNotifications = {
  _id: string
  ownerId: string
  authorId: string
  actionId: string
  createdAt: string
  status: (typeof NOTIFICATION_STATUS)[keyof typeof NOTIFICATION_STATUS]
  type: 'invite'
  title: string
  invitation?: Invitation
}

export type TBoards = {
  _id: string
  title: string
  description: string
  isStared: boolean
}
export type TGroupMessage = {
  userId: string
  messages: (TMessage & { first?: boolean; last?: boolean })[]
}

export type TMessage = {
  message: string
  email: string
  type: keyof typeof MESSAGE_TYPES
  attachment?: File
  createdAt: number
}

export type TListMessages = {
  avatar: string
  name: string
  conversationId: string
  email: string
  id: string
}
