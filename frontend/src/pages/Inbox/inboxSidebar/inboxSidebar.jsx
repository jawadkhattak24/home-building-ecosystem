import { useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./styles/inboxSidebar.module.scss";
import InboxSidebarSkeleton from "./loadingSkeleton/loadingSkeleton";

function Sidebar({
  currentUser,
  messages,
  conversations,
  activeConversation,
  onSelectConversation,
  isLoading,
}) {
  console.log("Conversations in Sidebar Component: ", conversations);
  useEffect(() => {
    console.log("Conversations in Sidebar Component: ", conversations);
  }, [conversations, messages]);

  // if (conversations.length === 0) {
  //   return <div>No conversations yet</div>;
  // }
  const sortedConversations = [...conversations].sort((a, b) => {
    const timeA = a.lastMessage?.timestamp
      ? new Date(a.lastMessage.timestamp)
      : new Date(a.createdAt);
    const timeB = b.lastMessage?.timestamp
      ? new Date(b.lastMessage.timestamp)
      : new Date(b.createdAt);

    return timeB - timeA;
  });

  const getLastMessageTime = (convo) => {
    const lastMessageTime = convo?.lastMessage?.timestamp;
    if (!lastMessageTime) return "";

    const messageDate = new Date(lastMessageTime);
    const now = new Date();

    const isToday =
      messageDate.getDate() === now.getDate() &&
      messageDate.getMonth() === now.getMonth() &&
      messageDate.getFullYear() === now.getFullYear();

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    const isYesterday =
      messageDate.getDate() === yesterday.getDate() &&
      messageDate.getMonth() === yesterday.getMonth() &&
      messageDate.getFullYear() === yesterday.getFullYear();

    if (isToday) {
      return messageDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } else if (isYesterday) {
      return "Yesterday";
    } else {
      return messageDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });
    }
  };

  return (
    <div className={styles.sidebar}>
      {/* {isLoading ? (
        <InboxSidebarSkeleton />
      ) : ( */}

      {sortedConversations
        .map((convo) => {
          console.log("Convo in Sidebar Component: ", convo);
          const lastMessageText = convo.lastMessage
            ? convo.lastMessage.content
            : "No messages yet";

          const otherUser = convo.participants?.find(
            (participant) =>
              participant._id !== (currentUser?._id || currentUser?.id)
          );

          if (!otherUser) {
            console.error("Other user not found in conversation:", convo);
            return null;
          }

          console.log("Other User in Sidebar Component: ", otherUser);

          return (
            <div
              className={`${styles.message_list} ${
                activeConversation === convo._id
                  ? styles.active
                  : styles.inActive
              }`}
              key={convo._id}
              onClick={() => onSelectConversation(convo._id)}
            >
              <div className={styles.avatarContainer}>
                <img
                  className={styles.avatarImg}
                  src={
                    otherUser.userType === "supplier"
                      ? otherUser.logo
                      : otherUser.profilePictureUrl
                  }
                  alt={`${otherUser.name || "User"}'s avatar`}
                  onError={(e) => {
                    e.target.src =
                      "https://servicesthumbnailbucket.s3.ap-south-1.amazonaws.com/profile_avatar.jpg";
                  }}
                />
              </div>
              <div className={styles.converationsDetailsContainer}>
                <h3
                  className={`${styles.receipt} ${
                    activeConversation === convo._id
                      ? styles.activeReceipt
                      : styles.inActiveReceipt
                  }`}
                >
                  {otherUser.userType === "supplier"
                    ? otherUser.businessName
                    : otherUser.name || "Unknown User"}
                </h3>
                <p
                  className={`${styles.conversationDate} ${
                    activeConversation === convo._id
                      ? styles.activeDate
                      : styles.inActiveDate
                  }`}
                >
                  {getLastMessageTime(convo)}
                </p>
                <p
                  className={`${styles.lastMessage} ${
                    activeConversation === convo._id
                      ? styles.activeMessage
                      : styles.inActiveMessage
                  }`}
                >
                  {lastMessageText}
                </p>
              </div>
            </div>
          );
        })
        .filter(Boolean)}
    </div>
  );
}

export default Sidebar;

Sidebar.propTypes = {
  messages: PropTypes.array.isRequired,
  activeConversation: PropTypes.string,
  currentUser: PropTypes.object.isRequired,
  conversations: PropTypes.array.isRequired,
  onSelectConversation: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};
