import WrapperLayout from '@/components/WrapperLayout'
import { Button } from '@nextui-org/react'
import { ArrowLeft, ShieldCross } from 'iconsax-react'
import Link from 'next/link'

const BoardNotFound = () => {
  return (
    <WrapperLayout>
      <div className='mx-4 flex w-full max-w-md flex-col gap-4 rounded-lg border border-white/20 bg-white/5 p-4 text-center text-white transition-colors hover:bg-white/10'>
        <ShieldCross size={40} className='mx-auto' />
        <h2 className='text-2xl font-bold'>Access Denied</h2>
        <div>
          <p>You don&apos;t have permission to view this board.</p>
          <p className='text-sm'>If you believe this is an error, please contact the board owner or your system administrator for assistance.</p>
        </div>
        <Button startContent={<ArrowLeft />} as={Link} href='/' variant='bordered' className='min-h-10 w-full text-white'>
          Go to Homepage
        </Button>
      </div>
    </WrapperLayout>
  )
}

export default BoardNotFound
