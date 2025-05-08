import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../assets/styles/login.scss";
import Logo from "../../assets/images/logo.png";
// import axios from "../../helpers/axoisInterceptor";
const Login = () => {
  const navigate = useNavigate();
  const [newLoginUser,setNewLoginUser] = useState({
    email:"",
    password:""
  })
  const [errors,setErrors] = useState({
    email:"",
    password:"",
    api:""
  });

  useEffect(() => {
    localStorage.clear();
  },[]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewLoginUser((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(newLoginUser);
    const {email,password} = newLoginUser;
    let hasError = false;
    const newErrors = {};

    // Validate email
    if (!email) {
      newErrors.email = "Email is required";
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
      hasError = true;
    }

    // Validate password
    if (!password) {
      newErrors.password = "Password is required";
      hasError = true;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      hasError = true;
    }

    // Stop if there are errors
    if (hasError) {
      setErrors((prev) => ({ ...prev, ...newErrors}))
      return;
    };

    await axios
      .post("http://localhost:8383/auth/login", newLoginUser, {
        headers: {
          "otmm-api-key": "KoaderMasters",
          // Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => {
        console.log(res.data);

        localStorage.setItem("accessToken", res.data.accesstoken);
        localStorage.setItem("refreshToken", res.data.refreshtoken);
        navigate("/home");
      })
      .catch((error) => {
        console.log(error);
        setErrors((prev) => ({
          ...prev,
          api: error.response?.data?.message || "Login failed. Please try again.",
        }));
      });
    };

  return (
    <div className="flexColLogin">
      <div className="loginContainer">
      <form onSubmit={handleLogin} className="loginBox">
        <img src={Logo} alt="Logo" width={180} height={150} />
        <div>
          <label htmlFor="email">Email *</label>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="39"
              viewBox="0 0 40 39"
              fill="none"
            >
              <path
                d="M11.437 25.026C9.15535 26.385 3.17297 29.1611 6.81722 32.636C8.59581 34.3323 10.5776 35.546 13.0689 35.546H27.2879C29.7808 35.546 31.7626 34.3323 33.5412 32.636C37.1854 29.1611 31.2031 26.385 28.9214 25.026C26.2733 23.4602 23.254 22.6343 20.1784 22.6343C17.1028 22.6343 14.0851 23.4602 11.437 25.026ZM27.4363 10.5292C27.4363 12.4555 26.6718 14.3028 25.311 15.6649C23.9501 17.027 22.1045 17.7922 20.18 17.7922C18.2555 17.7922 16.4099 17.027 15.0491 15.6649C13.6883 14.3028 12.9238 12.4555 12.9238 10.5292C12.9238 8.60298 13.6883 6.75562 15.0491 5.39356C16.4099 4.0315 18.2555 3.2663 20.18 3.2663C22.1045 3.2663 23.9501 4.0315 25.311 5.39356C26.6718 6.75562 27.4363 8.60298 27.4363 10.5292Z"
                stroke="#F27D14"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="text"
              name="email"
              placeholder="Enter Your Email"
              onChange={handleChange}
              value={newLoginUser.email}
            />
          </div>
          <div>
            {errors.email && (
              <p style={{ color: "red" }}>{errors.email}</p>
            )}
            {errors.api && (
              <p style={{ color: "red" }}>{errors.api}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="password">Password *</label>
          <div>
            <svg>
              <path
                d="M12 0.65625C7.43406 0.65625 3.6875 4.50141 3.6875 9.1875V12.6914C2.5603 13.8225 1.66454 15.1732 1.05279 16.6644C0.441034 18.1555 0.125603 19.7571 0.125 21.375C0.125 28.0903 5.45687 33.5625 12 33.5625C18.5431 33.5625 23.875 28.0903 23.875 21.375C23.8744 19.7571 23.559 18.1555 22.9472 16.6644C22.3355 15.1732 21.4397 13.8225 20.3125 12.6914V9.1875C20.3125 4.50141 16.5659 0.65625 12 0.65625ZM12 3.09375C15.2716 3.09375 17.9375 5.82984 17.9375 9.1875V10.8633C16.1859 9.81516 14.1684 9.1875 12 9.1875C9.83163 9.1875 7.81406 9.81637 6.0625 10.8633V9.1875C6.0625 5.82984 8.72844 3.09375 12 3.09375ZM12 11.625C17.2606 11.625 21.5 15.9759 21.5 21.375C21.5 26.7741 17.2606 31.125 12 31.125C6.73938 31.125 2.5 26.7741 2.5 21.375C2.5 15.9759 6.73938 11.625 12 11.625ZM12 18.9375C11.3701 18.9375 10.766 19.1943 10.3206 19.6514C9.87522 20.1085 9.625 20.7285 9.625 21.375C9.625 22.2769 10.1036 23.0483 10.8125 23.4712V27.4688H13.1875V23.4712C13.8964 23.0483 14.375 22.2769 14.375 21.375C14.375 20.7285 14.1248 20.1085 13.6794 19.6514C13.234 19.1943 12.6299 18.9375 12 18.9375Z"
                fill="#F27D14"
              />
            </svg>

            <input
              type="password"
              name="password"
              placeholder="Enter Your Password"
              onChange={handleChange}
              value={newLoginUser.password}
            />
          </div>
          <div>
            {errors.password && (
              <p style={{ color: "red" }}>{errors.password}</p>
            )}

            {errors.api && (
              <p style={{ color: "red" }}>{errors.api}</p>
            )}
          </div>
        </div>

        <button type="submit">Login</button>
      </form>
      </div>
    </div>
  );
};

export default Login;
