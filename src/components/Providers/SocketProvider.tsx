import { createContext, useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'

const SocketContext = createContext({})

export const useSocket = () => useContext(SocketContext)

export const SocketProvider = ({ children, token }: { children: React.ReactNode; token: string }) => {
  const [socket, setSocket] = useState<any>(null)

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_API_URL || '', {
      query: { token },
      reconnection: true,
      autoConnect: true,
    })

    setSocket(newSocket)
    const handleConnectSocket = () => {
      newSocket.connect()
    }

    document.addEventListener('visibilitychange', () => handleConnectSocket())
    window.addEventListener('blur', () => handleConnectSocket())
    window.addEventListener('focus', () => handleConnectSocket())

    return () => {
      newSocket.disconnect()
      document.addEventListener('visibilitychange', () => handleConnectSocket())
      window.addEventListener('blur', () => handleConnectSocket())
      window.addEventListener('focus', () => handleConnectSocket())
    }
  }, [token])

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
}
