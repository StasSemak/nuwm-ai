import ReactDOM from "react-dom/client";
import "./styles/index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Index } from "./routes";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Admin, AdminCategoriesRoute, AdminFilesRoute, AdminHistoryRoute, AdminModelRoute, AdminRequestsRoute } from "./routes/admin";
import { AdminLayout } from "./routes/layout";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<Index />} />
        <Route path="/admin/" element={<AdminLayout/>}>
          <Route index element={<Admin />} />
          <AdminFilesRoute />
          <AdminCategoriesRoute />
          <AdminRequestsRoute />
          <AdminHistoryRoute />
          <AdminModelRoute />
        </Route>
      </Routes>
      <Toaster position="top-right" containerStyle={{top: 70}}/>
    </BrowserRouter>
  </QueryClientProvider>
);
