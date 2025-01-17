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
import Inbox from "./pages/Inbox/inboxChatProvider";
import ProfessionalProfileSetup from "./pages/register/professionalProfileSetup/professionalProfileSetup";
import SupplierProfileSetup from "./pages/register/supplierProfileSetup/supplierProfileSetup";
import { LoadingProvider } from "./contexts/loadingContext";
import UserTypeSelection from "./pages/register/userTypeSelection/userTypeSelection";
import ProfessionalHome from "./pages/professionalHome/professionalHome";
import SupplierHome from "./pages/supplierHome/supplierHome";
import ViewProfessionalProfile from "./pages/professionalProfile/viewProfessionalProfile/professionalProfileChatProvider";
import Profile from "./pages/profile/profile";
import SupplierProfile from "./pages/supplierProfile/supplierProfile";
import CategoryResults from "./components/categoryResults/categoryResults";
import SearchPage from "./pages/searchPage/searchPage";
import SetupProfessionalProfile from "./pages/professionalProfile/setupProfessionalProfile/setupProfessionalProfile";
import HomeownerProfile from "./pages/homeowner/homeownerProfile/homeownerProfile";
import SavedItemsPage from "./pages/homeowner/savedItemsPage/savedItemsPage";
import ProfessionalAnalytics from "./pages/professionalAnalytics/professionalAnalytics";

function AppContent() {
  const location = useLocation();

  const showNavigation = [
    "/login",
    "/register",
    "/supplier-profile",
    "/professional-profile-setup",
    "/supplier-profile-setup",
    "/auth/success",
    "/user-type-selection",
  ].includes(location.pathname);

  const { currentUser } = useAuth();
  console.log("currentUser from App.jsx", currentUser);

  const showFooter = [
    "/inbox",
    "/login",
    "/register",
    "/professional-profile-setup",
    "/supplier-profile-setup",
    "/supplier-profile",
    "/auth/success",
    "/user-type-selection",
  ].includes(location.pathname);

  return (
    <>
      {!showNavigation && <Navigation />}
      <Routes>
        <Route path="/" element={<PublicRoute element={HomeNew} />} />
        <Route path="/login" element={<PublicRoute element={LoginPage} />} />
        <Route
          path="/homeNew"
          element={
            <ProtectedRoute allowedRoles={["homeowner"]} element={HomeNew} />
          }
        />
        <Route path="/auth/success" element={<AuthSuccess />} />
        <Route
          path="/professional-profile/:userId"
          element={<ProtectedRoute element={ViewProfessionalProfile} />}
        />
        <Route
          path="/saved-items"
          element={<ProtectedRoute element={SavedItemsPage} />}
        />
        <Route
          path="/professional-profile/setup"
          element={
            <ProtectedRoute
              allowedRoles={["professional"]}
              element={SetupProfessionalProfile}
            />
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute
              allowedRoles={["professional"]}
              element={ProfessionalAnalytics}
            />
          }
        />
        <Route
          path="/supplier-profile/:userId"
          element={<ProtectedRoute element={SupplierProfile} />}
        />
        <Route
          path="/profile/:userId"
          element={<ProtectedRoute element={Profile} />}
        />
        <Route
          path="/homeowner-profile/:userId"
          element={<ProtectedRoute element={HomeownerProfile} />}
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute allowedRoles={["homeowner"]} element={SearchPage} />
          }
        />
        <Route
          path="/professional-homepage"
          element={<ProtectedRoute element={ProfessionalHome} />}
        />
        <Route
          path="/supplier-homepage"
          element={<ProtectedRoute element={SupplierHome} />}
        />
        <Route
          path="/register"
          element={<PublicRoute element={RegisterPage} />}
        />
        <Route
          path="/professional-profile-setup"
          element={<ProtectedRoute element={ProfessionalProfileSetup} />}
        />
        <Route
          path="/supplier-profile-setup"
          element={<ProtectedRoute element={SupplierProfileSetup} />}
        />
        <Route
          path="/professionals/:category"
          element={<ProtectedRoute element={CategoryResults} />}
        />
        <Route
          path="/user-type-selection"
          element={<ProtectedRoute element={UserTypeSelection} />}
        />
        <Route path="/inbox" element={<ProtectedRoute element={Inbox} />} />
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
          <LoadingProvider>
            <AppContent />
          </LoadingProvider>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
