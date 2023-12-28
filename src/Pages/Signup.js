import React, { useState } from "react";
import Toast from "../Toast";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [toastMsg, settoastMsg] = useState(null);
  const navigate = useNavigate()

  const validateInput = (input, e) => {
    if (input === "Username") {
        let text = e.target.value;
        if (text.length < 3) {
          settoastMsg("Username must be 3 characters long");
          e.target.style.color = "rgb(250, 0, 0)";
        } else {
          settoastMsg(null);
          e.target.style.color = "rgb(2, 155, 11)";
        }
      }
    if (input === "email") {
      let text = e.target.value;
      if (!text.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
        settoastMsg("Invalid Email");
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
    if (input === "con-password") {
        let pass = document.querySelector("#password").value
      let text = e.target.value;
      if (text !== pass) {
        settoastMsg("Confirm password must \n be equal to password");
        e.target.style.color = "rgb(250, 0, 0)";
      } else {
        settoastMsg(null);
        e.target.style.color = "rgb(2, 155, 11)";
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let Username = document.querySelector("#user").value;
    let email = document.querySelector("#email").value;
    let password = document.querySelector("#password").value;

    let response = await fetch("https://banao-mern-assignment-ayush.onrender.com/user/create", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({Username, email, password,}),
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
      <div className="signup modal">
        <h4>Sign Up</h4>
        <form onSubmit={(e) => {handleSubmit(e)}}>
          <label htmlFor="user">Username</label>
          <input
            onKeyUp={(e) => {
              validateInput("Username", e);
            }}
            id="user"
            placeholder="Username"
            type="text"
            required
          />
          <label htmlFor="email">E-Mail</label>
          <input
            onKeyUp={(e) => {
              validateInput("email", e);
            }}
            id="email"
            placeholder="Email@example.com"
            type="text"
            required
          />
          <label htmlFor="password">Password</label>
          <input
            onKeyUp={(e) => {
              validateInput("password", e);
            }}
            id="password"
            placeholder="Password"
            type="password"
            required
          />
          <label htmlFor="conpass">Confirm Password</label>
          <input
            onKeyUp={(e) => {
              validateInput("con-password", e);
            }}
            id="conpass"
            placeholder="Password"
            type="password"
            required
          />
          <Link to={"/login"} className="modalLinks">
            Already have an account?
          </Link>
          <div aria-hidden className="bar"></div>
          <button className="modalBtn">Sign-Up</button>
        </form>
      </div>
      <Toast msg={toastMsg} setmsg={settoastMsg} />
    </div>
  );
};

export default Signup;
