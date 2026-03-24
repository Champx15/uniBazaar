import { Client } from "@stomp/stompjs";
import conf from "./conf";

let stompClient = null;
let messageCallback = null;
let connectionCallback = null;
let currentUserId=null;

function initiateConnection(userId,onMessageReceived, onConnected) {
  currentUserId=userId;
  if (stompClient?.connected) {
    console.log("✓ WebSocket already connected");
    if (onConnected) onConnected();
    return;
  }

  messageCallback = onMessageReceived;
  connectionCallback = onConnected;

  console.log("🔧 conf.apiBase:", conf.apiBase);

  let wsURL;
  
  try {
    const apiUrl = new URL(conf.apiBase);
    const protocol = apiUrl.protocol === 'https:' ? 'wss:' : 'ws:';
    wsURL = `${protocol}//${apiUrl.host}${apiUrl.pathname}/ws`;
    console.log("🔧 WebSocket URL:", wsURL);
  } catch (error) {
    console.error("❌ Error parsing conf.apiBase:", error);
    return;
  }
  
  console.log("🔍 Current cookies:", document.cookie);

  stompClient = new Client({
    brokerURL: wsURL,
       connectHeaders: {
      'Accept-Language': 'en-US',
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,

    onConnect: () => {
      console.log("✅ WebSocket Connected");
      subscribeToMessages(currentUserId);
      if (connectionCallback) {
        console.log("🔧 Calling onConnected callback");
        connectionCallback();
      }
    },

    onDisconnect: () => {
      console.log("⚠️ WebSocket Disconnected");
    },

    onStompError: (frame) => {
      console.error("❌ STOMP Error:", frame);
    },

    onWebSocketError: (error) => {
      console.error("❌ WebSocket Error:", error);
    }
  });

  console.log("🔧 Activating STOMP client...");
  stompClient.activate();
}

function subscribeToMessages(currentUserId) {
  if (!stompClient?.connected) {
    console.error("❌ Cannot subscribe: WebSocket not connected");
    return;
  }

  console.log("📌 Subscribing to /user/queue/messages");
  
  stompClient.subscribe(`/user/${currentUserId}/queue/messages`, (frame) => {
    console.log("🎉 CALLBACK FIRED");
    try {
      console.log("📥 Raw frame received:", frame.body);
      
      const message = JSON.parse(frame.body);
      console.log("📨 Parsed message:", message);
      console.log("📨 Message senderId:", message.senderId);
      console.log("📨 Message receiverId:", message.receiverId);
      console.log("📨 Message text:", message.message);
      
      if (messageCallback) {
        console.log("🔄 Calling messageCallback with:", message);
        messageCallback(message);
        console.log("✅ messageCallback executed");
      } else {
        console.error("❌ messageCallback is null!");
      }
    } catch (error) {
      console.error("❌ Error parsing message:", error);
      console.error("❌ Raw body was:", frame.body);
    }
  });
  
  console.log("✅ Subscription successful");
}

function sendMessage(messageData) {
  console.log("📤 Attempting to send:", messageData);
  
  if (!stompClient?.connected) {
    console.error("❌ WebSocket not connected");
    return false;
  }

  try {
    const payload = {
      senderId: messageData.senderId,
      receiverId: messageData.receiverId,
      message: messageData.message,
    };

    console.log("📤 Publishing to /app/chat:", payload);
    
    stompClient.publish({
      destination: "/app/chat",
      body: JSON.stringify(payload),
    });
    
    console.log("✅ Message published");
    return true;
  } catch (error) {
    console.error("❌ Error sending:", error);
    return false;
  }
}

function disconnect() {
  if (stompClient?.connected) {
    stompClient.deactivate();
    console.log("WebSocket disconnected");
  }
}

function isConnected() {
  return stompClient?.connected || false;
}

export { initiateConnection, sendMessage, disconnect, isConnected,subscribeToMessages };