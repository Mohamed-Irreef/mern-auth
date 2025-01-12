import React from "react";
import wrong from "../assets/wrong.png";
import { useNavigate } from "react-router-dom";

const WrongPopPup = ({ popup, setPopup, wrongPopupMsg, loginStatus }) => {
  const navigate = useNavigate();
  return (
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
            if (loginStatus) {
              return navigate("/login");
            } else {
              navigate("/");
            }
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default WrongPopPup;
