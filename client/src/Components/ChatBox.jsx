import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { X, Send, MessageSquare, Loader2, Paperclip, MoreVertical, ShieldCheck } from 'lucide-react'
import { clearChat } from '../App/features/chatSlice'
import { platformIcons } from '../assets/assets'

const ChatBox = () => {
  const dispatch = useDispatch()
  const { listing, isOpen } = useSelector((state) => state.chat)
  
  // Mock user for UI demonstration
  const user = { id: 'user_2', name: 'Sophia Lee' }
  
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  
  const scrollRef = useRef(null)

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      const loadMessages = async () => {
        setIsLoading(true)
        // Mock API delay
        await new Promise(resolve => setTimeout(resolve, 800))
        setMessages([
          {
            id: 'm1',
            sender_id: 'user_1',
            message: `Hi! I saw your ${listing?.platform} listing "${listing?.title}". Is it still available?`,
            createdAt: new Date(Date.now() - 3600000).toISOString()
          },
          {
            id: 'm2',
            sender_id: 'user_2',
            message: "Yes, it is! I have several people interested but no deposit yet.",
            createdAt: new Date(Date.now() - 1800000).toISOString()
          }
        ])
        setIsLoading(false)
      }
      loadMessages()
    } else {
      setMessages([])
    }
  }, [isOpen, listing])

  const handleSend = (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    setIsSending(true)
    
    // Mock sending delay
    setTimeout(() => {
      const msg = {
        id: Date.now().toString(),
        sender_id: user.id,
        message: newMessage,
        createdAt: new Date().toISOString()
      }
      setMessages(prev => [...prev, msg])
      setNewMessage("")
      setIsSending(false)
    }, 400)
  }

  if (!isOpen) return null

  return (
    <div className='fixed bottom-5 right-5 w-[380px] h-[550px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col z-50 overflow-hidden transition-all duration-300 transform animate-in slide-in-from-bottom-5'>
      
      {/* Header */}
      <div className='bg-indigo-600 p-4 text-white flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='bg-white/20 p-1.5 rounded-lg'>
            {listing && platformIcons[listing.platform] ? (
               React.cloneElement(platformIcons[listing.platform], { className: 'size-5' })
            ) : (
              <MessageSquare className='size-5 text-white' />
            )}
          </div>
          <div>
            <h4 className='text-sm font-semibold truncate w-44'>{listing?.title || 'Chat'}</h4>
            <div className='flex items-center gap-1'>
              <div className='w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse'></div>
              <p className='text-[10px] text-indigo-100 uppercase tracking-wider font-medium'>Online</p>
            </div>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <button className='hover:bg-white/10 p-1.5 rounded-full transition'>
            <MoreVertical className='size-4' />
          </button>
          <button 
            onClick={() => dispatch(clearChat())}
            className='hover:bg-white/10 p-1.5 rounded-full transition'
          >
            <X className='size-5' />
          </button>
        </div>
      </div>

      {/* Safety Alert */}
      <div className='bg-amber-50 border-b border-amber-100 px-4 py-2 flex items-center gap-2'>
        <ShieldCheck className='size-3 text-amber-600' />
        <p className='text-[10px] text-amber-700 font-medium'>
          Keep transactions on-platform for 100% protection.
        </p>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className='flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 custom-scrollbar'
      >
        {isLoading ? (
          <div className='h-full flex flex-col items-center justify-center space-y-2 opacity-50'>
            <Loader2 className='size-8 animate-spin text-indigo-600' />
            <p className='text-xs font-medium text-gray-500'>Loading conversation...</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm transition-all duration-200 ${
                  msg.sender_id === user.id 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                }`}
              >
                <p className='leading-relaxed'>{msg.message}</p>
                <p className={`text-[9px] mt-1.5 ${msg.sender_id === user.id ? 'text-indigo-200 text-right' : 'text-gray-400'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      <div className='p-4 bg-white border-t border-gray-100'>
        <form onSubmit={handleSend} className='flex items-center gap-2'>
          <button type='button' className='text-gray-400 hover:text-indigo-600 p-1.5 transition'>
            <Paperclip className='size-5' />
          </button>
          <div className='flex-1 relative'>
            <input 
              type='text' 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder='Type a message...'
              className='w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all'
            />
          </div>
          <button 
            type='submit'
            disabled={!newMessage.trim() || isSending}
            className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
              !newMessage.trim() || isSending 
                ? 'bg-gray-100 text-gray-400' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200'
            }`}
          >
            {isSending ? <Loader2 className='size-5 animate-spin' /> : <Send className='size-5' />}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatBox