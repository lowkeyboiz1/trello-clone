'use client'

import Link from 'next/link'
import { motion, useAnimation } from 'framer-motion'
import { useEffect } from 'react'
import { Button } from '@nextui-org/react'
import { ArrowRight, ArrowRight2 } from 'iconsax-react'

export default function NotFound() {
  const controls = useAnimation()

  useEffect(() => {
    controls.start('visible')
  }, [controls])

  return (
    <div className='flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-blue-950 via-blue-900 to-blue-800'>
      <div className='relative mx-auto w-full max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8'>
        {/* Stars background */}
        <motion.div
          initial='hidden'
          animate='visible'
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className='absolute inset-0'
        >
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className='h-1 absolute w-1 rounded-full bg-white'
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              variants={{
                hidden: { opacity: 0, scale: 0 },
                visible: {
                  opacity: [0.2, 1, 0.2],
                  scale: [1, 1.2, 1],
                  transition: {
                    repeat: Infinity,
                    duration: Math.random() * 3 + 2,
                  },
                },
              }}
            />
          ))}
        </motion.div>

        {/* Planet and Comet */}
        <motion.div
          className='relative mb-8'
          initial='hidden'
          animate={controls}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 1 } },
          }}
        >
          <motion.div className='h-40 relative mx-auto w-40' initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ duration: 1.5, ease: 'easeOut' }}>
            {/* Planet */}
            <svg className='h-full w-full' viewBox='0 0 100 100'>
              <motion.circle cx='50' cy='50' r='45' className='fill-blue-400' initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 1, delay: 0.5 }} />
              {/* Craters */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 1 }}>
                <circle cx='35' cy='40' r='8' className='fill-blue-300' />
                <circle cx='60' cy='55' r='6' className='fill-blue-300' />
                <circle cx='45' cy='65' r='5' className='fill-blue-300' />
              </motion.g>
            </svg>

            {/* Orbiting Moon */}
            <motion.div
              className='h-6 absolute w-6 rounded-full bg-gray-300'
              animate={{
                rotate: 360,
              }}
              style={{
                top: -10,
                left: '50%',
                x: '-50%',
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <div className='h-2 absolute left-1 top-1 w-2 rounded-full bg-gray-400' />
            </motion.div>

            {/* Comet */}
            <motion.div
              className='absolute -right-20 -top-20 rotate-45 transform'
              initial={{ x: -200, y: 200, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
            >
              <motion.div className='h-1 w-20 bg-gradient-to-r from-transparent via-blue-300 to-blue-100' animate={{ width: [80, 100, 80] }} transition={{ duration: 2, repeat: Infinity }} />
              <motion.div className='h-2 w-2 rounded-full bg-blue-100' animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* 404 Text */}
        <motion.h1 className='mb-8 text-8xl font-bold text-white' initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}>
          404
        </motion.h1>

        {/* Message */}
        <motion.p className='mb-12 text-xl text-blue-100' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.8 }}>
          Hey captain! Looks like you&apos;re heading to a wrong planet!
        </motion.p>

        {/* Button */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1 }}>
          <Button
            as={Link}
            endContent={<ArrowRight />}
            href='/'
            className='inline-flex items-center rounded-full bg-blue-100 px-6 py-3 text-sm font-medium text-blue-900 transition-colors duration-200 hover:bg-white'
          >
            Take me back to the homepage
          </Button>
        </motion.div>

        {/* Floating Satellites */}
        <motion.div
          className='h-4 absolute left-1/4 top-1/4 w-4 text-blue-200'
          animate={{
            y: [0, -20, 0],
            rotate: 360,
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          ✦
        </motion.div>
        <motion.div
          className='h-4 absolute bottom-1/4 right-1/4 w-4 text-blue-200'
          animate={{
            y: [0, 20, 0],
            rotate: -360,
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          ✧
        </motion.div>
      </div>
    </div>
  )
}
