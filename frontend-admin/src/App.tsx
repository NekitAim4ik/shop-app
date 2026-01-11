import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/auth/Home";
import Login from "./pages/auth/Login";
import Protected from "./pages/Protected";
import Register from "./pages/auth/Register";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Protected />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/protected/*" element={<Protected />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
