'use client'

import { IMember } from '@/types'
import { uppercaseFirstLetter } from '@/utils'
import { Avatar } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import PopoverCustom from '../PopoverCustom'

type TAvatarMember = {
  item: IMember
  onClick: () => void
}

const AvatarMember = ({ item, onClick }: TAvatarMember) => {
  const router = useRouter()
  const [isHover, setIsHover] = useState(false)

  return (
    <PopoverCustom
      isOpen={isHover}
      onOpenChange={() => setIsHover(false)}
      popoverTrigger={
        <Avatar
          {...(item?.picture ? { src: item?.picture } : { name: item?.email?.charAt(0) })}
          classNames={{
            base: `ring-2 ring-white/30 ${isHover ? 'ring-orange-500' : ''}`
          }}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          onClick={onClick}
        />
      }
    >
      <div
        className='flex w-full flex-col rounded-lg border border-white/20 bg-white/5 p-2 transition-colors hover:bg-white/10'
        style={{ opacity: 1, willChange: 'opacity, transform', transform: 'none' }}
      >
        <div className='flex items-center gap-2 px-2 text-white'>
          <div className='!size-10 rounded-full'>
            <Avatar
              onClick={() => router.push(`/profile/${item?.email}`)}
              className='size-full text-base data-[focus-visible=true]:-translate-x-0 data-[hover=true]:-translate-x-0 rtl:data-[focus-visible=true]:translate-x-0 rtl:data-[hover=true]:translate-x-0'
              {...(item?.picture ? { src: item?.picture } : { name: item?.email?.charAt(0) })}
            />
          </div>
          <div className='flex flex-col'>
            <p>{item?.email}</p>
            <p className='text-xs text-white/60'>{uppercaseFirstLetter(item?.role || '')}</p>
          </div>
        </div>
      </div>
    </PopoverCustom>
  )
}

export default AvatarMember
