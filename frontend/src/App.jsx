import "./App.css";
import Home from "./pages/home/home";
import HomeNew from "./pages/homeNew/home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login/login";
import RegisterPage from "./pages/register/register";
import { AuthProvider, useAuth } from "./contexts/authContext";
import { useLocation } from "react-router-dom";
import Navigation from "./components/navigation/navigation";
import Footer from "./components/footer/footer";
import ProtectedRoute from "./components/auth/protectedRoute/protectedRoute";
import PublicRoute from "./components/auth/publicRoute/publicRoute";
import AuthSuccess from "./components/auth/authRedirect";

function AppContent() {
  const location = useLocation();
  const showNavigation = ["/login", "/register"].includes(location.pathname);

  const { currentUser } = useAuth();
  console.log("currentUser from App.jsx", currentUser);

  const showFooter = ["/inbox", "/login", "/register"].includes(
    location.pathname
  );

  return (
    <>
      {!showNavigation && <Navigation />}
      <Routes>
        <Route path="/" element={<PublicRoute element={Home} />} />
        <Route path="/login" element={<PublicRoute element={LoginPage} />} />
        <Route path="/homeNew" element={<ProtectedRoute element={HomeNew} />} />
        <Route path="/auth/success" element={<AuthSuccess />} />
        <Route
          path="/register"
          element={<PublicRoute element={RegisterPage} />}
        />
        {/* <Route path="/inbox" element={<ProtectedRoute element={Inbox} />} /> */}
      </Routes>
      {!showFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
