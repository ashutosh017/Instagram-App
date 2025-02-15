import { Route, Routes } from "react-router";
import AuthPage from "./components/AuthPage";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </div>
  );
}

export default App;
