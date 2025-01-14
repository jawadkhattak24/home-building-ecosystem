import { useContext, useEffect } from "react";

import styles from "./styles/inbox.module.scss";
import UserSearch from "../../components/userSearch/userSearch";
import Sidebar from "./inboxSidebar/inboxSidebar";
import MessageList from "./messageList/messageList";
import MessageInput from "./messageInput/messageInput";
import { ChatContext } from "../../contexts/chatContext";
// import ProjectInfoSidebar from "./ProjectDetailsSidebar/projectInfoSidebar";

const PlaceholderUI = () => {
  return (
    <div className={styles.placeholderUI}>
      <p>{"Please select a conversation to start messaging"}</p>
    </div>
  );
};

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
    fetchConversations,
    setInitialActiveConversation,
    isLoading,
  } = useContext(ChatContext);

  console.log("Currently active conversation: ", activeConversation);

  useEffect(() => {
    fetchConversations();
  }, [messages]);

  useEffect(() => {
    const storedConversationId = localStorage.getItem("activeConversation");

    console.log("Stored conversation ID: ", storedConversationId);

    if (storedConversationId) {
      setInitialActiveConversation(storedConversationId);
      localStorage.removeItem("activeConversation");
    }
  }, []);

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

        {!activeConversation && <PlaceholderUI />}

        {activeConversation && (
          <>
            <div className={styles.messageParentContainer}>
              <MessageList
                currentUser={currentUser}
                conversations={conversations}
                activeConversation={activeConversation}
                messages={messages}
                conversationId={activeConversation}
                placeholderUI={PlaceholderUI}
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
