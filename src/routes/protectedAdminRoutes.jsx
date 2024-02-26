import { Navigate } from "react-router-dom";
import { getLs } from "../helpers/getLs";

const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY

export const ProtectedAdminRoute = ({ children }) => {
  const key = getLs("key")

  if (key !== ADMIN_KEY ) {
    return <Navigate to={"/"}></Navigate>;
  } else {
    return children;
  }
};
