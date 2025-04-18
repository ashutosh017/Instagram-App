import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import AuthPage from "./components/AuthPage.tsx";
import FeedPage from "./components/FeedPage.tsx";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App/>}/>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/feed" element={<FeedPage/>}/>
    </Routes>
  </BrowserRouter>
);
