
// // src/components/ChatWindow.jsx
// import React, { useState, useEffect, useRef } from "react";
// import SockJS from "sockjs-client";
// import { Client } from "@stomp/stompjs";
// import api from "../api/axiosInstance";

// export default function ChatWindow({ receiverId, receiverName, onClose }) {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [connected, setConnected] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const clientRef = useRef(null);
//   const messagesEndRef = useRef(null);
//   const inputRef = useRef(null);

//   const currentUserId = parseInt(localStorage.getItem("userId"));

//   // Fetch message history
//   useEffect(() => {
//     let mounted = true;
//     const fetchHistory = async () => {
//       try {
//         const res = await api.get(`/api/chat/conversation/${receiverId}`);
//         if (!mounted) return;
//         setMessages(res.data || []);
//       } catch (err) {
//         console.error("Failed to load chat history", err);
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     };
//     fetchHistory();
//     return () => {
//       mounted = false;
//     };
//   }, [receiverId]);

//   // Setup WebSocket connection
//   useEffect(() => {
//     if (!currentUserId) {
//       console.error("User ID not found");
//       return;
//     }

//     const socket = new SockJS(
//       `${import.meta.env.VITE_API_BASE || "http://localhost:8080"}/ws`
//     );

//     const client = new Client({
//       webSocketFactory: () => socket,
//       onConnect: () => {
//         console.log("Connected to WebSocket");
//         setConnected(true);

//         // Subscribe to personal queue
//         client.subscribe(`/queue/messages.${currentUserId}`, (message) => {
//           const received = JSON.parse(message.body);
//           setMessages((prev) => [...prev, received]);
//         });
//       },
//       onDisconnect: () => {
//         console.log("Disconnected from WebSocket");
//         setConnected(false);
//       },
//       onStompError: (frame) => {
//         console.error("STOMP error", frame);
//       },
//     });

//     client.activate();
//     clientRef.current = client;

//     return () => {
//       if (clientRef.current) {
//         clientRef.current.deactivate();
//       }
//     };
//   }, [currentUserId]);

//   // Auto-scroll to bottom when messages change
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // Keep input focused when chat opens
//   useEffect(() => {
//     inputRef.current?.focus();
//   }, []);

//   const sendMessage = () => {
//     if (!newMessage.trim() || !connected) return;

//     const payload = {
//       senderId: currentUserId,
//       receiverId: receiverId,
//       content: newMessage.trim(),
//     };

//     // Send via WebSocket (same as before)
//     if (clientRef.current && clientRef.current.connected) {
//       clientRef.current.publish({
//         destination: "/app/chat.send",
//         body: JSON.stringify(payload),
//       });
//     }

//     setNewMessage("");
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   return (
//     <div
//       className="fixed bottom-4 right-4 w-96 h-[520px] bg-white rounded-3xl shadow-2xl flex flex-col z-50 border border-gray-100 overflow-hidden"
//       role="dialog"
//       aria-label={`Chat with ${receiverName}`}
//     >
//       {/* Header */}
//       <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
//         <div>
//           <div className="flex items-center gap-2">
//             <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-sm font-semibold">
//               {receiverName ? receiverName.split(" ").map(s => s[0]).join("").slice(0,2) : "??"}
//             </div>
//             <div>
//               <div className="font-semibold text-sm">{receiverName}</div>
//               <div className="text-xs opacity-90" aria-live="polite">
//                 {connected ? "🟢 Connected" : "🔴 Disconnected"}
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="flex items-center gap-2">
//           <button
//             onClick={() => {
//               // preserve existing onClose behavior
//               if (onClose) onClose();
//             }}
//             className="text-white text-2xl hover:text-gray-200 focus:outline-none rounded-full p-1"
//             aria-label="Close chat"
//             title="Close"
//           >
//             ×
//           </button>
//         </div>
//       </div>

//       {/* Messages area */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
//         {loading ? (
//           <div className="text-center text-gray-500">Loading messages...</div>
//         ) : messages.length === 0 ? (
//           <div className="text-center text-gray-500">No messages yet. Start the conversation!</div>
//         ) : (
//           messages.map((msg, idx) => {
//             const isMe = msg.senderId === currentUserId;
//             return (
//               <div key={idx} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
//                 <div
//                   className={`max-w-[78%] p-3 rounded-2xl leading-relaxed text-sm ${
//                     isMe ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-800"
//                   }`}
//                 >
//                   <p className="whitespace-pre-wrap">{msg.content}</p>
//                   <div className="mt-2 text-xs opacity-70 text-right">
//                     {msg.sentAt ? new Date(msg.sentAt).toLocaleTimeString() : ""}
//                   </div>
//                 </div>
//               </div>
//             );
//           })
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input */}
//       <div className="p-3 border-t bg-white">
//         <div className="flex gap-2 items-end">
//           <textarea
//             ref={inputRef}
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             onKeyPress={handleKeyPress}
//             placeholder={connected ? "Type a message..." : "Connecting..."}
//             disabled={!connected}
//             className="flex-1 min-h-[44px] max-h-36 resize-y border-2 border-gray-200 rounded-2xl px-3 py-2 focus:ring-4 focus:ring-indigo-100 outline-none transition disabled:bg-gray-100"
//             aria-label="Message input"
//           />
//           <button
//             onClick={sendMessage}
//             disabled={!connected || !newMessage.trim()}
//             className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
//             aria-label="Send message"
//           >
//             Send
//           </button>
//         </div>
//         <div className="text-xs text-gray-400 mt-2">
//           Press <kbd className="px-1 py-0.5 bg-gray-100 border rounded">Enter</kbd> to send, <kbd className="px-1 py-0.5 bg-gray-100 border rounded">Shift</kbd>+<kbd className="px-1 py-0.5 bg-gray-100 border rounded">Enter</kbd> for newline.
//         </div>
//       </div>
//     </div>
//   );
// }

// src/components/ChatWindow.jsx
import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import api from "../api/axiosInstance";

export default function ChatWindow({ receiverId, receiverName, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const clientRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const currentUserId = parseInt(localStorage.getItem("userId"));

  // Fetch message history
  useEffect(() => {
    let mounted = true;
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/api/chat/conversation/${receiverId}`);
        if (!mounted) return;
        setMessages(res.data || []);
      } catch (err) {
        console.error("Failed to load chat history", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchHistory();
    return () => {
      mounted = false;
    };
  }, [receiverId]);

  // Setup WebSocket connection
  useEffect(() => {
    if (!currentUserId) {
      console.error("User ID not found");
      return;
    }

    const socket = new SockJS(
      `${import.meta.env.VITE_API_BASE || "http://localhost:8080"}/ws`
    );

    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log("Connected to WebSocket");
        setConnected(true);

        // Subscribe to personal queue
        client.subscribe(`/queue/messages.${currentUserId}`, (message) => {
          const received = JSON.parse(message.body);
          setMessages((prev) => [...prev, received]);
        });
      },
      onDisconnect: () => {
        console.log("Disconnected from WebSocket");
        setConnected(false);
      },
      onStompError: (frame) => {
        console.error("STOMP error", frame);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [currentUserId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Keep input focused when chat opens
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = () => {
    if (!newMessage.trim() || !connected) return;

    const payload = {
      senderId: currentUserId,
      receiverId: receiverId,
      content: newMessage.trim(),
    };

    // Send via WebSocket
    if (clientRef.current && clientRef.current.connected) {
      clientRef.current.publish({
        destination: "/app/chat.send",
        body: JSON.stringify(payload),
      });
    }

    setNewMessage("");
    setIsTyping(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    if (e.target.value.trim()) {
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return "??";
    return name.split(" ").map(s => s[0]).join("").slice(0, 2).toUpperCase();
  };

  return (
    <div
      className="fixed bottom-6 right-6 w-[420px] h-[600px] bg-white rounded-3xl shadow-2xl flex flex-col z-50 border-2 border-indigo-100 overflow-hidden animate-slideUp"
      role="dialog"
      aria-label={`Chat with ${receiverName}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative">
            <div className="w-11 h-11 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-base font-bold shadow-lg border-2 border-white/50">
              {getInitials(receiverName)}
            </div>
            {connected && (
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white shadow-md"></div>
            )}
          </div>

          {/* User Info */}
          <div>
            <div className="font-bold text-base">{receiverName}</div>
            <div className="text-xs opacity-90 flex items-center gap-1.5" aria-live="polite">
              <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></span>
              {connected ? "Online" : "Offline"}
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white text-2xl transition-all duration-300 hover:rotate-90 shadow-lg"
          aria-label="Close chat"
          title="Close"
        >
          ×
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-br from-gray-50 to-indigo-50/30">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="relative w-12 h-12 mx-auto mb-3">
                <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-600 font-medium">Loading messages...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-xs">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl">💬</span>
              </div>
              <p className="text-gray-600 font-semibold mb-1">No messages yet</p>
              <p className="text-gray-500 text-sm">Start the conversation!</p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.senderId === currentUserId;
            const showDate = idx === 0 || 
              new Date(messages[idx - 1].sentAt).toDateString() !== new Date(msg.sentAt).toDateString();
            
            return (
              <React.Fragment key={idx}>
                {/* Date Separator */}
                {showDate && msg.sentAt && (
                  <div className="flex items-center justify-center my-4">
                    <div className="bg-white px-4 py-1.5 rounded-full text-xs font-semibold text-gray-500 shadow-md border border-gray-200">
                      {new Date(msg.sentAt).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                )}

                {/* Message Bubble */}
                <div className={`flex ${isMe ? "justify-end" : "justify-start"} animate-messageSlide`}>
                  <div
                    className={`max-w-[75%] p-4 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl ${
                      isMe 
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none" 
                        : "bg-white border-2 border-gray-200 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed text-sm">{msg.content}</p>
                    <div className={`mt-2 text-xs flex items-center gap-1 ${isMe ? 'justify-end opacity-80' : 'justify-start opacity-60'}`}>
                      <span>
                        {msg.sentAt ? new Date(msg.sentAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : ""}
                      </span>
                      {isMe && (
                        <span className="text-xs">✓✓</span>
                      )}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t-2 border-gray-100 bg-white shadow-lg">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={newMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={connected ? "Type a message..." : "Connecting..."}
              disabled={!connected}
              rows="1"
              className="w-full min-h-[48px] max-h-32 resize-none border-2 border-gray-300 rounded-2xl px-4 py-3 focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed text-sm placeholder:text-gray-400"
              aria-label="Message input"
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!connected || !newMessage.trim()}
            className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
            aria-label="Send message"
            title="Send"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
              />
            </svg>
          </button>
        </div>
        
        {/* Keyboard Shortcuts Hint */}
        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-semibold shadow-sm">Enter</kbd>
            <span>to send</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-semibold shadow-sm">Shift</kbd>
            <span>+</span>
            <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-semibold shadow-sm">Enter</kbd>
            <span>for newline</span>
          </div>
        </div>
      </div>
    </div>
  );
}