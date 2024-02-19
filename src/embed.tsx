import ReactDOM from "react-dom/client";
import "./styles/index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Embed } from "./routes/embed";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("embed-root")!).render(
  <QueryClientProvider client={queryClient}>
    <Embed/>
  </QueryClientProvider>
);
