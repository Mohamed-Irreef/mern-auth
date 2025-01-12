import React from "react";
import construction from "../assets/construction.gif";
import axios from "axios";
import {useNavigate} from 'react-router-dom'
const Home = () => {

  const navigate = useNavigate();
  function logoutHandler(){
    confirm('This account will be logged out...')
    axios.defaults.withCredentials=true
    axios.post('http://localhost:8000/api/auth/logout')
    .then((res)=> {console.log(res.data.message); navigate('/login') })
    .catch((err)=>console.log(err.message))
  }

  return (
    <div className="home">
      <nav className="web-nav">
        <div className="logo">
          <h4 className="text-4xl font-bold">
            <span className="text-blue-600">E</span>du
            <span className="text-blue-600">N</span>ex
          </h4>
        </div>

        <ul className="Nav-list">
          <li>Home</li>
          <li>About</li>
          <li>Services</li>
          <li>Blog</li>
          <li>Contact</li>
        </ul>

        <div className="nav-buttons">
          <button className="dashboard">Dashboard</button>
          <button className="logout" onClick={logoutHandler}>Logout</button>
        </div>
      </nav>

      <div className="body-content">
        <div className="center mt-5 h-96  flex flex-col justify-center items-center">
          <h4 className="text-5xl text-blue-700 font-medium text-center">Welcome To My Website</h4>
          <img src={construction} alt="" className="w-96"/>
        </div>
      </div>

      <footer>
        <p>© 2025 EduNex. All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default Home;
