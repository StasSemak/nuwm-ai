import ReactDOM from "react-dom/client";
import "./styles/admin.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { History } from "./routes/history";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("history-root")!).render(
  <QueryClientProvider client={queryClient}>
    <History />
  </QueryClientProvider>
);
