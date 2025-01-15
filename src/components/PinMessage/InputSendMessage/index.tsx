'use client'
import { useSocket } from '@/components/Providers/SocketProvider'
import { MESSAGE_TYPES, SOCKET_EVENTS } from '@/constants'
import { TListMessages } from '@/types'
import { isMobileWithUserAgent } from '@/utils'
import { Button, Textarea } from '@nextui-org/react'
import { motion } from 'framer-motion'
import { CloudLightning, Send2 } from 'iconsax-react'
import { useRef } from 'react'

const InputSendMessage = ({
  message,
  onChangeMessage,
  currentChat,
  handleSendMessage,
  isSending
}: {
  message: string
  onChangeMessage: (value: string) => void
  currentChat: TListMessages | null
  handleSendMessage: ({ message, attachment, type }: { message: string; attachment?: File; type: keyof typeof MESSAGE_TYPES }) => Promise<void>
  isSending: boolean
}) => {
  const socket: any = useSocket()
  const inputRef: any = useRef(null)
  const uploadRef: any = useRef(null)
  const sendRef: any = useRef(null)

  const handleClickInputFile = (e: any) => {
    e.preventDefault()
    if (uploadRef.current) {
      uploadRef.current.click()
    }
  }

  return (
    <div className='w-full'>
      <Textarea
        value={message}
        onBlur={() => {
          console.log('xxx')

          socket.emit(SOCKET_EVENTS.MESSAGE_TYPING, {
            typing: false,
            email: currentChat?.email,
            chatWithUserId: (currentChat as any)?.chatWithUserId
          })
        }}
        onChange={(e) => {
          const value = e.target.value
          onChangeMessage(value)
          if (value.length > 1) return
          if (value.length === 1) {
            console.log('zzz')
            socket.emit(SOCKET_EVENTS.MESSAGE_TYPING, {
              typing: true,
              email: currentChat?.email,
              chatWithUserId: (currentChat as any)?.chatWithUserId
            })
          }
        }}
        ref={inputRef}
        minRows={1}
        maxRows={3}
        autoFocus
        maxLength={300}
        radius='none'
        autoComplete='off'
        autoCorrect='off'
        autoCapitalize='off'
        spellCheck='false'
        placeholder={'Enter message'}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey && !isMobileWithUserAgent()) {
            if (message.trim() === '') return
            e.preventDefault()
            handleSendMessage({ message, type: MESSAGE_TYPES.TEXT })
          }
        }}
        // endContent={
        //   message.length === 0 ? (
        //     <>
        //       <input
        //         type='file'
        //         accept='image/*'
        //         style={{
        //           display: 'none'
        //         }}
        //         ref={uploadRef}
        //         onChange={async (e) => {
        //           const file = e.target.files?.[0]
        //           if (file) {
        //             if (file.size > 5 * 1024 * 1024) {
        //               // File size exceeds 5MB
        //               Toast({
        //                 message: 'File size exceeds 5MB limit. Please choose a smaller file.',
        //                 type: 'error'
        //               })
        //               e.target.value = ''
        //               return
        //             }
        //             // onChange(e.target.files)
        //             await handleSendMessage({ message: '', attachment: file, type: MESSAGE_TYPES.IMAGE })
        //             if (!socket.connected) {
        //               console.log('Socket disconnected, reconnecting...')
        //               socket.connect()
        //             }
        //           }
        //           e.target.value = ''
        //         }}
        //       />
        //       <Button isIconOnly name='upload-file-button' className='!size-10 rounded-full bg-transparent' onClick={handleClickInputFile}>
        //         <DocumentUpload className={'text-primary-gray'} />
        //       </Button>
        //     </>
        //   ) : (
        //     <motion.div
        //       initial={{ opacity: 0, scale: 0.5 }}
        //       animate={{ opacity: 1, scale: 1 }}
        //       transition={{ duration: 0.2 }}
        //       exit={{ opacity: 0, scale: 0 }}
        //       className='p-1'
        //     >
        //       <Button
        //         ref={sendRef}
        //         disabled={isSending}
        //         // isDisabled={onFetchingMessage || onReloadMessage}
        //         isIconOnly
        //         radius='full'
        //         className={`text-primary-green flex !size-10 items-center justify-center bg-transparent transition`}
        //         onClick={() => handleSendMessage({ message, type: MESSAGE_TYPES.TEXT })}
        //       >
        //         <Send2 variant='Bold' className='rotate-45 text-colorBoardBar transition' />
        //       </Button>
        //     </motion.div>
        //   )
        // }
        endContent={
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            exit={{ opacity: 0, scale: 0 }}
            className='p-1'
          >
            <Button
              ref={sendRef}
              disabled={isSending}
              // isDisabled={onFetchingMessage || onReloadMessage}
              isIconOnly
              radius='full'
              className={`flex !size-10 items-center justify-center bg-transparent transition`}
              onPress={() => handleSendMessage({ message, type: MESSAGE_TYPES.TEXT })}
            >
              <Send2 variant='Bold' className={`rotate-45 ${message.trim() === '' ? 'text-gray-200' : 'text-colorBoardBar'} transition`} />
            </Button>
          </motion.div>
        }
        classNames={{
          base: '',
          input: 'placeholder:pl-1 p-2 text-sm caret-primary-green placeholder:text-primary-gray placeholder:text-sm',
          innerWrapper: 'items-center group-data-[has-label=true]:items-center',
          inputWrapper:
            '!min-h-10 border-none bg-transparent data-[hover=true]:bg-transparent group-data-[focus=true]:bg-transparent group-data-[focus-visible=true]:ring-0 group-data-[focus-visible=true]:ring-focus group-data-[focus-visible=true]:ring-offset-0 group-data-[focus-visible=true]:ring-offset-background shadow-none p-0'
        }}
      />
    </div>
  )
}

export default InputSendMessage
