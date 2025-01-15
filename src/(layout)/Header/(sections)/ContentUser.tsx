import { User } from 'iconsax-react'

import { useStoreUser } from '@/store'
import { Logout } from 'iconsax-react'
import { Avatar, Button, Link } from '@nextui-org/react'
import { googleLogout } from '@react-oauth/google'
import { deleteCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'

const ContentUser = () => {
  const router = useRouter()

  const userInfo = useStoreUser((state) => state.userInfo)

  const handleLogout = () => {
    // delete token from localStorage
    localStorage.removeItem('access_token')
    // delete token from cookie
    deleteCookie('google_token')
    // logout from google
    googleLogout()

    router.push('/login')
  }

  return (
    <div className='flex min-w-[200px] flex-col gap-2 p-2'>
      <div className='flex items-center gap-2'>
        <Avatar src={userInfo?.picture as string} className='flex !size-8 flex-shrink-0 rounded-full' alt={userInfo?.given_name as string} />
        <div className='flex flex-col'>
          <p>{userInfo?.name}</p>
          <p>{userInfo?.email}</p>
        </div>
      </div>
      {/* line */}
      <div className='h-[1px] w-full bg-gray-200' />
      <div className='flex flex-col gap-2'>
        <Button as={Link} href={`/profile/${userInfo?.email}`} variant='light' startContent={<User size={20} />} className='flex w-full justify-start gap-2 py-2 text-sm'>
          Detail Profile
        </Button>
        {/* line */}
        <div className='h-[1px] w-full bg-gray-200' />
        <Button startContent={<Logout size={20} />} variant='light' onPress={handleLogout} className='flex w-full justify-start gap-2 py-2 text-sm'>
          Logout
        </Button>
      </div>
    </div>
  )
}

export default ContentUser
