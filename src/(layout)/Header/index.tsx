'use client'

import React, { useEffect, useState } from 'react'

import { Avatar, Button, useDisclosure } from '@nextui-org/react'
import { Add } from 'iconsax-react'

import ExpandButton from '@/components/ExpandButton'
import { InputSearch } from '@/components/InputSearch'
import Modal from '@/components/Modal'
import { useSocket } from '@/components/Providers/SocketProvider'
import Toast from '@/components/Toast'
import { SOCKET_EVENTS } from '@/constants'
import instance from '@/services/axiosConfig'
import { useStoreBoard, useStoreConversation, useStoreListConversation, useStoreListMessagesPins, useStoreUser } from '@/store'
import { deleteCookie, getCookie, setCookie } from 'cookies-next'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ContentUser, Messages, Notifications, Recent, Starred, Workspaces } from './(sections)'
import ModalBodyCreateNewBoard from './(sections)/ModalBodyCreateNewBoard'

function Header() {
  const socket: any = useSocket()
  // get token from cookie
  const google_token = getCookie('google_token')
  // get token from localStorage

  const { storeUser } = useStoreUser()
  const { storeBoardRecent, boardsRecent, allBoards } = useStoreBoard()

  const { storeListConversations } = useStoreListConversation()
  const { storeAllConversationFromApi, conversation, storeConversation, allConversation } = useStoreConversation()
  const { storeCurrentChat, currentChat } = useStoreListMessagesPins()
  const router = useRouter()

  const [onSending, setOnSending] = useState<boolean>(false)
  const [onFetching, setOnFetching] = useState<boolean>(false)

  const [onFetchingMessages, setOnFetchingMessages] = useState<boolean>(false)

  const userInfo = useStoreUser((state) => state.userInfo)
  const [titleBoard, setTitleBoard] = useState<string>('')
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleBoard(e.target.value)
  }

  const handleCreateNewBoard = async () => {
    try {
      const payload = { title: titleBoard?.trim(), type: 'private', ownerId: userInfo?.email }
      const data: any = await instance.post('/v1/boards', payload)

      Toast({ message: 'Create Board Successful', type: 'success' })
      setTitleBoard('')
      const newBoard = [data, ...(boardsRecent || [])]
      router.push(`/board/${data?._id}`)
      onClose()
      storeBoardRecent(newBoard)
    } catch (error) {
      console.log(error)
    } finally {
      setOnSending(false)
    }
  }

  const handleGetDetailUser = async ({ payload }: { payload: any }) => {
    try {
      const dataUser: any = await instance.post(`/v1/users/login`, payload)
      setCookie('access_token', dataUser?.boards?.access_token)
      localStorage.setItem('access_token', dataUser?.boards?.access_token)
      storeUser(dataUser?.boards)
      // register user to socket
      socket.emit(SOCKET_EVENTS.REGISTER, dataUser?.boards?.email)
    } catch (error) {
      console.log(error)
    }
  }

  const handleFetchingUser = async () => {
    try {
      const dataUser: any = await instance.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${google_token}`)
      await handleGetDetailUser({ payload: dataUser })
    } catch (error) {
      if (error) {
        Toast({ message: 'Login Expired', type: 'error' })
        // delete token from cookie
        deleteCookie('google_token')
        // delete token from localStorage6
        localStorage.removeItem('access_token')
        router.push('/login')
      }
      console.log(error)
    } finally {
      setOnFetching(false)
    }
  }

  const handleFetchingMessages = async () => {
    try {
      const dataMessages: any = await instance.get(`/v1/conversations`)
      storeAllConversationFromApi(dataMessages)

      storeListConversations(dataMessages)
    } catch (error) {
      console.log(error)
    } finally {
      setOnFetchingMessages(false)
    }
  }

  const handleConfirmCreateNewBoard = () => {
    // check
    if (allBoards?.find((board) => board?.title.trim() === titleBoard?.trim())) {
      Toast({ message: 'Board already exists', type: 'error' })
      return
    }
    setOnSending(true)
  }

  useEffect(() => {
    setOnFetching(true)
  }, [])

  useEffect(() => {
    setOnFetchingMessages(true)
  }, [])

  useEffect(() => {
    onFetching && handleFetchingUser()
  }, [onFetching])

  useEffect(() => {
    onSending && handleCreateNewBoard()
  }, [onSending])

  useEffect(() => {
    onFetchingMessages && handleFetchingMessages()
  }, [onFetchingMessages])

  useEffect(() => {
    if (!socket) return
    socket.emit(SOCKET_EVENTS.REGISTER, userInfo?.email)

    socket.on(SOCKET_EVENTS.MESSAGE_ARRIVED, (data: any) => {
      if (data?.chatWithUserId !== userInfo?.email) return

      const currentConversationSocket: any = allConversation.find((item: any) => item?.chatWithUserId === data?.email)
      const newData = {
        ...data,
        message: data.content
      }

      const convertData = (currentConversationSocket as any)?.messageDetails.map((item: any) => ({
        ...item,
        message: item.content
      }))

      convertData.push(newData)
      currentConversationSocket.messageDetails = convertData
      storeAllConversationFromApi([...allConversation.filter((item: any) => item?.chatWithUserId !== data?.email), currentConversationSocket])
      storeConversation(convertData)
      storeCurrentChat(currentConversationSocket)
    })
  }, [socket, userInfo?.email])

  return (
    <header className='flex h-header items-center justify-between gap-5 overflow-x-auto bg-colorHeader px-4 text-primary'>
      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-2'>
          <Link href={'/'} className='flex min-h-10 min-w-10 cursor-pointer items-center justify-center gap-1 rounded-[3px] px-2 hover:bg-default/40'>
            <Image src='/logo.png' alt='logo' width={40} height={40} />
          </Link>
        </div>
        <div className='mr-2 flex items-center gap-1'>
          <Workspaces />
          <Recent />
          <Starred />
          <Button
            onPress={() => onOpen()}
            className='flex min-h-10 items-center gap-2 bg-colorBoardBar px-4 font-medium text-primary'
            startContent={<Add size={24} />}
          >
            Create
          </Button>
        </div>
      </div>
      <div className='relative flex items-center gap-4'>
        <InputSearch />

        <div className='flex items-center gap-4'>
          <Notifications />
          <Messages />
        </div>
        <ExpandButton isIconOnly content={<ContentUser />}>
          <Avatar src={userInfo?.picture} className='flex !size-8 flex-shrink-0' />
        </ExpandButton>
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        modalTitle='Create new board'
        modalFooter={
          <div className='flex items-center gap-2'>
            <Button variant='light' color='default' onClick={onOpenChange} className='px-6 py-3'>
              Cancel
            </Button>
            <Button isLoading={onSending} onClick={handleConfirmCreateNewBoard} className='bg-colorBoardBar px-6 py-3 text-white'>
              Create
            </Button>
          </div>
        }
      >
        <ModalBodyCreateNewBoard handleChange={handleChange} titleBoard={titleBoard} handleConfirmCreateNewBoard={handleConfirmCreateNewBoard} />
      </Modal>
    </header>
  )
}

export default Header
