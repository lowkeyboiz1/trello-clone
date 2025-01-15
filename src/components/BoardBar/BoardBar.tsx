'use client'

import { Dashboard as DashboardIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material'
import { Button, Input } from '@nextui-org/react'

import { FilterBoard, SelectTypeOfWorkspace } from '@/app/(main)/board/[boardId]/(sections)'
import Modal from '@/components/Modal'
import { useSocket } from '@/components/Providers/SocketProvider'
import Toast from '@/components/Toast'
import { BOARD_MEMBER_ROLE, BOARD_TYPE, MEMBER_STATUS, SOCKET_EVENTS } from '@/constants'
import instance from '@/services/axiosConfig'
import { useStoreBoard } from '@/store'
import { memo, useEffect, useState } from 'react'
import MemberGroup from '../MemberGroup'
import { validateEmail } from '@/utils'

function BoardBar() {
  const socket: any = useSocket()
  const { storeBoard, board } = useStoreBoard()
  const [isFixTitleBoard, setIsFixTitleBoard] = useState<boolean>(false)
  const [isPrivateBoard, setIsPrivateBoard] = useState<string>(board?.type || BOARD_TYPE.PUBLIC)
  const [titleBoard, setTitleBoard] = useState<string>(board?.title || '')

  const [isOpenModalInviteMember, setIsOpenModalInviteMember] = useState(false)
  const [isInvitingMember, setIsInvitingMember] = useState(false)
  const [emailInviteMember, setEmailInviteMember] = useState('')

  const handleRenameTitleBoard = async () => {
    if (titleBoard === board?.title || titleBoard === '') return setIsFixTitleBoard(false)

    if (titleBoard?.length <= 3 || titleBoard?.length > 50) {
      return setIsFixTitleBoard(false)
    }

    const payload = { title: titleBoard }

    storeBoard({ ...board!, title: titleBoard })

    try {
      await instance.put(`/v1/boards/${board?._id}`, payload)
      Toast({ message: 'Board renamed successfully', type: 'success' })
    } catch {
      Toast({ message: 'Failed to rename board', type: 'error' })
    } finally {
      setIsFixTitleBoard(false)
    }
  }

  const handleToggleModalInviteMember = () => {
    setIsOpenModalInviteMember(!isOpenModalInviteMember)
  }

  const handleInviteMember = () => {
    if (!emailInviteMember) return
    setIsInvitingMember(true)
  }

  const handleInviteMemberApi = async () => {
    try {
      if (board?.memberGmails?.find((member) => member.email === emailInviteMember)) {
        return Toast({ message: `Member ${emailInviteMember} already exists`, type: 'error' })
      }
      if (emailInviteMember === board?.ownerId) {
        return Toast({ message: `You cannot invite yourself`, type: 'error' })
      }
      const emailValidation = validateEmail(emailInviteMember)
      if (!emailValidation.isValid) {
        return Toast({ message: emailValidation.message, type: 'error' })
      }

      await instance.post(`/v1/boards/${board?._id}/members`, { memberGmails: [emailInviteMember] })
      Toast({ message: `Invite member ${emailInviteMember} successfully`, type: 'success' })
      setEmailInviteMember('')

      storeBoard({
        ...board!,
        memberGmails: [...(board?.memberGmails || []), { email: emailInviteMember, status: MEMBER_STATUS.PENDING, role: BOARD_MEMBER_ROLE.MEMBER }]
      })

      handleToggleModalInviteMember()
    } catch (error) {
      console.log({ error })
    } finally {
      setIsInvitingMember(false)
    }
  }

  //123

  useEffect(() => {
    isInvitingMember && handleInviteMemberApi()
  }, [isInvitingMember])

  useEffect(() => {
    if (!socket) return
    socket.emit(SOCKET_EVENTS.JOIN_BOARD, board?._id)

    console.log('123')
    socket.on(SOCKET_EVENTS.UPDATE_MEMBER, (data: any) => {
      storeBoard({ ...board!, memberGmails: data.memberGmails })
    })
  }, [socket, board])

  //test
  return (
    <div className='flex h-boardBar items-center justify-between gap-5 overflow-x-auto overflow-y-hidden bg-colorBoardContent px-4'>
      <div className='flex items-center gap-2'>
        {isFixTitleBoard ? (
          <Input
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                handleRenameTitleBoard()
              }
            }}
            maxLength={30}
            variant='bordered'
            autoFocus
            onBlur={() => handleRenameTitleBoard()}
            value={titleBoard}
            onChange={(e) => {
              setTitleBoard(e.target.value)
            }}
            classNames={{
              inputWrapper: 'border-white/80 data-[hover=true]:white/80 group-data-[focus=true]:border-white/80'
            }}
            className='w-full max-w-[250px] border-white/80 text-white'
          />
        ) : (
          <Button
            className='flex min-h-10 w-full max-w-[250px] items-center gap-2 rounded-[4px] bg-transparent px-4 font-medium text-primary hover:bg-white/40'
            startContent={<DashboardIcon />}
            onPress={() => setIsFixTitleBoard(!isFixTitleBoard)}
          >
            {board?.title}
          </Button>
        )}
        {/* {listBoardBar.map((item, index) => (
          <ExpandButton key={index} title={item.title} content={item.content} startContent={item.startContent} style='font-normal'></ExpandButton>
        ))} */}
        <SelectTypeOfWorkspace />
        {/* <FilterBoard /> */}
      </div>
      <div className='flex items-center gap-10'>
        <Button className='w-full px-4 py-2 text-white' onClick={handleToggleModalInviteMember} startContent={<PersonAddIcon />} variant='bordered'>
          Invite
        </Button>
        <Modal isOpen={isOpenModalInviteMember} onOpenChange={handleToggleModalInviteMember} modalTitle='Invite Member'>
          <div className='-mt-2 flex flex-col gap-4 py-2'>
            <Input
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  handleInviteMember()
                }
              }}
              value={emailInviteMember}
              placeholder={'Enter your invite email'}
              onChange={(e) => {
                setEmailInviteMember(e.target.value)
              }}
              isRequired
              type='email'
            />
          </div>
          <div className='flex w-full justify-end'>
            <Button isLoading={isInvitingMember} className='bg-primary2 px-1 py-3 text-white' onClick={handleInviteMember}>
              Invite
            </Button>
          </div>
        </Modal>
        {board?.memberGmails?.length && board?.memberGmails?.length > 0 ? <MemberGroup /> : null}
      </div>
    </div>
  )
}

export default BoardBar
