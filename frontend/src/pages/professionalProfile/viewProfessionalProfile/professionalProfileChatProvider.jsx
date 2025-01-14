import { ChatProvider } from "../../../contexts/chatContext";
import ViewProfessionalProfile from "./viewProfessionalProfile";

export default function ProfessionalProfileChatProvider() {
  return (
    <ChatProvider>
      <ViewProfessionalProfile />
    </ChatProvider>
  );
}
