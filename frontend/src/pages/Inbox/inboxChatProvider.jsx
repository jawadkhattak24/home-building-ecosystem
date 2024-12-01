import { ChatProvider } from "../../contexts/chatContext";
import Inbox from "./inbox";

function InboxWithChatProvider() {
  return (
    <ChatProvider>
      <Inbox />
    </ChatProvider>
  );
}

export default InboxWithChatProvider;
