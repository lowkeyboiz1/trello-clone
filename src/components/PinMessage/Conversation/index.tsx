'use client'

import { Avatar } from '@nextui-org/react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { TGroupMessage, TListMessages, TMessage } from '@/types'
import { useStoreTyping, useStoreUser } from '@/store'
import { MESSAGE_TYPES } from '@/constants'
import moment from 'moment'

const Conversation = ({ conversation }: { conversation: TGroupMessage[] | null }) => {
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const { userInfo } = useStoreUser()
  const { typing } = useStoreTyping()
  const currentEmail = userInfo?.email
  const messageAnimation = useCallback(() => {
    return {
      initial: { x: -80, y: 20 },
      animate: {
        x: 0,
        y: 0,
        transition: {
          x: { delay: 0.05, type: 'tween', duration: 0.05 },
          y: { duration: 0.1 }
        }
      }
    }
  }, [])
  //
  const formatLocalHoursTime = (time: number) => {
    const utcDate = moment.utc(time)

    // Convert the UTC date to local time
    const localDate = utcDate.local()

    // Format the local date to hh:mm format
    return localDate.format('HH:mm')
  }

  const renderMessageUI = (item: TMessage, isMe: boolean) => {
    switch (item?.type) {
      case MESSAGE_TYPES.TEXT:
        return (
          <motion.div
            variants={messageAnimation()}
            initial='initial'
            animate='animate'
            transition={{ duration: 0.2 }}
            viewport={{ once: true }}
            className={`text-primary-black max-w-[80%] rounded-2xl p-4 ${isMe ? 'bg-[#2367EC] text-white' : 'bg-[#f0f0f0]'}`}
            style={
              isMe
                ? {
                    borderTopRightRadius: (item as any)?.first ? '16px' : '4px',
                    borderBottomRightRadius: (item as any)?.last ? '16px' : '4px'
                  }
                : {
                    borderTopLeftRadius: (item as any)?.first ? '16px' : '4px',
                    borderBottomLeftRadius: (item as any)?.last ? '16px' : '4px'
                  }
            }
          >
            <pre className={`font-inter break-words text-base ${isMe ? 'text-right' : 'text-left'}`} style={{ whiteSpace: 'pre-wrap' }}>
              {item?.message}
            </pre>
            <div className={`mt-1 flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <time className={`text-xs ${isMe ? 'text-primary-black' : 'text-primary-gray'}`}>{formatLocalHoursTime(item?.createdAt)}</time>
            </div>
          </motion.div>
        )

      // case MESSAGE_TYPES.IMAGE:
      //   return <MessageImage key={`message-${item?.attachment?.url}`} url={item?.attachment?.url as string} />

      default:
        return null
    }
  }

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }
  function filterUniqueMessages(messages: any) {
    const uniqueIds = new Set() // Dùng Set để đảm bảo _id là duy nhất
    return messages.filter((message: any) => {
      if (!uniqueIds.has(message?.createdAt)) {
        uniqueIds.add(message?.createdAt)
        return true // Giữ lại message nếu chưa gặp _id
      }
      return false // Bỏ qua message nếu _id đã tồn tại
    })
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversation, typing])

  return (
    <div ref={chatContainerRef} className='h-[400px] w-[340px] overflow-y-auto border-b border-gray-300 px-2 py-1'>
      <div className='flex flex-col gap-2'>
        {conversation?.length &&
          conversation?.map((item, index) => {
            const uniqueMessages = filterUniqueMessages(item?.messages || []) // Lọc tin nhắn trùng lặp
            const isMe = item?.userId === currentEmail
            return (
              <div key={item?.userId + index} className={`flex w-full flex-col gap-1`}>
                {uniqueMessages?.map((message: any, index: number) => {
                  return (
                    <div key={message?.message + index} className={`flex w-full items-center gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                      {renderMessageUI(message, isMe)}
                    </div>
                  )
                })}
              </div>
            )
          })}
        {typing && (
          <div className='mt-1 flex w-full items-center gap-2'>
            <motion.div className={`flex min-h-10 w-fit items-center gap-1 rounded-xl bg-[#f1f4f8] p-3 text-black`}>
              {Array(3)
                .fill(0)
                .map((_, index) => (
                  <motion.div
                    key={index}
                    className='!size-1.5 rounded-full bg-black/40'
                    animate={{
                      y: [0, -4, 0],
                      transition: {
                        delay: index * 0.1,
                        duration: 0.3,
                        ease: 'easeInOut',
                        repeat: Infinity,
                        repeatDelay: 1
                      }
                    }}
                  />
                ))}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Conversation
