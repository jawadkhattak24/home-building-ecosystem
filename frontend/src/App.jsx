import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import "./App.css";
import HomeNew from "./pages/homeNew/home";
import LoginPage from "./pages/login/login";
import RegisterPage from "./pages/register/register";
import { AuthProvider, useAuth } from "./contexts/authContext";
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
import SupplierHome from "./pages/supplierHome/supplierHome.jsx";
import ViewProfessionalProfile from "./pages/professionalProfile/viewProfessionalProfile/professionalProfileChatProvider";
import Profile from "./pages/profile/profile";
import CategoryResults from "./components/categoryResults/categoryResults";
import SearchPage from "./pages/searchPage/searchPage";
import SetupProfessionalProfile from "./pages/professionalProfile/setupProfessionalProfile/setupProfessionalProfile";
import HomeownerProfile from "./pages/homeowner/homeownerProfile/homeownerProfile";
import SavedItemsPage from "./pages/homeowner/savedItemsPage/savedItemsPage";
import ProfessionalAnalytics from "./pages/professionalAnalytics/professionalAnalytics";
import ListingCard from "./components/listingCard/listingCard";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import SupplierListings from "./pages/supplierListings/supplierListings";
import ListingDetailsPage from "./pages/listingDetailsPage/listingDetailsPageChatProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function AppContent() {
  const location = useLocation();

  const showNavigation = ["/login", "/register", "/auth/success"].includes(
    location.pathname
  );

  const { currentUser } = useAuth();
  console.log("currentUser from App.jsx", currentUser);

  const showFooter = [
    "/inbox",
    "/login",
    "/register",
    "/auth/success",
  ].includes(location.pathname);

  return (
    <>
      {!showNavigation && <Navigation />}
      <TransitionGroup>
        <CSSTransition
          key={location.key}
          timeout={300}
          classNames="page-transition"
          unmountOnExit
        >
          <Routes location={location}>
            <Route path="/" element={<PublicRoute element={HomeNew} />} />
            <Route
              path="/supplier-homepage/:supplierId"
              element={
                <ProtectedRoute
                  allowedRoles={["supplier", "homeowner"]}
                  element={SupplierHome}
                />
              }
            />
            <Route
              path="/supplier-listings"
              element={
                <ProtectedRoute
                  allowedRoles={["supplier"]}
                  element={SupplierListings}
                />
              }
            />
            <Route
              path="/login"
              element={<PublicRoute element={LoginPage} />}
            />
            <Route
              path="/listing/:listingId"
              element={
                <ProtectedRoute
                  allowedRoles={["supplier", "homeowner"]}
                  element={ListingDetailsPage}
                />
              }
            />
            <Route
              path="/register"
              element={<PublicRoute element={RegisterPage} />}
            />
            <Route
              path="/homeNew"
              element={
                <ProtectedRoute
                  allowedRoles={["homeowner"]}
                  element={HomeNew}
                />
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
            {/*<Route*/}
            {/*    path="/supplier-profile/:userId"*/}
            {/*    element={<ProtectedRoute element={SupplierProfile}/>}*/}
            {/*/>*/}
            <Route
              path="/profile/:userId"
              element={<ProtectedRoute element={Profile} />}
            />
            <Route
              path="/supplier-profile/:supplierId"
              element={<ProtectedRoute element={SupplierHome} />}
            />
            <Route
              path="/homeowner-profile/:userId"
              element={<ProtectedRoute element={HomeownerProfile} />}
            />
            <Route
              path="/search"
              element={
                <ProtectedRoute
                  allowedRoles={["homeowner"]}
                  element={SearchPage}
                />
              }
            />
            <Route
              path="/professional-homepage"
              element={<ProtectedRoute element={ProfessionalHome} />}
            />

            <Route
              path="/listing-card"
              element={<ProtectedRoute element={ListingCard} />}
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
        </CSSTransition>
      </TransitionGroup>
      {!showFooter && <Footer />}
    </>
  );
}

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <LoadingProvider>
              <AppContent />
            </LoadingProvider>
          </QueryClientProvider>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
