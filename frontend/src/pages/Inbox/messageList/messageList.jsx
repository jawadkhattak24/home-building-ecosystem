import { useEffect, useState, useRef, useContext, useCallback } from "react";
// import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./styles/messageList.module.scss";
import PropTypes from "prop-types";
import { ChatContext } from "../../../contexts/chatContext";

function MessageList({
  currentUser,
  conversations,
  //   conversationId,
  activeConversation,
  //   handleNegotiation,
  messages,
  placeholderUI,
  setActiveConvo,
  activeConvo,
  otherUser,
  setOtherUser,
}) {
  //   const { handleProposalChanges } = useContext(ChatContext);
  const messageListRef = useRef(null);
  const [error, setError] = useState(null);

  const currentUserId = currentUser?._id || currentUser?.id;

  useEffect(() => {
    if (conversations && conversations.length > 0 && currentUserId) {
      const activeConvo = conversations.find(
        (convo) => convo._id === activeConversation
      );

      console.log("activeConvo", activeConvo);

      setActiveConvo(activeConvo);

      if (activeConvo) {
        const other = activeConvo.participants.find(
          (participant) => participant._id !== currentUserId
        );
        if (other) {
          setOtherUser(other);
        }
      }
    } else {
      console.log("Missing required data");
    }
  }, [conversations, currentUserId, activeConversation]);

  useEffect(() => {
    if (activeConversation && currentUserId) {
      const other = activeConversation?.participants?.find(
        (participant) => participant._id !== currentUserId
      );
      setOtherUser(other || null);
    }
  }, [activeConversation, currentUserId]);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  console.log("activeConversation", activeConversation);

  if (!activeConversation) {
    return placeholderUI();
  }

  console.log("otherUser in MessageList", otherUser);

  return (
    otherUser && (
      <div className={styles.leftSideContainer}>
        <div className={styles.messagesWrapper}>
          <div className={styles.receiptNameBar}>
            <Link
              to={`/${
                otherUser.userType === "homeowner"
                  ? `homeowner-profile/${otherUser._id}`
                  : otherUser.userType === "professional"
                  ? `professional-profile/${otherUser.userId}`
                  : `supplier-profile/${otherUser._id}`
              }`}
            >
              <h2 className={styles.receiptName}>
                {otherUser.userType === "supplier"
                  ? otherUser.businessName
                  : otherUser.name || "Unknown User"}
              </h2>
            </Link>
          </div>
          <div className={styles.message_list} ref={messageListRef}>
            <div className={styles.main_message_content_container}>
              {messages.map((message) => {
                const messageDate = new Date(message.timestamp);
                const currentDate = new Date();

                const messageDateOnly = new Date(
                  messageDate.getFullYear(),
                  messageDate.getMonth(),
                  messageDate.getDate()
                );
                const currentDateOnly = new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  currentDate.getDate()
                );

                const isToday =
                  messageDateOnly.getTime() === currentDateOnly.getTime();
                const isYesterday =
                  messageDateOnly.getTime() ===
                  currentDateOnly.getTime() - 24 * 60 * 60 * 1000;

                const timeString = messageDate.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                });

                let displayDateTime;
                if (isToday) {
                  displayDateTime = timeString;
                } else if (isYesterday) {
                  displayDateTime = `Yesterday ${timeString}`;
                } else {
                  const dateString = messageDate.toLocaleDateString();
                  displayDateTime = `${dateString} ${timeString}`;
                }

                return (
                  <div className={styles.main_cont_msg} key={message._id}>
                    <div
                      className={` ${styles.chatBubble} ${
                        message.sender === currentUserId
                          ? styles.sent
                          : styles.received
                      }`}
                    >
                      {message.content}
                      <p
                        className={`${
                          message.sender === currentUserId
                            ? styles.sentTimestamp
                            : styles.receivedTimestamp
                        }`}
                      >
                        {displayDateTime}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default MessageList;

MessageList.propTypes = {
  currentUser: PropTypes.object.isRequired,
  conversations: PropTypes.array.isRequired,
  activeConversation: PropTypes.string.isRequired,
  messages: PropTypes.array.isRequired,
  conversationId: PropTypes.string.isRequired,
  handleNegotiation: PropTypes.func.isRequired,
  placeholderUI: PropTypes.func.isRequired,
};
