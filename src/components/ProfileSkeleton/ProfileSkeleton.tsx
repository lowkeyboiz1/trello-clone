import React from 'react'
import { Skeleton } from '@nextui-org/react'

const ProfileSkeleton = () => {
  return (
    <div className='mx-auto flex w-full flex-col gap-6'>
      <Skeleton className='!min-h-8 w-40 rounded-lg bg-white/10' />
      <div className='relative mx-auto'>
        <Skeleton className='!size-[120px] rounded-full bg-white/10' />
      </div>
      <div className='flex flex-col gap-2'>
        <Skeleton className='mb-1 !min-h-4 w-24 rounded-lg bg-white/10' />
        <Skeleton className='!min-h-12 w-full rounded-lg bg-white/10' />
        <Skeleton className='mb-1 !min-h-4 w-12 rounded-lg bg-white/10' />
        <Skeleton className='!min-h-12 w-full rounded-lg bg-white/10' />
        <Skeleton className='mt-4 !min-h-10 w-full rounded-lg bg-white/10' />
      </div>
    </div>
  )
}

export default ProfileSkeleton
