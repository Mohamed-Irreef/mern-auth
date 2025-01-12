import { createBrowserRouter } from "react-router-dom";
import App from "../App";

import Home from "../pages/Home";
import Signup from "../components/Signup";
import Login from "../components/Login";
import EmailVerify from "../components/EmailVerify";
import PasswordReset from "../components/passwordReset";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, //App Layout
    children: [
      { path: "/", element: <Signup /> },
      { path: "login", element: <Login /> },
      { path: "email-verify", element: <EmailVerify /> },
      { path: "password-reset", element: <PasswordReset /> },
    ],
  },
  {
    path: "/home",
    element: <Home />,
  },
]);

export default router;
