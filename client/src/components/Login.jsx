import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TickPopPup from "./TickPopPup";
import WrongPopPup from "./WrongPopPup";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [popup, setPopup] = useState(false);
  const [tickPopupMsg, setTickPoppupMsg] = useState("");
  const [wrongPopupMsg, setWrongPoppupMsg] = useState("");
  const [loginStatus, setLoginStatus] = useState(false);

  function formSubmitHandler(e) {
    e.preventDefault();
    setLoginStatus(false);
    setTickPoppupMsg("");
    setWrongPoppupMsg("");
    const user = {
      email,
      password,
    };
    console.log("user", JSON.stringify(user));
    axios
      .post("http://localhost:8000/api/auth/login", user, {
        withCredentials: true,
      })
      .then((res) => {
        setLoginStatus(true);
        setPopup((prev) => !prev);
        setTickPoppupMsg(res.data.message);
        console.log("Response", res.data.message);
      })
      .catch((err) => {
        setLoginStatus(true);
        setPopup((prev) => !prev);
        setWrongPoppupMsg(err.response.data.message);
        console.log("Error:", err.response.data.message);
      });

    setUsername("");
    setEmail("");
    setPassword("");
  }

  return (
    <>
      {!popup ? (
        <div className="sign-up" onSubmit={formSubmitHandler}>
          <form action="" className="sign-up-form">
            <h4 className="sign-up-form-head">SignIn</h4>

            <div className="input-box">
              <div className="icon">
                <i class="ri-mail-line"></i>
              </div>
              <input
                value={email}
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-box">
              <div className="icon">
                <i class="ri-lock-password-line"></i>
              </div>
              <input
                value={password}
                type="password"
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit"> Login</button>

            <div className="form-info">
              <p>
                Don't have an account?{" "}
                <Link to="/" className="text-blue-700">
                  Register
                </Link>
              </p>
              <p>
                <Link
                  to="/email-verify"
                  className="text-blue-700 underline text-sm"
                >
                  Forgot password
                </Link>
              </p>
            </div>
          </form>
        </div>
      ) : (
        <>
          {tickPopupMsg ? (
            <TickPopPup
              popup={popup}
              setPopup={setPopup}
              tickPopupMsg={tickPopupMsg}
              loginStatus={loginStatus}
            />
          ) : (
            <WrongPopPup
              popup={popup}
              setPopup={setPopup}
              wrongPopupMsg={wrongPopupMsg}
              loginStatus={loginStatus}
            />
          )}
        </>
      )}
    </>
  );
};

export default Login;
