import { ChatProvider } from "../../../contexts/ChatContext";
import Inbox from "./inbox";

function InboxWithChatProvider() {
  return (
    <ChatProvider>
      <Inbox />
    </ChatProvider>
  );
}

export default InboxWithChatProvider;
