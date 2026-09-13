import { Navigate, Route, Routes } from "react-router-dom";
import { AccountOrderPage, AccountPage } from "../pages/AccountPage";
import { OrderDetail } from "../pages/orders/OrderDetail";
import { RequireAuth, RequireStaff } from "./guards";
import {
  AdminAnalytics,
  AdminConsults,
  AdminCustomers,
  AdminDispatch,
  AdminInventory,
  AdminOrders,
  AdminOverview,
  AdminShell,
  AdminTeam,
} from "../pages/admin/AdminPages";
import { LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage } from "../pages/auth/AuthPages";
import { LandingPage } from "../pages/LandingPage";
import { PreorderLayout } from "../pages/preorder/PreorderLayout";
import { StepAddress } from "../pages/preorder/StepAddress";
import { StepConfirmation } from "../pages/preorder/StepConfirmation";
import { StepConsult } from "../pages/preorder/StepConsult";
import { StepProduct } from "../pages/preorder/StepProduct";
import { StepProgram } from "../pages/preorder/StepProgram";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route
        path="/account"
        element={
          <RequireAuth>
            <AccountPage />
          </RequireAuth>
        }
      />
      <Route
        path="/account/orders/:publicId"
        element={
          <RequireAuth>
            <AccountOrderPage />
          </RequireAuth>
        }
      />
      <Route element={<PreorderLayout />}>
        <Route path="/preorder" element={<StepProduct />} />
        <Route path="/program" element={<StepProgram />} />
        <Route path="/consult" element={<StepConsult />} />
        <Route path="/address" element={<StepAddress />} />
        <Route path="/confirmation" element={<StepConfirmation />} />
      </Route>
      <Route
        path="/admin"
        element={
          <RequireStaff>
            <AdminShell />
          </RequireStaff>
        }
      >
        <Route index element={<AdminOverview />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="orders/:publicId" element={<OrderDetail backTo="/admin/orders" />} />
        <Route path="consults" element={<AdminConsults />} />
        <Route path="dispatch" element={<AdminDispatch />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="inventory" element={<AdminInventory />} />
        <Route path="team" element={<AdminTeam />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export function App() {
  return <AppRoutes />;
}
