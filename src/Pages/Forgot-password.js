import React, { useState } from "react";
import Toast from "../Toast";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [toastMsg, settoastMsg] = useState(null);
  const navigate = useNavigate()

  const validateInput = (input, e) => {
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
  };

  const handleSubmit = async (e) => {
    document.querySelector("#forgotBtn").setAttribute("disabled", true)
    settoastMsg("Processing...");
    e.preventDefault();
    let email = document.querySelector("#email").value;

    let response = await fetch("https://banao-mern-assignment-ayush.onrender.com/user/ForgotPassword", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ email}),
    });
    const data = await response.json();
    if (data.success) {
      settoastMsg("Check Your Mail!");
    } else {
      if(typeof data.errors[0].msg === "string") {
        settoastMsg(data.errors[0].msg);
      }
      else {
        settoastMsg(data.errors[0])
      }
      document.querySelector("#forgotBtn").setAttribute("disabled", false)
    }
  };

  return (
    <div className="container">
      <div className="login modal">
        <h4>Forgot Password</h4>
        <form
        onSubmit={(e)=> {handleSubmit(e)}}>
          <label htmlFor="email">E-Mail</label>
          <input
            onKeyUp={(e) => {
              validateInput("email", e);
            }}
            id="email"
            placeholder="Email@example.com"
            type="text"
          />

          <Link to={"/login"} className="modalLinks">
            Remember Password?
          </Link>
          <div aria-hidden className="bar"></div>
          <button id="forgotBtn" className="modalBtn">Send Mail</button>
        </form>
      </div>
      <Toast msg={toastMsg} setmsg={settoastMsg} />
    </div>
  );
};

export default ForgotPassword;
