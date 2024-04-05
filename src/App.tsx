import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import PrivateRoutes from "./utils/authRoutes";
import Error from "./pages/Error";
import { MainPage } from "./pages/MainPage";
import WelcomeScreen from "./pages/WelcomeScreen";
import NewUsers from "@/components/NewUsers";
import ChatUsers from "@/components/ChatUsers";
import ProtectedRoutes from "./utils/authProtected";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<MainPage />}>
            <Route path="/" element={<WelcomeScreen />} />
            <Route path="new-users" element={<NewUsers />} />
            <Route path="chat-users" element={<ChatUsers />} />
          </Route>
        </Route>
        <Route element={<ProtectedRoutes />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
}

export default App;
