'use client'

import { useSocket } from '@/components/Providers/SocketProvider'
import React, { useState, useEffect } from 'react'

const App = () => {
  const [username, setUsername] = useState('')
  const [receiver, setReceiver] = useState('')
  const [message, setMessage] = useState('')
  const [chat, setChat] = useState<{ sender: string; message: string; type: 'private' }[]>([])

  const socket: any = useSocket()
  useEffect(() => {
    // Listen for private messages
    if (!socket) return
    socket.on('receive-private-message', ({ sender, message }: { sender: string; message: string }) => {
      setChat((prevChat) => [...prevChat, { sender, message, type: 'private' }])
    })

    return () => {
      socket.off('receive-private-message')
    }
  }, [socket])

  const registerUser = () => {
    socket.emit('register', username) // Register the user with their username
  }

  const sendPrivateMessage = () => {
    socket.emit('send-private-message', { sender: username, receiver, message })
    setChat((prevChat) => [...prevChat, { sender: username, message, type: 'private' }])
    setMessage('') // Clear the message input field
  }

  return (
    <div>
      <h1>Private Messaging</h1>

      {/* User Registration */}
      <div>
        <input type='text' placeholder='Enter your username' value={username} onChange={(e) => setUsername(e.target.value)} />
        <button onClick={registerUser}>Register</button>
      </div>

      {/* Private Message Form */}
      <div>
        <input type='text' placeholder="Receiver's username" value={receiver} onChange={(e) => setReceiver(e.target.value)} />
        <input type='text' placeholder='Message' value={message} onChange={(e) => setMessage(e.target.value)} />
        <button onClick={sendPrivateMessage}>Send Private Message</button>
      </div>

      {/* Chat Messages */}
      <div>
        <h2>Messages</h2>
        {chat.map((msg, index) => (
          <div key={index} style={{ color: msg.type === 'private' ? 'green' : 'blue' }}>
            <strong>{msg.sender}:</strong> {msg.message}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
