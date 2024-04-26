import ReactDOM from "react-dom/client";
import "./styles/index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Index } from "./routes";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { Admin, AdminCategories, AdminCategory, AdminFile, AdminFiles, AdminHistory, AdminModel } from "./routes/admin";
import { AdminLayout } from "./routes/layout";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<Index />} />
        <Route path="/admin/" element={<AdminLayout/>}>
          <Route index element={<Admin />} />
          <Route path="files" element={<Outlet />}>
            <Route index element={<AdminFiles />}/>
            <Route path="view/:id" element={<AdminFile />} />
          </Route>
          <Route path="categories" element={<Outlet />}>
            <Route index element={<AdminCategories />} />
            <Route path="view/:id" element={<AdminCategory />}/>
          </Route>
          <Route path="history" element={<AdminHistory />} />
          <Route path="model" element={<AdminModel />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);
