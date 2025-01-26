import { createContext, useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { useAuth } from "./authContext";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { currentUser } = useAuth();

  const socket = useRef(null);

  useEffect(() => {
    socket.current = io(`${import.meta.env.VITE_API_URL}`);

    socket.current.on("connect", () => {
      console.log("Connected to server");
    });

    socket.current.on("new message", (message) => {
      console.log("Received new message: ", message);
      setConversations((prevConversations) => {
        return prevConversations.map((convo) => {
          if (convo.id === message.conversationId) {
            return { ...convo, lastMessage: message };
          }
          return convo;
        });
      });

      if (message.conversationId === activeConversation) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    if (activeConversation) {
      socket.current.emit("join-conversation", activeConversation);
    }

    fetchConversations();
    if (activeConversation) {
      fetchMessages(activeConversation);
    }

    return () => {
      socket.current.off("connect");
      socket.current.off("new message");
      socket.current.off("proposal-updated");
      if (activeConversation) {
        socket.current.emit("leave-conversation", activeConversation);
      }
      socket.current.disconnect("disconnect");
    };
  }, [activeConversation, currentUser]);

  const fetchConversations = async () => {
    try {
      // setIsLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/conversations/${
          currentUser?.userType
        }`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const data = await response.json();
      setConversations(data);
      console.log("Conversations fetched: ", data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      // setIsLoading(false);
    }
  };

  const setInitialActiveConversation = (conversationId) => {
    setActiveConversation(conversationId);
  };

  const handleSelectConversation = (id) => {
    console.log("Selected conversation:", id);
    setActiveConversation(id);
  };

  const handleSendMessage = async (text) => {
    console.log("Current user in handleSendMessage: ", currentUser);
    console.log(
      "Sending message...",
      text,
      currentUser._id,
      activeConversation
    );
    const currentUserId = currentUser?._id || currentUser?.id;

    if (activeConversation) {
      const message = {
        conversationId: activeConversation,
        sender: currentUserId,
        text: text,
      };

      return new Promise((resolve, reject) => {
        socket.current.emit("send-message", message, (error) => {
          if (error) {
            console.error("Error sending message:", error);
            reject(error);
          } else {
            console.log("Message sent successfully");
            resolve();
          }
        });
      });
    } else {
      console.error("No active conversation found");
    }
  };

  const fetchMessages = async (conversationId) => {
    const response = await fetch(
      `${
        import.meta.env.VITE_API_URL
      }/api/conversations/${conversationId}/messages`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    const data = await response.json();
    setMessages(data);
    console.log("Messages fetched: ", data);
  };

  const handleUserSelect = async (userId) => {
    if (userId === currentUser.id) {
      console.error("Cannot open a conversation with yourself");
      return;
    }

    function findConversationId(conversations, sender, reciever) {
      for (const conversation of conversations) {
        const participantIds = conversation.participants.map((p) => p._id);
        if (
          participantIds.includes(sender) &&
          participantIds.includes(reciever)
        ) {
          return conversation._id;
        }
      }
      return null;
    }

    const conversationId = findConversationId(
      conversations,
      userId,
      currentUser.id
    );

    if (conversationId !== null) {
      setActiveConversation(conversationId);
    } else {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/conversations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ participant: userId }),
        }
      );
      const newConversation = await response.json();
      setConversations([...conversations, newConversation]);
      setActiveConversation(() => {
        console.log(
          "Setting new conversation as active conversation: ",
          newConversation._id
        );
        return newConversation._id;
      });

      console.log(
        "New conversation set as active conversation: ",
        activeConversation
      );
    }
  };

  function checkConversationExists(userId, currentUserId) {
    const conversation = conversations.find((conversation) =>
      [userId, currentUserId].every((id) =>
        conversation.participants.some((participant) => participant._id === id)
      )
    );
    return conversation ? conversation._id : null;
  }

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversation,
        setActiveConversation,
        checkConversationExists,
        messages,
        currentUser,
        handleSelectConversation,
        handleSendMessage,
        fetchConversations,
        isLoading,
        setIsLoading,
        handleUserSelect,
        setInitialActiveConversation,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
