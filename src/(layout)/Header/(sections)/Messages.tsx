'use client'

import NoItemOverView from '@/components/OverViewItem/NoItemOverView'
import PopoverCustom from '@/components/PopoverCustom'
import { useStoreConversation, useStoreCurrentConversation, useStoreListConversation, useStoreListMessagesPins, useStoreListPinConversation } from '@/store'
import { Avatar, Badge, Button } from '@nextui-org/react'
import { Message } from 'iconsax-react'

type TMessagePin = { id: number; name: string; email: string; message: string; avatar: string; time: string }

const Messages = () => {
  const { listConversations } = useStoreListConversation()
  console.log({ listConversations })
  const noData = listConversations?.length === 0
  return (
    <PopoverCustom
      noData={noData}
      popoverTrigger={
        <Button isIconOnly variant='light' className='flex !size-10 flex-shrink-0 text-white hover:bg-white/10'>
          <Badge
            content={listConversations?.length}
            shape='circle'
            color='danger'
            placement='top-right'
            size='sm'
            classNames={{ badge: `!size-5 ${noData ? 'hidden' : ''}` }}
          >
            <Message />
          </Badge>
        </Button>
      }
    >
      <div className='flex max-h-[300px] w-[340px] flex-col items-center gap-2 overflow-auto py-2'>
        {noData ? (
          <NoItemOverView title='No messages yet' description='Your messages will appear here' />
        ) : (
          listConversations?.map((item: any, index: number) => <MessagesContent key={index} item={item} />)
        )}
      </div>
    </PopoverCustom>
  )
}

const MessagesContent = ({ item }: { item: TMessagePin }) => {
  const { storeListMessagesPins, listMessagesPins, storeCurrentChat } = useStoreListMessagesPins()
  const { allConversation, storeConversation } = useStoreConversation()
  const { storeListPinConversation, listPinConversation } = useStoreListPinConversation()
  const { currentConversation, storeCurrentConversation } = useStoreCurrentConversation()
  const { listConversations } = useStoreListConversation()

  const handleClickToChat = () => {
    const isItemExist = listMessagesPins.find((ping: any) => ping?.chatWithUserId === (item as any)?.chatWithUserId) // Kiểm tra item dựa trên id hoặc một thuộc tính định danh
    storeCurrentChat(item as any)
    storeCurrentConversation(item as any)
    // storeCurrentConversation(item)
    const isItemPinMessageExit = listPinConversation.find((item: any) => item?.chatWithUserId === (item as any)?.chatWithUserId)

    if (isItemPinMessageExit) {
      // storeListPinConversation(listPinConversation.filter((item: any) => item?.chatWithUserId !== (item as any)?.chatWithUserId))
    } else {
      storeListPinConversation([...listPinConversation, item] as any)
    }

    if (isItemExist) {
      //
    } else {
      storeListMessagesPins([...listMessagesPins, item] as any)
    }

    // {
    //   message: "I'm good, thanks for asking!",
    //   email: 'khang@gmail.com',
    //   type: 'TEXT',
    //   createdAt: 1672531800000
    // }

    const conversation: any = allConversation.find((conversation: any) => conversation.chatWithUserId === (item as any).chatWithUserId)
    const messageDetails = conversation?.messageDetails.map((itemConversation: any) => ({
      message: itemConversation?.content,
      email: itemConversation?.email,
      type: itemConversation?.type,
      createdAt: itemConversation?.createdAt
    }))
    console.log({ allConversation, conversation })
    console.log('1')
    console.log({ messageDetails })
    storeConversation(messageDetails)
  }

  return (
    <div
      className='relative flex w-full items-center gap-2 rounded-lg border border-white/20 bg-white/5 p-2 transition-colors hover:bg-white/10'
      style={{ opacity: 1, willChange: 'opacity, transform', transform: 'none' }}
      onClick={handleClickToChat}
    >
      <div className='!size-9 max-h-9 min-h-9 min-w-9 max-w-9'>
        <Avatar name={item?.name} className='flex size-full max-h-9 min-h-9 min-w-9 max-w-9 flex-shrink-0' />
      </div>
      <div className='flex flex-col gap-1 text-white'>
        <p className='text-sm'>{(item as any)?.chatWithUserId}</p>
        <p className='text-xs text-white/50'>{item?.message}</p>
      </div>
    </div>
  )
}

export default Messages
