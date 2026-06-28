import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { X, Send, MessageSquare, Loader2, Paperclip, MoreVertical, ShieldCheck } from 'lucide-react'
import { clearChat } from '../App/features/chatSlice'
import { platformIcons } from '../assets/assets'
import { useAuth } from '@clerk/react'
import toast from 'react-hot-toast'

const ChatBox = () => {
  const dispatch = useDispatch()
  const { listing, isOpen, chatId: initialChatId } = useSelector((state) => state.chat)
  const { getToken, userId, isSignedIn } = useAuth()
  
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [activeChatId, setActiveChatId] = useState(initialChatId)
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
    if (isOpen && listing) {
      const initChat = async () => {
        setIsLoading(true);
        try {
          const token = await getToken();
          const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
          
          let cid = initialChatId;
          // If no initialChatId, find or create the chat on the backend
          if (!cid) {
            const chatRes = await fetch(`${BACKEND_URL}/api/chats`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ listingId: listing.id })
            });
            const chatData = await chatRes.json();
            if (chatData.success && chatData.chat) {
              cid = chatData.chat.id;
            }
          }
          
          setActiveChatId(cid);

          if (cid) {
            // Load messages
            const msgRes = await fetch(`${BACKEND_URL}/api/chats/${cid}/messages`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            const msgData = await msgRes.json();
            if (msgData.success) {
              setMessages(msgData.messages);
            }
          }
        } catch (error) {
          console.error("Error loading chat:", error);
        } finally {
          setIsLoading(false);
        }
      };
      initChat();
    } else {
      setMessages([]);
      setActiveChatId(null);
    }
  }, [isOpen, listing, initialChatId, getToken]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChatId) return;

    setIsSending(true);
    try {
      const token = await getToken();
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      const response = await fetch(`${BACKEND_URL}/api/chats/${activeChatId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: newMessage })
      });
      const data = await response.json();
      if (data.success) {
        setMessages(prev => [...prev, data.message]);
        setNewMessage("");
      } else {
        toast.error(data.message || "Failed to send message.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message.");
    } finally {
      setIsSending(false);
    }
  };

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
          messages.map((msg) => {
            const isPlatform = msg.sender_id === 'platform';
            if (isPlatform) {
              return (
                <div key={msg.id} className="flex justify-center my-2">
                  <div className="bg-gray-100 text-gray-600 rounded-lg px-4 py-2 text-xs text-center font-medium border border-gray-200/50 max-w-[90%] shadow-sm">
                    {msg.message}
                  </div>
                </div>
              );
            }
            const isSelf = msg.sender_id === userId;
            return (
              <div 
                key={msg.id} 
                className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm transition-all duration-200 ${
                    isSelf 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                  }`}
                >
                  <p className='leading-relaxed'>{msg.message}</p>
                  <p className={`text-[9px] mt-1.5 ${isSelf ? 'text-indigo-200 text-right' : 'text-gray-400'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })
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