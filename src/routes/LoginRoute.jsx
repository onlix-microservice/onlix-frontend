import { Navigate } from "react-router-dom";
import Login from "../pages/Login";

function LoginRoute() {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/" /> : <Login />;
}

export default LoginRoute;