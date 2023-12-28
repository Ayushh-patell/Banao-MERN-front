import React, { useState } from "react";
import Toast from "../Toast";
import { useNavigate, useSearchParams } from "react-router-dom";

const ResetPassword = () => {
  const [toastMsg, settoastMsg] = useState(null);
  let [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get("token")
  const navigate = useNavigate()

  const validateInput = (input, e) => {
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
      let pass = document.querySelector("#password").value;
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
    let password = document.querySelector("#password").value;

    let response = await fetch("https://banao-mern-assignment-ayush.onrender.com/user/ResetPassword", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ password, token }),
    });
    const data = await response.json();
    if (data.success) {
      settoastMsg("Password Updated");
      navigate("/login")
    } else {
      console.log(data)
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
        <h4>Reset Password</h4>
        <form onSubmit={(e) => {handleSubmit(e)}}>
          <label htmlFor="password">Password</label>
          <input
            onKeyUp={(e) => {
              validateInput("password", e);
            }}
            id="password"
            placeholder="Password"
            type="password"
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

          <div aria-hidden className="bar"></div>
          <button className="modalBtn">Reset</button>
        </form>
      </div>
      <Toast msg={toastMsg} setmsg={settoastMsg} />
    </div>
  );
};

export default ResetPassword;
