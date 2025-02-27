import { ChatProvider } from "../../../contexts/chatContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ViewProfessionalProfile from "./viewProfessionalProfile";

const queryClient = new QueryClient();

export default function ProfessionalProfileChatProvider() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChatProvider>
        <ViewProfessionalProfile />
      </ChatProvider>
    </QueryClientProvider>
  );
}
