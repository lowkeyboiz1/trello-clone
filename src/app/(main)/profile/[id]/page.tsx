'use client'

import ImageFallback from '@/components/ImageFallback'
import ProfileSkeleton from '@/components/ProfileSkeleton'
import Toast from '@/components/Toast'
import WrapperLayout from '@/components/WrapperLayout'
import instance from '@/services/axiosConfig'
import { useStoreListMessagesPins, useStoreListPinConversation, useStoreUser } from '@/store'
import { decodeEmail, objectToFormData } from '@/utils'
import { Avatar, Button, Card, CardHeader, Input } from '@nextui-org/react'
import { motion } from 'framer-motion'
import { Camera, Message, Warning2 } from 'iconsax-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

const ProfilePage = ({ params }: { params: { id: string } }) => {
  const email = decodeEmail(params?.id)
  const { userInfo, storeUser } = useStoreUser()
  const { storeListMessagesPins, listMessagesPins, storeCurrentChat } = useStoreListMessagesPins()
  const [displayName, setDisplayName] = useState(userInfo?.name || '')

  const [onSubmit, setOnSubmit] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [imageUI, setImageUI] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [onFetchingDetailUser, setOnFetchingDetailUser] = useState(false)
  const [storeAnotherUser, setStoreAnotherUser] = useState<any>(null)
  const isOwner = userInfo?.email === email
  const { storeListPinConversation, listPinConversation } = useStoreListPinConversation()

  const handleClickToChat = () => {
    const newPinMessage = {
      avatar: storeAnotherUser?.picture || '',
      email: storeAnotherUser?.email || '',
      id: storeAnotherUser?.id || storeAnotherUser?._id || '',
      message: storeAnotherUser?.email || '',
      name: storeAnotherUser?.displayName || '',
      time: storeAnotherUser?.createdAt || ''
    }

    const isItemExist = listMessagesPins.find((ping: any) => ping?.email === newPinMessage?.email)
    if (isItemExist) {
      //
      storeListMessagesPins([...listMessagesPins.filter((ping: any) => ping?.email !== newPinMessage?.email), isItemExist])
    } else {
      storeListMessagesPins([...listMessagesPins, newPinMessage] as any)
    }
    storeCurrentChat(newPinMessage as any)
  }

  const handleChangeAvatar = (event: any) => {
    const file = event.target.files[0]
    if (file) {
      setFile(file)
      const objectUrl = URL.createObjectURL(file)
      setImageUI(objectUrl)
    }

    event.target.value = ''
  }

  const handleSubmit = async () => {
    try {
      if (!isOwner) {
        Toast({
          type: 'error',
          message: 'You do not have permission to edit this profile'
        })
        return
      }
      if (!displayName || (displayName === userInfo?.name && file === null)) return
      const payload = {
        name: displayName,
        avatar: file
      }
      await instance.put(`/v1/users/${email}`, objectToFormData(payload))
      storeUser({ ...userInfo, name: displayName || '', picture: imageUI || null } as any)
      setFile(null)
      Toast({
        type: 'success',
        message: 'Update profile successfully'
      })
    } catch (error) {
      console.log(error)
    } finally {
      setOnSubmit(false)
    }
  }

  const handleFetchingDetailUser = async () => {
    if (isOwner) return
    try {
      const dataUser: any = await instance.get(`/v1/users/${email}`)
      setStoreAnotherUser(dataUser?.user)
    } catch (error) {
      console.log(error)
    } finally {
      setOnFetchingDetailUser(false)
    }
  }

  useEffect(() => {
    onSubmit && handleSubmit()
  }, [onSubmit])

  useEffect(() => {
    setDisplayName(userInfo?.name || '')
    setImageUI(userInfo?.picture || null)
  }, [userInfo?.name])

  // Cleanup object URL when component unmounts or imageUI changes
  useEffect(() => {
    return () => {
      if (imageUI && imageUI !== userInfo?.picture) {
        URL.revokeObjectURL(imageUI)
      }
    }
  }, [imageUI])

  useEffect(() => {
    if (isOwner) return
    if (!userInfo?.email) return

    if (onFetchingDetailUser) {
      handleFetchingDetailUser()
    }
  }, [onFetchingDetailUser, userInfo?.email])

  useEffect(() => {
    if (isOwner) return
    if (!userInfo?.email) return
    setOnFetchingDetailUser(true)
  }, [userInfo?.email])

  return (
    <WrapperLayout>
      {storeAnotherUser?.name === undefined ? (
        <div className='relative flex w-full flex-col items-center justify-center'>
          {/* Background decoration */}
          <div className='absolute inset-0 overflow-hidden'>
            <div className='h-72 absolute -right-4 -top-4 w-72 rounded-full bg-white/10 blur-3xl' />
            <div className='h-72 absolute -bottom-4 -left-4 w-72 rounded-full bg-white/10 blur-3xl' />
          </div>

          <div className='relative z-10 flex flex-col items-center gap-8'>
            {/* Main illustration */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className='h-64 relative mb-4 w-64'
            >
              <Warning2 size={256} className='text-white' />
            </motion.div>

            {/* Error message */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className='text-center text-4xl font-medium tracking-tight text-white md:text-5xl lg:text-6xl'
            >
              User not found
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className='max-w-md text-center text-lg text-white/80 md:text-xl'
            >
              We couldn&apos;t find the user you&apos;re looking for. They may have been deleted or never existed.
            </motion.p>

            {/* Action buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className='mt-4 flex flex-col gap-4 sm:flex-row'
            ></motion.div>
          </div>

          {/* Floating shapes */}
          <div className='pointer-events-none absolute inset-0'>
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className='h-2 absolute w-2 rounded-full bg-white/20'
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className='flex w-full max-w-md rounded-lg border border-white/20 bg-white/5 p-4 transition-colors hover:bg-white/10'>
          {!!userInfo ? (
            <div className='mx-auto flex w-full flex-col gap-6'>
              <div className='flex items-center justify-between'>
                <h1 className='text-2xl font-bold'>{isOwner ? 'Edit Profile' : `${storeAnotherUser?.name}'s Profile`}</h1>
                {!isOwner && (
                  <Button
                    onPress={handleClickToChat}
                    isIconOnly
                    variant='light'
                    className='flex !size-10 max-h-10 min-h-10 min-w-10 max-w-10 items-center justify-center rounded-full bg-white/10'
                  >
                    <Message size={24} className='text-white' />
                  </Button>
                )}
              </div>
              <div className='relative mx-auto size-[120px]'>
                {isOwner && <input accept='image/*' onChange={handleChangeAvatar} type='file' className='hidden' ref={fileInputRef} />}
                <ImageFallback
                  src={isOwner ? imageUI || '' : storeAnotherUser?.picture || ''}
                  alt='avatar'
                  className='size-full rounded-full border-2 border-white object-cover'
                  width={500}
                  height={500}
                />
                {isOwner && (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className='absolute bottom-0 right-0 z-40 flex size-8 items-center justify-center rounded-full bg-colorHeader py-2'
                  >
                    <Camera size={24} className='text-white' />
                  </div>
                )}
              </div>
              <div className='flex flex-col gap-4'>
                <Input
                  onKeyUp={(e) => {
                    if (e.key === 'Enter' && isOwner) {
                      setOnSubmit(true)
                    }
                  }}
                  maxLength={20}
                  variant='bordered'
                  label='Display Name'
                  labelPlacement='outside'
                  value={isOwner ? displayName : storeAnotherUser?.name}
                  onChange={(e) => isOwner && setDisplayName(e.target.value)}
                  readOnly={!isOwner}
                  classNames={{
                    input: 'placeholder:text-white',
                    inputWrapper: 'group-data-[focus=true]:border-white data-[hover=true]:border-white',
                    label: 'group-data-[filled-within=true]:text-white'
                  }}
                />

                <Input
                  variant='bordered'
                  readOnly
                  label='Email'
                  labelPlacement='outside'
                  value={isOwner ? email : storeAnotherUser?.email}
                  classNames={{
                    input: 'placeholder:text-white',
                    inputWrapper: 'group-data-[focus=true]:border-white border-1 data-[hover=true]:border-white',
                    label: 'group-data-[filled-within=true]:text-white'
                  }}
                />

                {isOwner && (
                  <Button
                    isLoading={onSubmit}
                    onClick={() => setOnSubmit(true)}
                    className='ml-auto mt-4 min-h-10 w-full bg-white text-blue-500 hover:bg-indigo-100'
                  >
                    Save
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <ProfileSkeleton />
          )}
        </div>
      )}
    </WrapperLayout>
  )
}

export default ProfilePage
