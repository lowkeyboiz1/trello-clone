import instance from '@/services/axiosConfig'
import { MoreHoriz } from '@mui/icons-material'
import { useStoreBoard, useStoreCard, useStoreStatusOpenModal, useStoreUser } from '@/store'
import { ICard, IColumn, IMember } from '@/types'
import { Avatar, Button, Input, Popover, PopoverContent, PopoverTrigger, Textarea, Tooltip } from '@nextui-org/react'
import 'highlight.js/styles/github.css' // Or any other Highlight.js theme
import { Add, Card as CardIcon, Edit, Edit2, MessageText, Send2, TextalignLeft, TickCircle, Trash } from 'iconsax-react'
import Link from 'next/link'
import { RefObject, useEffect, useRef, useState } from 'react'
import Markdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import Modal from '@/components/Modal'
import Toast from '@/components/Toast'
import { cloneDeep } from 'lodash'

type ModalOpenCardDetailProps = {
  isOpenModalDetailCard: boolean
  setIsOpenModalDetailCard: (value: boolean) => void
}

type TComment = {
  content: string
  createdAt: string
  userName: string
  userAvatar: string
}

const ModalOpenCardDetail = ({ isOpenModalDetailCard, setIsOpenModalDetailCard }: ModalOpenCardDetailProps) => {
  const { currentCard, storeCurrentCard } = useStoreCard()
  const { userInfo } = useStoreUser()
  const { board, storeBoard } = useStoreBoard()
  const { storeStatusOpenModal } = useStoreStatusOpenModal()
  const [cardDescription, setCardDescription] = useState(currentCard?.description || '')
  const [comment, setComment] = useState('')
  const [listComments, setListComments] = useState<TComment[]>((currentCard?.comments as any) || [])
  const [isOpenEditDescription, setIsOpenEditDescription] = useState(false)
  const [isOpenPopoverAssignMember, setIsOpenPopoverAssignMember] = useState(false)
  const [assignMembers, setAssignMembers] = useState<IMember[]>(currentCard?.assignMembers || [])
  const textareaCommentRef = useRef<HTMLTextAreaElement>(null)
  const [onFixTitleCard, setOnFixTitleCard] = useState(false)
  const [titleCard, setTitleCard] = useState(currentCard?.title || '')

  const handleCloseModal = () => {
    setIsOpenModalDetailCard(false)
    storeStatusOpenModal(false)
    storeCurrentCard({} as any)
  }

  const handleAssignMember = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    e.preventDefault()
    setIsOpenPopoverAssignMember(true)
  }

  const handleToggleAssignMember = async (member: IMember) => {
    try {
      const cloneBoard: any = cloneDeep(board)

      const updateCard = (cardItem: ICard) => {
        if (cardItem._id === currentCard?._id) {
          const newAssignMembers = cardItem.assignMembers || []
          if (newAssignMembers.some((m) => m.email === member.email)) {
            return { ...cardItem, assignMembers: newAssignMembers.filter((m) => m.email !== member.email) }
          } else {
            return { ...cardItem, assignMembers: [...newAssignMembers, member] }
          }
        }
        return cardItem
      }

      cloneBoard.cards = cloneBoard.cards.map(updateCard)

      const currentColumn = cloneBoard.columns.find((columnItem: IColumn) => columnItem._id === currentCard?.columnId)
      if (currentColumn) {
        currentColumn.cards = currentColumn.cards.map(updateCard)
      }

      storeBoard(cloneBoard)
      await instance.put(`/v1/cards/${currentCard?._id}/detail`, {
        assignMembers: currentCard?.assignMembers?.some((m) => m.email === member.email)
          ? currentCard.assignMembers.filter((m) => m.email !== member.email)
          : [...(currentCard?.assignMembers || []), member]
      })

      setAssignMembers((prev) => (prev.some((m) => m.email === member.email) ? prev.filter((m) => m.email !== member.email) : [...prev, member]))
    } catch (error) {
      console.log(error)
    }
  }

  const handleEditDescription = () => {
    setIsOpenEditDescription(true)
  }

  const handleSaveDescription = async () => {
    try {
      // storeBoard(currentCardInColumn)

      setIsOpenEditDescription(false)
      await handleEditCardDetail({
        description: cardDescription
      })

      Toast({
        type: 'success',
        message: 'Edit description success'
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handleSendComment = async () => {
    try {
      console.log('handle send comment')
      const cloneBoard: any = cloneDeep(board)

      const newComment: any = {
        content: comment,
        createdAt: new Date().toISOString(),
        userName: userInfo?.name,
        userAvatar: userInfo?.picture
      }

      cloneBoard.cards = cloneBoard.cards.map((cardItem: ICard) => {
        if (cardItem._id === currentCard?._id) {
          cardItem.comments = [...(cardItem.comments || []), newComment]
          return cardItem
        }
        return cardItem
      })

      cloneBoard.columns.map((columnItem: IColumn) => {
        if (columnItem._id === currentCard?.columnId) {
          columnItem.cards = columnItem.cards.map((cardItem: ICard) => {
            if (cardItem._id === currentCard?._id) {
              cardItem.comments = [...(cardItem.comments || []), newComment]
              return cardItem
            }
            return cardItem
          })
        }
      })

      setListComments((prev) => [...prev, newComment])
      storeBoard(cloneBoard)

      await instance.put(`/v1/cards/${currentCard?._id}/detail`, {
        comments: [...(currentCard?.comments || []), newComment]
      })
      setComment('')
    } catch (error) {
      console.log(error)
    }
  }

  const handleEditCardDetail = async (data: any) => {
    try {
      const cloneBoard: any = cloneDeep(board)

      // Update card in both board cards and column cards with a single map function
      const updateCard = (cardItem: ICard) => {
        if (cardItem._id === currentCard?._id) {
          return { ...cardItem, description: data.description }
        }
        return cardItem
      }

      cloneBoard.cards = cloneBoard.cards.map(updateCard)

      const currentColumn = cloneBoard.columns.find((columnItem: IColumn) => columnItem._id === currentCard?.columnId)
      if (currentColumn) {
        currentColumn.cards = currentColumn.cards.map(updateCard)
      }

      storeBoard(cloneBoard)
      await instance.put(`/v1/cards/${currentCard?._id}/detail`, data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleOpenModalDeleteComment = (comment: TComment) => {}

  const handleSaveTitleCard = async () => {
    try {
      await handleEditCardDetail({ title: titleCard })
      Toast({
        type: 'success',
        message: 'Edit title success'
      })
    } catch (error) {
      console.log(error)
    } finally {
      setOnFixTitleCard(false)
    }
  }

  useEffect(() => {
    if (currentCard) {
      setCardDescription(currentCard?.description || '')
      setAssignMembers(currentCard?.assignMembers || [])
      setListComments((currentCard?.comments as any) || [])
    }
  }, [currentCard])

  if (!currentCard) return null

  return (
    <Modal
      size='4xl'
      isOpen={isOpenModalDetailCard}
      onOpenChange={isOpenPopoverAssignMember ? () => {} : handleCloseModal}
      modalTitle={
        <div className='mt-4 flex items-center gap-2'>
          <CardIcon className='size-6' />
          {onFixTitleCard ? (
            <div className='flex w-full items-center gap-2'>
              <Input defaultValue={currentCard?.title} value={titleCard} onChange={(e) => setTitleCard(e.target.value)} className='w-full' />
              <Button onClick={handleSaveTitleCard} className='max-w-auto min-w-auto !size-10 max-h-10 min-h-10 rounded-lg bg-green-500 text-white'>
                Save
              </Button>
            </div>
          ) : (
            <p className='select-none p-2' onDoubleClick={() => setOnFixTitleCard(!onFixTitleCard)}>
              {currentCard?.title}
            </p>
          )}
        </div>
      }
    >
      <div className='flex max-h-[70dvh] flex-col gap-4 overflow-y-auto'>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2 font-bold'>
              <TextalignLeft />
              <p>Description</p>
            </div>
            {!isOpenEditDescription && (
              <Button
                onClick={handleEditDescription}
                startContent={<Edit className='size-5' />}
                className='max-h-10 min-h-10 rounded-md bg-blue-500 px-4 text-sm font-medium text-white'
              >
                Edit
              </Button>
            )}
          </div>
          {isOpenEditDescription && (
            <div className='flex flex-col gap-2'>
              <div className='grid grid-cols-2 gap-2'>
                <Textarea minRows={3} value={cardDescription} onChange={(e) => setCardDescription(e.target.value)} />
                <Markdown className='whitespace-pre-wrap' rehypePlugins={[rehypeHighlight]}>
                  {cardDescription}
                </Markdown>
              </div>
              <Button onClick={handleSaveDescription} className='ml-auto max-h-10 min-h-10 w-fit rounded-md bg-blue-500 px-4 text-sm font-medium text-white'>
                Save
              </Button>
            </div>
          )}
          {cardDescription.length > 0 && !isOpenEditDescription && (
            <Markdown className='whitespace-pre-wrap' rehypePlugins={[rehypeHighlight]}>
              {cardDescription}
            </Markdown>
          )}
        </div>
        <div className='flex flex-col gap-2'>
          <p className='text-sm font-medium text-blue-500'>Members</p>
          <div className='flex flex-wrap gap-1'>
            {assignMembers?.map((member) => (
              <Tooltip key={member.email} content={member?.email}>
                <div className='relative !size-10 max-h-10 min-h-10 min-w-10 max-w-10 rounded-full'>
                  <Avatar name={member?.email?.charAt(0)} src={member?.picture} className='size-full cursor-pointer object-cover' />
                  <div className='absolute bottom-0 right-0 rounded-full bg-white'>
                    <TickCircle size={16} variant='Bold' className='z-50 text-green-500' />
                  </div>
                </div>
              </Tooltip>
            ))}

            <Popover placement='right' isOpen={isOpenPopoverAssignMember} onOpenChange={setIsOpenPopoverAssignMember}>
              <PopoverTrigger>
                <Button isIconOnly className='!size-10 max-h-10 min-h-10 min-w-10 max-w-10 rounded-full bg-[#eee]' onClick={(e) => handleAssignMember(e)}>
                  <Add />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className='grid grid-cols-5 gap-2'>
                  {board?.memberGmails?.map((member) => (
                    <Tooltip key={member.email} content={member?.email}>
                      <div onClick={() => handleToggleAssignMember(member)} className='relative !size-10 max-h-10 min-h-10 min-w-10 max-w-10 rounded-full'>
                        <Avatar src={member?.picture} className='size-full cursor-pointer object-cover' />
                        {assignMembers.some((m) => m.email === member.email) && (
                          <div className='absolute bottom-0 right-0 rounded-full bg-white'>
                            <TickCircle size={16} variant='Bold' className='text-green-500' />
                          </div>
                        )}
                      </div>
                    </Tooltip>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className='flex items-center gap-2 font-bold'>
          <MessageText />
          <p>Comments</p>
        </div>
        {/* list comments */}
        <div className='flex flex-col gap-2'>
          <div className='flex max-h-[260px] flex-col gap-2 overflow-y-auto'>
            {listComments.length > 0
              ? listComments.map((item, index) => (
                  <div key={index} className='flex items-start gap-2'>
                    <div className='!size-10'>
                      <Avatar className='size-full rounded-full' src={item?.userAvatar || ''} />
                    </div>
                    <div className='flex w-full flex-1 flex-col gap-0.5 rounded-lg bg-[#f6f3f3] p-2'>
                      <Link href={'#'} className='text-sm font-bold'>
                        {item?.userName}
                      </Link>
                      <time className='text-xs text-[#9c9c9c]'>{new Date(item?.createdAt).toLocaleString()}</time>
                      <p className='text-sm'>{item?.content}</p>
                    </div>

                    <Button
                      onClick={() => handleOpenModalDeleteComment(item)}
                      style={{
                        display: item.userName == userInfo?.name ? 'flex' : 'none'
                      }}
                      isIconOnly
                      className='!size-10 max-h-10 min-h-10 items-center justify-center rounded-full bg-transparent text-black hover:bg-red-500 hover:text-white'
                      aria-label='Delete'
                      color='danger'
                    >
                      <Trash />
                    </Button>
                  </div>
                ))
              : null}
          </div>
          <div className='flex items-start gap-2'>
            <Textarea
              ref={textareaCommentRef}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendComment()
                }
              }}
              minRows={1}
              placeholder='Write a comment...'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button onClick={handleSendComment} className='!size-10 max-h-10 min-h-10 rounded-full bg-[#eee] bg-transparent' isIconOnly>
              <Send2 className={`${comment.length > 0 ? 'text-blue-500' : 'text-[#9c9c9c]'} transition`} />
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ModalOpenCardDetail
