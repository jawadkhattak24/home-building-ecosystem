import { useContext } from "react";

import styles from "./styles/inbox.module.scss";
import UserSearch from "../../components/userSearch/userSearch";
import Sidebar from "./inboxSidebar/inboxSidebar";
import MessageList from "./messageList/messageList";
import MessageInput from "./messageInput/messageInput";
import { ChatContext } from "../../contexts/chatContext";
// import ProjectInfoSidebar from "./ProjectDetailsSidebar/projectInfoSidebar";

function Inbox() {
  console.log("Chat context: ", ChatContext);
  const {
    conversations,
    activeConversation,
    messages,
    currentUser,
    handleSelectConversation,
    handleSendMessage,
    handleUserSelect,
    isLoading,
  } = useContext(ChatContext);

  console.log("Currently active conversation: ", activeConversation);

  return (
    <div className="app">
      <div className={styles.inboxParentContainer}>
        <div className={styles.sidebarParentContainer}>
          <UserSearch onUserSelect={handleUserSelect} />
          <Sidebar
            currentUser={currentUser}
            messages={messages}
            conversations={conversations}
            activeConversation={activeConversation}
            onSelectConversation={handleSelectConversation}
            isLoading={isLoading}
          />
        </div>

        {activeConversation && (
          <>
            <div className={styles.messageParentContainer}>
              <MessageList
                currentUser={currentUser}
                conversations={conversations}
                activeConversation={activeConversation}
                messages={messages}
                conversationId={activeConversation}
              />
              <MessageInput onSendMessage={handleSendMessage} />
            </div>
            {/* <div className={styles.aboutUserContainer}>
              <ProjectInfoSidebar
                currentUser={currentUser}
                conversationId={activeConversation}
                handleProposalChanges={handleProposalChanges}
              />
            </div> */}
          </>
        )}
      </div>
      {/* </>
      ) : (
        <div className={styles.loadingWrapper}>
          <div className={styles.loader}></div>
          <p className={styles.loadingText}>Loading...</p>{" "}
        </div>
      )} */}
    </div>
  );
}
export default Inbox;
