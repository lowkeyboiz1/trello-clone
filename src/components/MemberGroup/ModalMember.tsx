'use client'

import ImageFallback from '@/components/ImageFallback'
import Modal from '@/components/Modal'
import Toast from '@/components/Toast'
import { MEMBER_STATUS, SOCKET_EVENTS } from '@/constants'
import { useStoreBoard, useStoreConversation, useStoreCurrentConversation, useStoreListConversation, useStoreListMessagesPins, useStoreUser } from '@/store'
import { IMember, TListMessages } from '@/types'
import { uppercaseFirstLetter } from '@/utils'
import { Avatar, Button, Input } from '@nextui-org/react'
import { Message, Trash } from 'iconsax-react'
import Link from 'next/link'
import { useState } from 'react'
import { useSocket } from '../Providers/SocketProvider'

type TModalMember = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  memberGmails: IMember[]
}

const ModalMember = ({ isOpen, onOpenChange, memberGmails }: TModalMember) => {
  const { board, deleteMemberBoard } = useStoreBoard()
  const { userInfo } = useStoreUser()
  const [searchQuery, setSearchQuery] = useState('')

  const { listMessagesPins, storeListMessagesPins, storeCurrentChat } = useStoreListMessagesPins()
  const { storeCurrentConversation, currentConversation } = useStoreCurrentConversation()
  const { listConversations } = useStoreListConversation()
  const { storeConversation } = useStoreConversation()

  const socket: any = useSocket()

  const filteredData = memberGmails?.filter(
    (item) => item?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) || item?.email?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  )

  const handleDeleteMember = async (member: IMember) => {
    try {
      if (!board?._id) return
      await deleteMemberBoard(board?._id, member?.email)
      Toast({
        message: `Delete member ${member?.name ? member?.name : member?.email} success`,
        type: 'success'
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handleSendMessage = (member: IMember) => {
    const newMessage: TListMessages & { chatWithUserId: string } = {
      avatar: member?.picture || member?.email || '',
      name: member?.name || member?.email || '',
      conversationId: member?.email || '',
      chatWithUserId: member?.email || '',
      id: member?.email || '',
      email: userInfo?.email || ''
    }

    const newPinMessage = {
      ...newMessage,
      messageDetails: [],
      message: '',
      _id: Date.now(),
      time: Date.now()
    }

    const exitConversation: any = listConversations.find((item: any) => item?.chatWithUserId === (newMessage as any)?.chatWithUserId)
    if (exitConversation) {
      storeListMessagesPins([...listMessagesPins, newMessage])
      storeCurrentChat(newMessage)
      const messageDetails = exitConversation?.messageDetails.map((itemConversation: any) => ({
        ...itemConversation,
        message: itemConversation?.content
      }))
      console.log('2')
      storeConversation(messageDetails)
      storeCurrentConversation(messageDetails as any)
    } else {
      console.log('3')

      storeListMessagesPins([...listMessagesPins, newPinMessage])
      storeCurrentConversation(newPinMessage as any)
      storeCurrentChat(newPinMessage as any)
      storeConversation(newPinMessage?.messageDetails)
    }
    // storeListMessagesPins([...listMessagesPins, newMessage])
    // storeCurrentConversation(newMessage as any)

    // -----------------0---=--=---

    // console.log({ messagePin })
    // storeCurrentConversation(messagePin as any)
    // storeCurrentChat(messagePin)

    // const isItemExist = listMessagesPins.some((ping: any) => ping?.chatWithUserId === (messagePin as any)?.chatWithUserId) // Kiểm tra item dựa trên id hoặc một thuộc tính định danh

    // // storeCurrentConversation(item)
    // const isItemPinMessageExit = listPinConversation.find((item: any) => item?.chatWithUserId === (messagePin as any)?.chatWithUserId)
    // console.log({ isItemPinMessageExit })

    // if (isItemPinMessageExit) {
    //   // storeListPinConversation(listPinConversation.filter((item: any) => item?.chatWithUserId !== (item as any)?.chatWithUserId))
    // } else {
    //   storeListPinConversation([...listPinConversation, messagePin] as any)
    // }
    // console.log({ listPinConversation })

    // if (isItemExist) {
    //   //
    // } else {
    //   storeListMessagesPins([...listMessagesPins, messagePin] as any)
    // }

    // // {
    // //   message: "I'm good, thanks for asking!",
    // //   email: 'khang@gmail.com',
    // //   type: 'TEXT',
    // //   createdAt: 1672531800000
    // // }

    // const conversation: any = allConversation.find((conversation: any) => conversation.chatWithUserId === (messagePin as any).chatWithUserId)
    // const messageDetails = conversation?.messageDetails.map((itemConversation: any) => ({
    //   message: itemConversation?.content,
    //   email: itemConversation?.email,
    //   type: itemConversation?.type,
    //   createdAt: itemConversation?.createdAt
    // }))

    // storeConversation(messageDetails)

    onOpenChange(false)
  }

  return (
    <div className='pt-[200px]'>
      <Modal size='2xl' isOpen={isOpen} onOpenChange={onOpenChange} modalTitle='Invited Members'>
        <Input type='text' placeholder='Search by name, email' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className='mb-4 w-full' />
        <div className='flex max-h-[400px] min-h-[200px] flex-col gap-4 overflow-y-auto p-2'>
          {filteredData?.map((item) => (
            <div
              key={item?.email}
              className='flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md'
            >
              <div className='flex items-center gap-4'>
                <div className='relative'>
                  <Link href={`/profile/${item?.email}`} className='block size-10'>
                    {item?.status === MEMBER_STATUS.PENDING ? (
                      <Avatar className='size-full rounded-full' name={item?.name?.charAt(0) || ''} />
                    ) : (
                      <ImageFallback src={item?.picture || ''} alt={item?.name || ''} height={50} width={50} className='size-full rounded-full object-cover' />
                    )}
                  </Link>
                  <span
                    className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-white ${item?.status === MEMBER_STATUS.ACCEPTED ? 'bg-green-500' : 'bg-yellow-500'}`}
                  />
                </div>
                <div className='flex flex-col'>
                  <p className='font-semibold text-gray-900'>{item?.name}</p>
                  <p className='text-sm text-gray-500'>{item?.email}</p>
                  <p className='text-xs text-gray-500'>{uppercaseFirstLetter(item?.role || '')}</p>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${item?.status === MEMBER_STATUS.ACCEPTED ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                >
                  {uppercaseFirstLetter(item?.status === MEMBER_STATUS.PENDING ? MEMBER_STATUS.PENDING : MEMBER_STATUS.ACCEPTED)}
                </span>
                {item?.email !== userInfo?.email && (
                  <Button isIconOnly variant='light' radius='full' size='sm' className='!size-10' onPress={() => handleSendMessage(item)}>
                    <Message />
                  </Button>
                )}
                {board?.ownerId === userInfo?.email && (
                  <Button isIconOnly color='danger' variant='light' radius='full' size='sm' className='!size-10' onClick={() => handleDeleteMember(item)}>
                    <Trash className='hover:text-red-500' />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  )
}

export default ModalMember
