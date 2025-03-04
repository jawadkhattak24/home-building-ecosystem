import { ChatProvider } from "../../contexts/chatContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ListingDetailsPage from "./listingDetailsPage";

const queryClient = new QueryClient();

export default function ListingDetailsPageChatProvider() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChatProvider>
        <ListingDetailsPage />
      </ChatProvider>
    </QueryClientProvider>
  );
}
