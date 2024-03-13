import ReactDOM from "react-dom/client";
import "./styles/admin.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Admin } from "./routes/admin";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("admin-root")!).render(
  <QueryClientProvider client={queryClient}>
    <Admin/>
  </QueryClientProvider>
);
