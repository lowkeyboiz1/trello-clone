'use client'
import { AvatarMember, ModalMember } from '@/components/MemberGroup'
import { useStoreBoard } from '@/store'
import { IMember } from '@/types'
import { Avatar, AvatarGroup } from '@nextui-org/react'
import { useState } from 'react'
import Modal from '@/components/Modal'

const MemberGroup = () => {
  const MAX_USER_SHOW = 3
  const { board } = useStoreBoard()
  const [isOpenModalMembers, setIsOpenModalMembers] = useState(false)
  const memberGmails: IMember[] = board?.memberGmails || []

  if (!board) return

  const handleShowAllMember = () => {
    setIsOpenModalMembers(true)
  }

  return (
    <>
      <AvatarGroup
        max={MAX_USER_SHOW}
        total={Number(memberGmails?.length - MAX_USER_SHOW)}
        renderCount={(count) => (
          <Avatar
            onClick={handleShowAllMember}
            key={count}
            name={`+${count}`}
            className='data-[hover=true]:z-[30] data-[focus-visible=true]:-translate-x-0 data-[hover=true]:-translate-x-0 rtl:data-[focus-visible=true]:translate-x-0 rtl:data-[hover=true]:translate-x-0'
            classNames={{
              base: 'ring-2 ring-white/30 hover:ring-orange-500',
            }}
          />
        )}
        className='*:size-10 *:max-h-10 *:min-h-10 *:cursor-pointer'
      >
        {memberGmails?.map((item) => <AvatarMember key={item?.email} item={item} onClick={handleShowAllMember} />)}
      </AvatarGroup>
      <ModalMember isOpen={isOpenModalMembers} onOpenChange={() => setIsOpenModalMembers(false)} memberGmails={memberGmails} />
    </>
  )
}

export default MemberGroup
