import { useState, useEffect } from 'react';
import './App.css'
import io from 'socket.io-client'

//const socket = io('http://localhost:4000');
const socket = io();
function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([])

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit('message', message)
    const newMessage = {
      body: message,
      from: "Me"
    }
    setMessages([newMessage, ...messages ])
    setMessage('')
  }

  useEffect(() => {
    const receiveMessage = message => {
      setMessages([message, ...messages])
    }
    socket.on('message', receiveMessage)

    return () => {
      socket.off('message', receiveMessage)
    }
  }, [messages])

  return (
    <div className='h-screen bg-zinc-800 text-white flex items-center justify-center'>
      <form onSubmit={handleSubmit} className='bg-zinc-900 p-10'>
      <h1 className='text-2xl font-bold'>Chat React</h1>

        <input 
          type="text" 
          onChange={e => setMessage(e.target.value)}
          value={message}
          className='border-2 border-zinc-500 text-black p-2 w-full'
        />
        {/* <button className='bg-blue-500'>Send</button> */}

      <ul className='h-80 overflow-y-auto'>
      {
        messages.map( (message, index) => (
          <li 
            key={index} 
            className={`p-2 my-2 text-sm rounded-md table ${message.from === "Me" ? 'bg-sky-700 ml-auto' : 'bg-black'}`}>
            <p>{message.from}: {message.body}</p>
          </li>
        ))
      }
      </ul>
      </form>

    </div>
  )
}

export default App
