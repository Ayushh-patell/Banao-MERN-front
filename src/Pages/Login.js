import React, { useState } from "react";
import Toast from "../Toast";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [toastMsg, settoastMsg] = useState(null);
  const navigate = useNavigate()

  const validateInput = (input, e) => {
    if (input === "Username") {
      let text = e.target.value;
      if (text.length < 3) {
        settoastMsg("Username is Small");
        e.target.style.color = "rgb(250, 0, 0)";
      } else {
        settoastMsg(null);
        e.target.style.color = "rgb(2, 155, 11)";
      }
    }
    if (input === "password") {
      let text = e.target.value;
      if (text.length < 5) {
        settoastMsg("Password must be 5 characters long");
        e.target.style.color = "rgb(250, 0, 0)";
      } else {
        settoastMsg(null);
        e.target.style.color = "rgb(2, 155, 11)";
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let Username = document.querySelector("#Username").value;
    let password = document.querySelector("#password").value;

    let response = await fetch("https://banao-mern-assignment-ayush.onrender.com/user/login", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ Username, password,}),
    });
    const data = await response.json();
    if (data.success) {
      settoastMsg("Login Successful!");
      localStorage.setItem("TokenPostApp", data.authtoken);
      localStorage.setItem("TokenPostAppUsername", data.Username);
      navigate("/")
    } else {
      if(typeof data.errors[0].msg === "string") {
        settoastMsg(data.errors[0].msg);
      }
      else {
        settoastMsg(data.errors[0])
      }
    }
  };

  return (
    <div className="container">
      <div className="login modal">
        <h4>Login</h4>
        <form
          id="form"
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <label htmlFor="Username">Username</label>
          <input
            onKeyUp={(e) => {
              validateInput("Username", e);
            }}
            id="Username"
            placeholder="Username"
            type="text"
          />
          <label htmlFor="password">Password</label>
          <input
            onKeyUp={(e) => {
              validateInput("password", e);
            }}
            id="password"
            placeholder="Password"
            type="password"
          />
          <Link to={"/forgotpassword"} className="modalLinks">
            Forgot Password?
          </Link>
          <div aria-hidden className="bar"></div>
          <Link to={"/signup"} className="modalLinks">
            Don't have an account?
          </Link>
          <button className="modalBtn">Login</button>
        </form>
      </div>
      <Toast msg={toastMsg} setmsg={settoastMsg} />
    </div>
  );
};

export default Login;
