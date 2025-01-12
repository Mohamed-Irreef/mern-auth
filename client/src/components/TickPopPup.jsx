import React from "react";
import tick from "../assets/tick.png";
import { useNavigate } from "react-router-dom";
const TickPopPup = ({ popup, setPopup, tickPopupMsg, loginStatus }) => {
  const navigate = useNavigate();
  return (
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
            if (loginStatus) {
              return navigate("/home");
            } else {
              navigate("/login");
            }
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TickPopPup;
