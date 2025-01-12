import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TickPopPup from "./TickPopPup";
import WrongPopPup from "./WrongPopPup";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [popup, setPopup] = useState(false);
  const [tickPopupMsg, setTickPoppupMsg] = useState("");
  const [wrongPopupMsg, setWrongPoppupMsg] = useState("");

  function formSubmitHandler(e) {
    e.preventDefault();
    setTickPoppupMsg("");
    setWrongPoppupMsg("");
    const user = {
      username,
      email,
      password,
    };
    console.log("user", JSON.stringify(user));
    axios
      .post("http://localhost:8000/api/auth/register", user, {
        withCredentials: true,
      })
      .then((res) => {
        setPopup((prev) => !prev);
        setTickPoppupMsg(res.data.message);
        console.log("Response", res.data.message);
      })
      .catch((err) => {
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
            <h4 className="sign-up-form-head">SignUp</h4>

            <div className="input-box">
              <div className="icon">
                <i className="ri-user-line"></i>
              </div>
              <input
                value={username}
                type="text"
                placeholder="username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

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

            <button type="submit"> Register</button>

            <div className="form-info">
              <p>
                Already have an account?{" "}
                <Link to="/login" className="text-blue-700">
                  Login
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
            />
          ) : (
            <WrongPopPup
              popup={popup}
              setPopup={setPopup}
              wrongPopupMsg={wrongPopupMsg}
            />
          )}
        </>
      )}
    </>
  );
};

export default Signup;
