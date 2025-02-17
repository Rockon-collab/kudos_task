import { Navigate, Outlet } from "react-router-dom";

const LogAuth = () => {
  const isChecked = localStorage.getItem("token");
  const user = isChecked ? true : false;

  return user;
};

export const ProtectedRoute = () => {
  const isAuth = LogAuth();
  const userRedirect = {
    loggedIn: isAuth ? <Outlet /> : <Navigate to="/auth" />,
  };
  return userRedirect.loggedIn;
};
