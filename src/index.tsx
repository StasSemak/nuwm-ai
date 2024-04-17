import ReactDOM from "react-dom/client";
import "./styles/index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Index } from "./routes";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Admin, AdminCategories } from "./routes/admin";
import { History } from "./routes/history";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<Index />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);
