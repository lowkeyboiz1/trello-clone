'use client'

import Toast from '@/components/Toast'
import WrapperLayout from '@/components/WrapperLayout'
import { NOTIFICATION_TYPES } from '@/constants'
import instance from '@/services/axiosConfig'
import { useStoreUser } from '@/store'
import { Button } from '@nextui-org/react'
import { TickCircle } from 'iconsax-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const AcceptInvitation = ({ searchParams }: { searchParams: { boardId: string; status: string } }) => {
  const { boardId } = searchParams
  const { userInfo } = useStoreUser()
  const [onAccept, setOnAccept] = useState(false)
  const [accepted, setAccepted] = useState(false)

  const handleAcceptInvitationApi = async () => {
    try {
      await instance.put(`/v1/notifications/${boardId}`, { status: NOTIFICATION_TYPES.ACCEPTED, email: userInfo?.email, boardId })
      localStorage.removeItem('accept-invitation-link')
      setAccepted(true)
      Toast({
        message: 'You have successfully accepted the invitation',
        type: 'success',
      })
    } catch (error) {
      console.log({ error })
    } finally {
      setOnAccept(false)
      setAccepted(true)
    }
  }

  const handleAcceptInvitation = () => {
    setOnAccept(true)
  }

  useEffect(() => {
    onAccept && handleAcceptInvitationApi()
  }, [onAccept])

  return (
    <WrapperLayout>
      <div className='mx-4 w-full max-w-md rounded-lg border border-white/20 bg-white/5 p-4 transition-colors hover:bg-white/10'>
        <div className='flex flex-col items-center space-y-4 pb-2'>
          <TickCircle variant='Bold' className='h-6 w-6 text-green-500' />
          <h1 className='text-center text-2xl font-bold'>You&apos;ve Been Invited!</h1>
        </div>
        <div className='space-y-4'>
          <div className='rounded-lg bg-white/20 p-4'>
            <div className='space-y-3'>
              <div className='space-y-1'>
                <p className='text-muted-foreground text-sm'>Board ID</p>
                <p className='break-all font-mono text-sm'>{boardId}</p>
              </div>
              <div className='space-y-1'>
                <p className='text-muted-foreground text-sm'>Status</p>
                <div className='flex items-center space-x-2'>
                  <div className='size-2 min-h-2 min-w-2 rounded-full bg-yellow-500' />
                  <p className='text-sm font-medium'>Pending</p>
                </div>
              </div>
            </div>
          </div>
          <p className='text-muted-foreground text-center text-sm'>
            You have been invited to join the board and now have access to the shared board. You may begin collaborating with your team at your convenience.
          </p>
        </div>
        <div className='mt-4 flex flex-col space-y-2'>
          <Button
            isLoading={onAccept}
            as={accepted ? Link : Button}
            href={accepted ? `/board/${boardId}` : ''}
            onClick={accepted ? () => {} : handleAcceptInvitation}
            className={`min-h-10 w-full border-1 ${accepted ? 'border-[#3843D0] hover:border-[#3843D0]/90' : 'border-transparent bg-[#3843D0] text-white hover:bg-[#3843D0]/90'}`}
            size='lg'
          >
            {accepted ? 'Go to the board!' : 'Accept'}
          </Button>
          <Button as={Link} href='/' className='text-muted-foreground min-h-10 w-full text-center text-sm text-black transition-colors hover:text-[#3843D0]'>
            Return to Dashboard
          </Button>
        </div>
      </div>
    </WrapperLayout>
  )
}

export default AcceptInvitation
