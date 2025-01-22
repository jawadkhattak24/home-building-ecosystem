import { useEffect, useState, useRef, useContext, useCallback } from "react";
// import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./styles/messageList.module.scss";
import PropTypes from "prop-types";
// import { ProposalSection } from "../../pages/Inbox/ProposalSection/proposalSection";
import { ChatContext } from "../../../contexts/chatContext";
// import { NegotiationModal } from "../Negotiation/negotiationModal/negotiationModal";
// import { NegotiationButton } from "../Negotiation/negotiationButton/negotiationButton";
// import { NegotiationMessage } from "../Negotiation/negotiationMessage/negotiationMessage";

function MessageList({
  currentUser,
  conversations,
  //   conversationId,
  activeConversation,
  //   handleNegotiation,
  messages,
  placeholderUI,
}) {
  //   const { handleProposalChanges } = useContext(ChatContext);
  const [otherUser, setOtherUser] = useState({});
  const messageListRef = useRef(null);
  const [error, setError] = useState(null);

  //   const [isNegotiationModalOpen, setIsNegotiationModalOpen] = useState(false);
  //   const [currentProposal, setCurrentProposal] = useState(null);

  const currentUserId = currentUser?._id || currentUser?.id;

  //   const fetchProposalDetails = useCallback(async () => {
  //     try {
  //       const token = localStorage.getItem("token");
  //       const response = await axios.get(
  //         `${
  //           import.meta.env.VITE_API_URL
  //         }/api/negotiations/${negotiationId}/latest`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       setCurrentProposal(response.data);
  //     } catch (err) {
  //       setError("Failed to load proposal details");
  //     }
  //   }, [conversationId]);

  //   useEffect(() => {
  //     fetchProposalDetails();
  //   }, [fetchProposalDetails]);

  useEffect(() => {
    if (conversations && conversations.length > 0 && currentUserId) {
      const activeConvo = conversations.find(
        (convo) => convo._id === activeConversation
      );

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
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  console.log("activeConversation", activeConversation);

  if (!activeConversation) {
    return placeholderUI();
  }

  return (
    otherUser && (
      <div className={styles.leftSideContainer}>
        <div className={styles.messagesWrapper}>
          <div className={styles.receiptNameBar}>
            <Link
              to={`/${
                otherUser.userType === "homeowner"
                  ? "homeowner-profile"
                  : otherUser.userType === "professional"
                  ? "professional-profile"
                  : "supplier-profile"
              }/${otherUser._id}`}
            >
              <h2 className={styles.receiptName}>{otherUser.name}</h2>
            </Link>
          </div>
          <div className={styles.message_list} ref={messageListRef}>
            {/* <ProposalSection
              handleProposalChanges={handleProposalChanges}
              conversationId={activeConversation}
            /> */}

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
                    </div>
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
                );
              })}
            </div>
            {/* <NegotiationButton
              onOpenNegotiation={() => setIsNegotiationModalOpen(true)}
            />
            <NegotiationModal
              isOpen={isNegotiationModalOpen}
              onClose={() => setIsNegotiationModalOpen(false)}
              currentProposal={currentProposal}
              onSubmit={handleNegotiation}
            /> */}
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
