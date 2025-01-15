import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import Image from 'next/image'
import React from 'react'

const NoItemOverView = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className='flex flex-col items-center text-center'>
      <DotLottieReact className='w-80' src='https://lottie.host/27603ce5-73cf-4072-81df-1fba472f7e5c/8Th9oMgq8s.json' loop autoplay />
      <h2 className='text-lg font-medium text-gray-900'>{title}</h2>
      <p className='mb-4 text-sm text-gray-500'>{description}</p>
    </div>
  )
}

export default NoItemOverView
