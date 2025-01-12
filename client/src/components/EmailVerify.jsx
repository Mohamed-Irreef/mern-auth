import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import tick from "../assets/tick.png";
import wrong from "../assets/wrong.png";

const EmailVerify = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [verify, setVerify] = useState(false);
  const [status, setStatus] = useState(false);
  const [popup, setPopup] = useState(false);
  const [tickPopupMsg, setTickPoppupMsg] = useState("");
  const [wrongPopupMsg, setWrongPoppupMsg] = useState("");

  const navigate = useNavigate();

  function formSubmitHandler(e) {
    e.preventDefault();
    setStatus(false);
    setTickPoppupMsg("");
    setWrongPoppupMsg("");
    if (!verify) {
      const user = {
        email,
      };
      console.log("user", JSON.stringify(user));
      axios
        .post("http://localhost:8000/api/auth/send-code", user, {
          withCredentials: true,
        })
        .then((res) => {
          setVerify(true);
          setPopup((prev) => !prev);
          setTickPoppupMsg(res.data.message);
          console.log("Response", res.data.message);
        })
        .catch((err) => {
          setPopup((prev) => !prev);
          setWrongPoppupMsg(err.response.data.message);
          console.log("Error:", err.response.data.message);
        });
    } else {
      const user = {
        email,
        otp,
      };
      console.log("user", JSON.stringify(user));
      axios
        .post("http://localhost:8000/api/auth/verify-code", user, {
          withCredentials: true,
        })
        .then((res) => {
          setStatus(true);
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
  }

  return (
    <>
      {!popup ? (
        <div className="sign-up" onSubmit={formSubmitHandler}>
          <form action="" className="sign-up-form">
            <h4 className="sign-up-form-head">Email Verification</h4>

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

            {verify && (
              <div className="input-box">
                <div className="icon">
                  <i class="ri-lock-password-line"></i>
                </div>
                <input
                  value={otp}
                  type="password"
                  placeholder="Enter otp"
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
            )}

            {verify ? (
              <>
                <button type="submit">Verify Code</button>
                <div>
                  <p>
                    {" "}
                    <Link
                      to="/email-verify"
                      className="text-blue-700 underline text-sm text-right"
                      onClick={(e) => {
                        setVerify(false);
                      }}
                    >
                      resend code
                    </Link>
                  </p>
                </div>
              </>
            ) : (
              <>
                <button type="submit">Send Code</button>
                <p>
                  Don't have an account?{" "}
                  <Link to="/" className="text-blue-700">
                    Register
                  </Link>
                </p>
              </>
            )}
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
                    if (status) {
                      navigate("/password-reset");
                    } else {
                      navigate("/email-verify");
                    }
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
                    navigate("/email-verify");
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

export default EmailVerify;
