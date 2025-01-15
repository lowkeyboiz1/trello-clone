'use client'

import { useStoreBoard, useStoreUser } from '@/store'
import { NextUIProvider } from '@nextui-org/react'
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { SocketProvider } from './SocketProvider'

function Providers({ children }: { children: React.ReactNode }) {
  const [onFetching, setOnFetching] = useState(false)
  const { userInfo } = useStoreUser()
  const { fetchAllBoards, boardsRecent, boardsStar, allBoards } = useStoreBoard()
  const accessToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') || '' : ''

  const handleFetchAllBoards = async () => {
    try {
      if (!accessToken || !userInfo?.email) return

      if (allBoards !== undefined) return
      await fetchAllBoards()
    } catch (error) {
      console.error(error)
    } finally {
      setOnFetching(false)
    }
  }
  useEffect(() => {
    setOnFetching(true)
  }, [accessToken, userInfo?.email, boardsRecent, boardsStar, allBoards])

  useEffect(() => {
    onFetching && handleFetchAllBoards()
  }, [onFetching, accessToken, userInfo?.email, boardsRecent, boardsStar, allBoards])

  return (
    <NextUIProvider>
      <NextThemesProvider attribute='class' defaultTheme='light'>
        <SocketProvider token={accessToken}>{children}</SocketProvider>
        <ProgressBar height='4px' color='#fff' options={{ showSpinner: true }} shallowRouting />
        <ToastContainer />
      </NextThemesProvider>
    </NextUIProvider>
  )
}

export default Providers
