'use client'
import Conversation from '@/components/PinMessage/Conversation'
import InputSendMessage from '@/components/PinMessage/InputSendMessage'
import { MESSAGE_TYPES, SOCKET_EVENTS } from '@/constants'
import instance from '@/services/axiosConfig'
import {
  useStoreConversation,
  useStoreCurrentConversation,
  useStoreListConversation,
  useStoreListMessagesPins,
  useStoreListPinConversation,
  useStoreTyping,
  useStoreUser
} from '@/store'
import { TListMessages, TMessage } from '@/types'
import { groupMessagesBySender } from '@/utils'
import { Close } from '@mui/icons-material'
import { Avatar, Tooltip } from '@nextui-org/react'
import { Minus } from 'iconsax-react'
import { useEffect, useMemo, useState } from 'react'
import { useSocket } from '../Providers/SocketProvider'

const PinMessage = () => {
  const { userInfo } = useStoreUser()
  const { listMessagesPins, storeListMessagesPins, currentChat, storeCurrentChat } = useStoreListMessagesPins()
  const { listConversations, storeListConversations } = useStoreListConversation()
  const [isFetching, setIsFetching] = useState(false)
  const { conversation, storeConversation, allConversation, storeAllConversationFromApi } = useStoreConversation()
  const { storeCurrentConversation, currentConversation } = useStoreCurrentConversation()
  const { storeListPinConversation, listPinConversation } = useStoreListPinConversation()
  const [message, setMessage] = useState('')
  const [messageApi, setMessageApi] = useState<any>(null)
  const [isSending, setIsSending] = useState(false)
  const socket: any = useSocket()
  const { typing, storeTyping } = useStoreTyping()
  const handleChangeMessage = (value: string) => {
    setMessage(value)
    setMessageApi(value)
  }

  const handleSendMessage = async ({ message, attachment, type }: { message: string; attachment?: File; type: keyof typeof MESSAGE_TYPES }) => {
    try {
      setIsSending(true)
      if (!userInfo?.email) return
      if (message.trim() === '') return
      if (messageApi.trim() === '') return
      socket.emit(SOCKET_EVENTS.MESSAGE_TYPING, {
        typing: false,
        email: userInfo?.email,
        chatWithUserId: (currentChat as any)?.chatWithUserId
      })
      setMessage('')
      if ((currentChat as any)?.chatWithUserId !== userInfo?.email) {
        const newMessage: TMessage & { _id: number } = {
          message: messageApi.trim(),
          type,
          email: userInfo?.email,
          ...(attachment && { attachment }),
          createdAt: Date.now(),
          _id: Date.now()
        }
        const newMessageState = {
          ...newMessage,
          content: newMessage.message,
          chatWithUserId: (currentChat as any)?.chatWithUserId
        }

        const newCurrentConversation = (currentConversation as any)?.messageDetails.push(newMessageState)

        storeConversation([...conversation, newMessage])

        const newListConversations = [currentConversation as any, ...listConversations.filter((item: any) => item._id !== (currentConversation as any)?._id)]
        if (currentConversation) {
          // @ts-ignore
          currentConversation.message = currentConversation.messageDetails?.[currentConversation.messageDetails.length - 1]?.content || ''
        }
        storeListConversations(newListConversations)
      }

      const itemExitInAllConversation = allConversation.find((item: any) => item?.chatWithUserId === (currentChat as any)?.chatWithUserId)
      if (!itemExitInAllConversation) {
        const newListConversations = [currentConversation as any, ...listConversations.filter((item: any) => item._id !== (currentConversation as any)?._id)]

        storeAllConversationFromApi(newListConversations)
      }

      const payload = {
        content: messageApi,
        chatWithUserId: (currentChat as any)?.chatWithUserId
      }

      await instance.post(`/v1/conversations`, payload)

      setMessageApi('')
      console.log('send message')
    } catch (error) {
      console.log(error)
    } finally {
      setIsSending(false)
    }
  }

  const handleClose = () => {
    storeCurrentChat(null)
    storeCurrentConversation(null)
  }

  const handleOpen = (messagePin: TListMessages) => {
    // 4) click 1 Avatar pin => 1. storeCurrentConversation
    console.log({ messagePin })
    storeCurrentConversation(messagePin as any)
    storeCurrentChat(messagePin)

    const isItemExist = listMessagesPins.some((ping: any) => ping?.chatWithUserId === (messagePin as any)?.chatWithUserId) // Kiểm tra item dựa trên id hoặc một thuộc tính định danh

    // storeCurrentConversation(item)
    const isItemPinMessageExit = listPinConversation.find((item: any) => item?.chatWithUserId === (messagePin as any)?.chatWithUserId)
    console.log({ isItemPinMessageExit })

    if (isItemPinMessageExit) {
      // storeListPinConversation(listPinConversation.filter((item: any) => item?.chatWithUserId !== (item as any)?.chatWithUserId))
    } else {
      storeListPinConversation([...listPinConversation, messagePin] as any)
    }
    console.log({ listPinConversation })

    if (isItemExist) {
      //
    } else {
      storeListMessagesPins([...listMessagesPins, messagePin] as any)
    }

    // {
    //   message: "I'm good, thanks for asking!",
    //   email: 'khang@gmail.com',
    //   type: 'TEXT',
    //   createdAt: 1672531800000
    // }

    const conversation: any = allConversation.find((conversation: any) => conversation.chatWithUserId === (messagePin as any).chatWithUserId)
    const messageDetails = conversation?.messageDetails.map((itemConversation: any) => ({
      message: itemConversation?.content,
      email: itemConversation?.email,
      type: itemConversation?.type,
      createdAt: itemConversation?.createdAt
    }))

    storeConversation(messageDetails)
  }

  const handleMinimize = () => {
    storeCurrentChat(null)
    storeCurrentConversation(null)
  }

  const handleRemovePin = (e: React.MouseEvent<HTMLDivElement>, messagePin: TListMessages) => {
    e.stopPropagation()
    e.preventDefault()

    if (currentChat?.email === messagePin.email) {
      storeCurrentChat(null)
      storeCurrentConversation(null)
    }
    const newListMessagesPins = listMessagesPins.filter((item) => item.email !== messagePin.email)
    storeListMessagesPins(newListMessagesPins)
    storeListPinConversation(newListMessagesPins as any)
  }

  const handleFetchMessages = async () => {
    setIsFetching(true)
    // const messageDetails: any = await getMessagesByConversationId(currentChat?.conversationId as string)
    // storeConversation(messageDetails)
    setIsFetching(false)
  }

  useEffect(() => {
    if (isFetching) {
      handleFetchMessages()
    }
  }, [isFetching])

  useEffect(() => {
    setIsFetching(true)
  }, [])

  const groupMessage = useMemo(() => {
    if (!conversation) return []

    return groupMessagesBySender(conversation as any) as any
  }, [conversation])

  useEffect(() => {
    if (!socket) return
    socket.on(SOCKET_EVENTS.MESSAGE_TYPING, (data: any) => {
      storeTyping(data)
    })
  }, [socket])

  return (
    <div className='absolute bottom-4 right-4 z-50 flex items-end gap-4'>
      {currentChat && (
        <div className={`mb-[-16px] flex-col rounded-lg bg-white`}>
          <div className='flex items-center justify-between border-b border-gray-300 px-3 py-2'>
            <div className='flex items-center gap-2'>
              <Avatar src={currentChat?.avatar} className='!size-9' />
              <p className=''>{(currentChat as any)?.chatWithUserId}</p>
            </div>
            <div className='flex items-center gap-2'>
              <span onClick={handleMinimize} className='cursor-pointer'>
                <Minus size={20} className='text-black' />
              </span>
              <span onClick={handleClose} className='cursor-pointer'>
                <Close className='!size-5 text-black' />
              </span>
            </div>
          </div>
          {currentChat && <Conversation conversation={groupMessage as any} />}
          <InputSendMessage
            message={message}
            onChangeMessage={handleChangeMessage}
            currentChat={currentChat}
            handleSendMessage={handleSendMessage}
            isSending={isSending}
          />
        </div>
      )}
      <div className='flex flex-col gap-2'>
        {listMessagesPins.map((messagePin) => {
          return (
            <Tooltip key={messagePin?.avatar} content={messagePin?.name} placement='left'>
              <div className='group relative !size-10 rounded-full' onClick={() => handleOpen(messagePin)}>
                <Avatar name={messagePin?.avatar} className='size-full object-cover' />
                <div
                  onClick={(e) => handleRemovePin(e, messagePin)}
                  className='absolute right-0 top-0 z-50 hidden !size-4 max-h-4 w-4 max-w-4 items-center justify-center rounded-full bg-white group-hover:flex'
                >
                  <Close className='!size-3' />
                </div>
              </div>
            </Tooltip>
          )
        })}
      </div>
    </div>
  )
}

export default PinMessage
