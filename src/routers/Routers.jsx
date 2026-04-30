
import { Routes, Route, Navigate } from "react-router-dom";
import About from "../pages/About";
import Blog from "../pages/Blog";
import Cars from "../pages/Cars";
import Contact from "../pages/Contact";
import Driver from "../pages/Driver";
import Faq from "../pages/Faq";
import Home from "../pages/Home";
import Policy from "../pages/Policy";
import Register from "../pages/Register";
import SelectedBlog from "../pages/SelectedBlog";
import SignIn from "../pages/SignIn";
import Error from "../pages/Error";
import Reserve from "../pages/Reserve";
import AdminLogin from "../pages/AdminLogin";
import DashboardPage from "../pages/admin/DashboardPage";
import FleetPage from "../pages/admin/FleetPage";
import BookingsPage from "../pages/admin/BookingsPage";
import DriversPage from "../pages/admin/DriversPage";
import SupportPage from "../pages/admin/SupportPage";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import VerifyEmail from "../pages/VerifyEmail";
import PaymentPage from "../pages/PaymentPage";
import Unsubscribe from "../pages/Unsubscribe";
import Layout from "../components/Layout/Layout";
import AdminLayout from "../components/Layout/AdminLayout";
import ScrollToTop from "../components/UI/ScrollToTop";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { hasAdminSession } from "../utils/adminApi";
import AOS from "aos";
import "aos/dist/aos.css";

AOS.init({ duration: 1000, once: true });

function AdminProtectedRoute({ children }) {
  const isAuthenticated = hasAdminSession();
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
}

export default function AppRoutes() {
  return (
    <div style={{ position: "relative" }}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blogs" element={<Blog />} />
          <Route path="/blogs/:id" element={<SelectedBlog />} />
          <Route path="/cars/:id" element={<Cars />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/become-a-driver" element={<Driver />} />
          <Route path="/FAQS" element={<Faq />} />
          <Route path="/privacy-policy" element={<Policy />} />
          <Route path="/reserve/:id" element={<Reserve />} />
          <Route path="/payment/:token" element={<PaymentPage />} />
          <Route path="/unsubscribe" element={<Unsubscribe />} />
          <Route path="*" element={<Error />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="login" element={<AdminLogin />} />
          <Route path="dashboard" element={<AdminProtectedRoute><DashboardPage /></AdminProtectedRoute>} />
          <Route path="fleet" element={<AdminProtectedRoute><FleetPage /></AdminProtectedRoute>} />
          <Route path="bookings" element={<AdminProtectedRoute><BookingsPage /></AdminProtectedRoute>} />
          <Route path="drivers" element={<AdminProtectedRoute><DriversPage /></AdminProtectedRoute>} />
          <Route path="support" element={<AdminProtectedRoute><SupportPage /></AdminProtectedRoute>} />
        </Route>
      </Routes>
      <ScrollToTop />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
