import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router";
import messageService from "../service/messageService";
import { useAuth } from "../context/AuthContext/AuthContext";
import MobileHeader from "../components/MobileHeader";
import { Flag } from "lucide-react";
import ReportModal from "../components/ReportModal";
import {
  initiateConnection,
  sendMessage,
  disconnect,
  subscribeToMessages,
} from "../conf/websocket";

export default function MessagePage({ isMobile }) {
  const location = useLocation();
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [newChatPending, setNewChatPending] = useState(false);
  const [pendingSellerData, setPendingSellerData] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const messagesEndRef = useRef(null);


  // Get state passed from product detail page
  const navigationState = location.state;

  // Compute selectedChat from chats array
  const selectedChat = chats.find((c) => c.conversationId === selectedChatId);

  useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);

  // Debug: Log when selectedChat changes
  useEffect(() => {
    console.log("🔍 selectedChat changed:", selectedChat);
  }, [selectedChat]);

  // Debug: Log when messages change
  useEffect(() => {
    console.log("🔍 messages state updated:", messages);
  }, [messages]);

  // ⭐ Use useRef to store callback so it always has access to current state
  const handleMessageReceivedRef = useRef(null);

  // Update the callback whenever relevant state changes
  useEffect(() => {
    console.log("🔧 Updating handleMessageReceivedRef");
    console.log("🔧 Current selectedChatId:", selectedChatId);
    console.log("🔧 Current selectedChat:", selectedChat);
    console.log("🔧 Current pendingSellerData:", pendingSellerData);

    handleMessageReceivedRef.current = (incomingMessage) => {
      console.log("🎯 handleMessageReceivedRef called with:", incomingMessage);
      console.log("🎯 Current selectedChatId in callback:", selectedChatId);
      console.log("🎯 Current selectedChat in callback:", selectedChat);

      if (incomingMessage.senderId === user?.id) {
        console.log(
          "⚠️ This is MY message, skipping (already added optimistically)",
        );
        return;
      }

      // Get current selectedChat from the current state
      const currentSelectedChat = chats.find(
        (c) => c.conversationId === selectedChatId,
      );
      console.log("🎯 Found currentSelectedChat:", currentSelectedChat);

      // Check if this message is for the current chat
      const isForCurrentChat =
        incomingMessage.senderId === currentSelectedChat?.otherUserId;
      const isForPendingChat =
        incomingMessage.senderId === pendingSellerData?.sellerId;

      console.log("🎯 isForCurrentChat:", isForCurrentChat);
      console.log("🎯 isForPendingChat:", isForPendingChat);

      // Add the message to current chat if it's from the selected conversation
      if (isForCurrentChat || isForPendingChat) {
        console.log("✅ Adding message to messages state");
        setMessages((prevMessages) => {
          const updated = [...prevMessages, incomingMessage];
          console.log("✅ Messages updated. New length:", updated.length);
          console.log("✅ New messages:", updated);
          return updated;
        });
            if (selectedChatId) {
      console.log("📌 Marking message as read since chat is open");
      messageService.markAsRead({ 
        userId: user.id, 
        conversationId: selectedChatId 
      }).catch(err => console.error("Failed to mark as read:", err));
    }
      } else {
        console.log(
          "⚠️ Message is not for current chat, updating chat list only",
        );
      }
      

      // Update chat list with new message preview and timestamp
      console.log("🔄 Updating chat list");
      setChats((prevChats) => {
  const updated = prevChats.map((chat) => {
    if (chat.otherUserId === incomingMessage.senderId) {
      return {
        ...chat,
        lastMessage: incomingMessage.message || incomingMessage.messageText,
        timestamp: new Date().toISOString(),
        unReadCount: 0,
      };
    }
    return chat;
  });
  
  // ⭐ Sort after updating
  return updated.sort((a, b) => {
    const timeA = new Date(a.timestamp).getTime();
    const timeB = new Date(b.timestamp).getTime();
    return timeB - timeA;  // Most recent first
  });
});
    };

    console.log("✅ handleMessageReceivedRef updated");
  }, [selectedChatId, pendingSellerData, chats]);

  // Initialize WebSocket once on component mount
  useEffect(() => {
    console.log("🚀 Initializing WebSocket (mount)");

    // Initiate WebSocket connection with the callback ref
    initiateConnection(user?.id, (msg) => {
      console.log("📡 WebSocket callback triggered with:", msg);
      if (handleMessageReceivedRef.current) {
        console.log("📡 Calling handleMessageReceivedRef.current");
        handleMessageReceivedRef.current(msg);
      } else {
        console.error("📡 handleMessageReceivedRef.current is null!");
      }
    });
  }, []); // Empty array - only run once on mount

  const fetchChats = async () => {
    setLoading(true);
    try {
      const chatsData = await messageService.getInbox();
      console.log("📥 Fetched chats:", chatsData);
          const sortedChats = chatsData.sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return timeB - timeA;  // Descending order
    });
      setChats(chatsData);
      return chatsData;
    } catch (error) {
      console.error("Failed to fetch chats:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  // Handle auto-open chat with seller when coming from product detail page
  useEffect(() => {
    if (navigationState?.sellerId) {
      const initializeChat = async () => {
        const latestChats = await fetchChats();

        const sellerChat = latestChats.find(
          (c) => c.otherUserId === navigationState.sellerId,
        );

        if (sellerChat) {
          handleSelectChat(sellerChat.conversationId);
          if (navigationState.autoMessage) {
            setMessageText(navigationState.autoMessage);
          }
          setNewChatPending(false);
        } else {
          setNewChatPending(true);
          setPendingSellerData(navigationState);
          if (navigationState.autoMessage) {
            setMessageText(navigationState.autoMessage);
          }
        }
      };

      initializeChat();
    }
  }, [navigationState]);

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return "now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    try {
      let recipientId;

      if (selectedChat) {
        recipientId = selectedChat.otherUserId;
      } else if (newChatPending && pendingSellerData) {
        recipientId = pendingSellerData.sellerId;
      } else {
        console.error("No recipient found");
        return;
      }

      const messageToAdd = messageText;
      setMessageText("");

      console.log("📤 Sending message to:", recipientId);

      // Always use REST API for reliable message saving
      await messageService.sendMessage({
        sellerId: user.id,
        recipient: recipientId,
        message: messageToAdd,
      });

      // Also send via WebSocket if connected (for real-time delivery to recipient)
      sendMessage({
        senderId: user.id,
        receiverId: recipientId,
        message: messageToAdd,
      });

      // Add message optimistically to local state
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now(),
          senderId: user.id,
          messageText: messageToAdd,
          timestamp: new Date().toISOString(),
        },
      ]);

      // Refresh chats list
      const updatedChats = await fetchChats();
      setChats(updatedChats);

      // If this was a new chat, find and select it
      if (newChatPending) {
        const newChat = updatedChats.find((c) => c.otherUserId === recipientId);
        if (newChat) {
          setSelectedChatId(newChat.conversationId);
          setNewChatPending(false);
          setPendingSellerData(null);
          const msgs = await messageService.getMessage({
            otherUserId: recipientId,
          });
          setMessages(msgs);
        }
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleSelectChat = async (conversationId) => {
    console.log("🎯 Selecting chat:", conversationId);
    setSelectedChatId(conversationId);
    setNewChatPending(false);
    setPendingSellerData(null);
    try {
      await messageService.markAsRead({ userId: user.id, conversationId });
          setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.conversationId === conversationId
          ? { ...chat, unReadCount: 0 }  // ← Set to 0
          : chat
      )
    );
      const chat = chats.find((c) => c.conversationId === conversationId);
      const otherUserId = chat.otherUserId;
      const msgs = await messageService.getMessage({ otherUserId });
      console.log("📥 Loaded messages for chat:", msgs);
      setMessages(msgs);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const getInitials = (name) =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2);

  const renderChatDetailView = () => {
    if (!selectedChat && !newChatPending) return null;

    const displayName =
      selectedChat?.name || pendingSellerData?.sellerName || "User";
    const displayPfImage = selectedChat?.pfImageUrl;
    const displayTitle =
      selectedChat?.name || pendingSellerData?.sellerName || "New Chat";
    const productTitle =
      selectedChat?.title || pendingSellerData?.listingTitle || "";

    return (
      <div className="flex flex-col flex-1 min-h-0 bg-white">
        {/* Chat header */}
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-gray-200 bg-blue-50 flex-shrink-0">
          {isMobile && (
            <button
              onClick={() => {
                setSelectedChatId(null);
                setNewChatPending(false);
                setPendingSellerData(null);
              }}
              className="bg-none border-none text-2xl cursor-pointer text-blue-600 p-0"
            >
              ←
            </button>
          )}
          {displayPfImage ? (
            <img
              src={displayPfImage}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 md:w-12 md:h-12 md:text-xl rounded-full bg-blue-500 text-white flex items-center justify-center font-bold flex-shrink-0">
              {getInitials(displayName)}
            </div>
          )}
          <div className="flex-1">
            <div className="font-bold text-sm md:text-lg text-gray-900">
              {displayTitle}
            </div>
            {productTitle && (
              <div className="text-xs text-gray-500 mt-0.5">{productTitle}</div>
            )}
            {newChatPending && (
              <div className="text-xs text-orange-600 mt-0.5">
                New conversation
              </div>
            )}
          </div>
          {/* Report button */}
          <button onClick={() => setShowReportModal(true)}
            className="cursor-pointer">
            <Flag className="md:mr-5 w-5 h-5 md:w-7 md:h-7" />
          </button>
          {showReportModal && (
            <ReportModal
              isOpen={showReportModal}
              onClose={() => setShowReportModal(false)}
              type="user"
              id={selectedChat?.otherUserId}
            />
          )}
        </div>

        {/* Messages area */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4.5 py-3 flex flex-col gap-3">
          {messages.length === 0 && !newChatPending ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <div className="text-4xl mb-2">💬</div>
                <div className="text-sm">No messages yet</div>
              </div>
            </div>
          ) : (
            messages.map((msg) => {
              const isMyMessage = msg.senderId === user?.id;
              return (
                <div
                  key={msg.id}
                  className={`flex ${
                    isMyMessage ? "justify-end" : "justify-start"
                  } items-end gap-2`}
                >
                  <div
                    className={`max-w-[70%] px-3.5 py-2.5 rounded-2xl text-sm md:text-lg ${
                      isMyMessage
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    {msg.messageText || msg.message}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div
          className={`px-4 py-3 border-t border-gray-200 flex gap-2 items-end flex-shrink-0 bg-white ${
            isMobile ? "pb-20" : ""
          }`}
        >
          <input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-3.5 py-2.5 border md:text-lg border-gray-200 rounded-full text-sm outline-none text-gray-900"
          />
          <button
            onClick={handleSendMessage}
            className={`w-9 h-9 md:w-12 md:h-12 rounded-full flex items-center justify-center text-lg transition-all ${
              messageText.trim()
                ? "bg-blue-600 text-white cursor-pointer hover:bg-blue-700"
                : "bg-gray-100 text-gray-500 cursor-default"
            }`}
          >
            ↗
          </button>
        </div>
      </div>
    );
  };

  // Mobile shell
  if (isMobile) {
    if (selectedChatId || newChatPending) {
      return (
        <div className="fixed inset-0 top-0 left-0 right-0 bottom-0 z-10 flex flex-col bg-white">
          {renderChatDetailView()}
        </div>
      );
    }

    return (
      <div className="flex flex-col h-screen">
        <div className="flex-1 overflow-y-auto">
          <MobileHeader title="💬 Messages" />

          <div className="px-4 pt-4">
            {chats.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">💭</div>
                <div className="text-sm text-gray-500">No messages yet</div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {chats.map((chat) => (
                  <div
                    key={chat.conversationId}
                    onClick={() => handleSelectChat(chat.conversationId)}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer mb-2 relative ${
                      selectedChatId === chat.conversationId
                        ? `bg-blue-50 border-2 border-blue-600`
                        : "bg-white border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {/* Profile image */}
                    {chat.pfImageUrl ? (
                      <img
                        src={chat.pfImageUrl}
                        className="w-11 h-11 rounded-full object-cover flex-shrink-0 "
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                        {getInitials(chat.name)}
                      </div>
                    )}

                    {/* Chat info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-gray-900 mb-0.5">
                        {chat.name}
                      </div>
                      <div className="text-xs text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap">
                        {chat.lastMessage}
                      </div>
                    </div>

                    {/* ⭐ Unread badge */}
                    {chat.unReadCount > 0 && (
                      <div className="flex items-center justify-center min-w-[24px] h-6 w-6 px-2 bg-red-500 text-white rounded-full text-xs font-bold">
                        {chat.unReadCount > 99 ? "99+" : chat.unReadCount}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Desktop shell
  return (
    <div className="flex h-screen">
      <main className="flex-1 flex h-screen bg-[##f9fafb] overflow-hidden">
        {/* Chat list */}
        <div className="w-96 border-r border-gray-200 overflow-y-auto flex flex-col flex-shrink-0">
          <div className="px-5 py-6 border-b border-gray-200">
            <div className="text-xl font-extrabold text-gray-900">
              💬 Messages
            </div>
          </div>

          {loading ? (
            <div className="p-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-xl mb-2 bg-white border border-gray-200 animate-pulse"
                >
                  <div className="w-11 h-11 rounded-full bg-gray-300 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : chats.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-8">
              <div className="text-5xl mb-3">💭</div>
              <div className="text-sm text-gray-500">No messages yet</div>
            </div>
          ) : (
            <div className="p-3">
              {chats.map((chat) => (
                <div
                  key={chat.conversationId}
                  onClick={() => handleSelectChat(chat.conversationId)}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer mb-2 relative ${
                    selectedChatId === chat.conversationId
                      ? `bg-blue-50 border-2 border-blue-600`
                      : "bg-white border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {chat.pfImageUrl ? (
                    <img
                      src={chat.pfImageUrl}
                      className="w-11 h-11 md:w-13 md:h-13 rounded-full object-cover flex-shrink-0 "
                    />
                  ) : (
                    <div className="w-11 h-11 md:w-13 md:h-13 md:text-xl rounded-full bg-blue-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                      {getInitials(chat.name)}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm md:text-[16px] text-gray-900 mb-0.5">
                      {chat.name}
                    </div>
                    <div className="text-xs text-gray-400 md:text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                      {chat.lastMessage}
                    </div>
                  </div>

                  {/* ⭐ Add badge here for desktop */}
                  {chat.unReadCount > 0 && (
                    <div className="flex items-center justify-center min-w-[24px] h-6 w-6 px-2 bg-blue-500 text-white rounded-full text-sm font-bold flex-shrink-0">
                      {chat.unReadCount > 99 ? "99+" : chat.unReadCount}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chat detail */}
        {selectedChatId || newChatPending ? (
          renderChatDetailView()
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-6xl mb-3">💬</div>
              <div className="text-base text-gray-500">
                Select a chat to start messaging
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
