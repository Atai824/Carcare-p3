import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Protected from "./components/Protected";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddCar from "./pages/AddCar";
import Forum from "./pages/Forum";

export default function App() {
  return (
    <AuthProvider>
      <div className="d-flex flex-column min-vh-100">
        <BrowserRouter>
          <Nav />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* защищённые */}
              <Route element={<Protected />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/cars/new" element={<AddCar />} />
              </Route>

              {/* форум пока открытый */}
              <Route path="/forum" element={<Forum />} />
            </Routes>
          </main>
          <Footer />
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}
