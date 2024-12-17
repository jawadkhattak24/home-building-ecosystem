import styles from "./styles/inboxSidebar.module.scss";
import PropTypes from "prop-types";
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

  return (
    <div className={styles.sidebar}>
      {isLoading ? (
        <InboxSidebarSkeleton />
      ) : (
        conversations.map((convo) => {
          console.log("Convo in Sidebar Component: ", convo);
          const lastMessageText = convo.lastMessage
            ? convo.lastMessage.content
            : "No messages yet";

          const otherUser = convo.participants?.find(
            (participant) =>
              participant._id !== (currentUser?._id || currentUser?.id)
          );

          // Add a guard clause
          if (!otherUser) {
            console.error("Other user not found in conversation:", convo);
            return null; // Skip rendering this conversation
          }

          console.log("Other User in Sidebar Component: ", otherUser);

          return (
            <div
              className={`${styles.message_list} ${
                activeConversation === convo._id ? styles.active : styles.inActive
              }`}
              key={convo._id}
              onClick={() => onSelectConversation(convo._id)}
            >
              <img
                className={styles.avatarImg}
                src={otherUser.profilePictureUrl || 'https://servicesthumbnailbucket.s3.ap-south-1.amazonaws.com/profile_avatar.jpg'}
                alt={`${otherUser.name || 'User'}'s avatar`}
                onError={(e) => {
                  e.target.src = 'https://servicesthumbnailbucket.s3.ap-south-1.amazonaws.com/profile_avatar.jpg';
                }}
              />
              <div className={styles.converationsDetailsContainer}>
                <h3
                  className={`${styles.reciept} ${
                    activeConversation === convo._id
                      ? styles.activeReciept
                      : styles.inActiveReciept
                  }`}
                >
                  {otherUser.name || 'Unknown User'}
                </h3>
                <p
                  className={`${styles.conversationDate} ${
                    activeConversation === convo._id
                      ? styles.activeDate
                      : styles.inActiveDate
                  }`}
                >
                  {convo.createdAt ? new Date(convo.createdAt).toLocaleDateString() : 'No date'}
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
        }).filter(Boolean) 
      )}
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
