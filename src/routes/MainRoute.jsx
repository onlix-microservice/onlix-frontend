import { Navigate } from "react-router-dom";
import Main from "../pages/Main";

function MainRoute() {
  const token = localStorage.getItem("token");
  return token ? <Main /> : <Navigate to="/login" />;
}

export default MainRoute;