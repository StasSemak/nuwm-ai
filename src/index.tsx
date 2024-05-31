import ReactDOM from "react-dom/client";
import "./styles/index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Index } from "./routes";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { Admin, AdminCategories, AdminCategory, AdminFile, AdminFiles, AdminHistory, AdminModel, AdminRequest, AdminRequests } from "./routes/admin";
import { AdminLayout } from "./routes/layout";
import { Toaster } from "react-hot-toast";
import { NotFound } from "./routes/not-found";
import { Login } from "./routes/login";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<Index />} />
        <Route path="/login" element={<Login />}/>
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
          <Route path="requests" element={<Outlet />}>
            <Route index element={<AdminRequests />} />
            <Route path="view/:id" element={<AdminRequest />}/>
          </Route>
          <Route path="history" element={<AdminHistory />} />
          <Route path="model" element={<AdminModel />} />
        </Route>
        <Route path="*" element={<NotFound />}/>
      </Routes>
      <Toaster position="top-right" containerStyle={{top: 70}}/>
    </BrowserRouter>
  </QueryClientProvider>
);
