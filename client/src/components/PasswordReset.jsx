import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import tick from "../assets/tick.png";
import wrong from "../assets/wrong.png";

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [popup, setPopup] = useState(false);
  const [tickPopupMsg, setTickPoppupMsg] = useState("");
  const [wrongPopupMsg, setWrongPoppupMsg] = useState("");

  const navigate = useNavigate();

  function formSubmitHandler(e) {
    e.preventDefault();

    setTickPoppupMsg("");
    setWrongPoppupMsg("");
    const user = {
      email,
      newPassword,
      confirmPassword,
    };
    console.log("user", JSON.stringify(user));
    axios
      .post("http://localhost:8000/api/auth/reset-password", user, {
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
  }

  return (
    <>
      {!popup ? (
        <div className="sign-up" onSubmit={formSubmitHandler}>
          <form action="" className="sign-up-form">
            <h4 className="sign-up-form-head">Password Reset</h4>

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
                value={newPassword}
                type="password"
                placeholder="New Password"
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="input-box">
              <div className="icon">
                <i class="ri-lock-password-line"></i>
              </div>
              <input
                value={confirmPassword}
                type="password"
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button type="submit"> Reset Password</button>
          </form>
        </div>
      ) : (
        <>
          {tickPopupMsg ? (
            <div className="popup-container">
              <div className="popup">
                <div className="img-container">
                  <img src={tick} alt="" />
                </div>

                <p className="pop-content-tick">{tickPopupMsg}</p>
                <button
                  className="tick"
                  onClick={(e) => {
                    setPopup((prev) => !prev);
                    navigate("/login");
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <div className="popup-container">
              <div className="popup">
                <div className="img-container">
                  <img src={wrong} alt="" />
                </div>

                <p className="pop-content-wrong">{wrongPopupMsg}</p>
                <button
                  className="wrong"
                  onClick={(e) => {
                    setPopup((prev) => !prev);
                    navigate("/password-reset");
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default PasswordReset;
