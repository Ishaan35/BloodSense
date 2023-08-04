import LoginSignupStyles from "../styles/LoginSignup.module.css";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { checkAuthenticationWithCookie } from "../utils/authUtils";
import { UserContext } from "../contexts/UserContext";
import LoadingAnimation from "@/components/layout/LoadingAnimation/LoadingAnimation";
import GoogleButton from "react-google-button";
import { FiChevronRight } from "react-icons/fi";


export default function Signup() {

  const [firstNameInput, setFirstNameInput] = useState("");
  const [lastNameInput, setLastNameInput] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [confirmPasswordInput, setconfirmPasswordInput] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const { SignedInUser, SetSignedInUser, LoadingPage, setLoadingPage } = useContext(UserContext);

  useEffect(() => {
    SetSignedInUser(null);
  }, [SetSignedInUser]);

  useEffect(() =>{
    setLoadingPage(false)
  },[])

  useEffect(() => {
    async function wakeup() {
      const res = await axios({
        method: "get",
        url: `${process.env.NEXT_PUBLIC_BASE_SERVER_URL}`,
      });
    }
    wakeup();
  }, []);

  const Signup = () => {
    if (passwordInput !== confirmPasswordInput) {
      setError("Passwords do not match!");
      return;
    } 
    else if(firstNameInput.length < 2){
      setError("First name must be at least 2 characters")
      return;
    }
    else if(usernameInput.length < 3){
      setError("Username must be at least 3 characters");
      return;
    }
    else if(passwordInput.length < 5){
      setError("Password must be at least 5 characters");
      return;
    }
    else {
      setError("");
    }

    setLoadingPage(true)
    axios({
      method: "post",
      data: {
        username: usernameInput,
        password: passwordInput,
        first_name: firstNameInput,
      },
      withCredentials: true,
      url: `${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/register`,
    })
      .then((res) => {
        if (res.data.success && res.status >= 200 && res.status < 300) {
          router.push("/dashboard");
        } else {
          setLoadingPage;(false)
          setError(res.data);
        }
      })
      .catch((err) => {
        setLoadingPage(false)
        console.log(err);
        setError(
          err.response && err.response.data
            ? err.response.data
            : "An error has occured"
        );
      });
  };

  //sign up with google
  const redirectToGoogleSSO = async () => {
    const googleLoginURL = `${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/login/google`;
    window.open(googleLoginURL, "_blank", "width=500, height=600");

    //the postMessage api used here and in the success/error google-auth routes allow cross origin parent-child window communication.
    const messageListener = (event) => {
      if (
        event.origin === window.location.origin &&
        event.data === "googleSSOLoginSuccess"
      ) {
        window.removeEventListener("message", messageListener);
        router.push("/dashboard");
      }
    };
    window.addEventListener("message", messageListener);
  };

  const getEllipse1 = () => {
    return (
      <svg
        viewBox="0 0 500 500"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          transform: "scale(3) translateY(-7.5%)",
          position: "absolute",
          top: "50%",
        }}
      >
        <defs></defs>
        <path
          fill="rgba(255, 255, 255,0.05)"
          paintOrder="fill"
          d="M 141.144 196.936 C 141.144 196.936 250.461 328.363 382.958 199.836"
          transform="matrix(0.963745, -0.266825, 0.266825, 0.963745, -50.568993, 77.874786)"
        />
        <path
          fill="rgba(255, 255, 255, 0.05)"
          paintOrder="stroke markers"
          d="M 127.669 200.681 C 127.669 200.681 237.882 77.06 368.636 199.71"
          transform="matrix(0.967933, -0.251208, 0.251208, 0.967933, -35.517858, 67.887436)"
        />
      </svg>
    );
  };

  

  return (
    <div className={LoginSignupStyles.MainContainer}>
      {LoadingPage && <LoadingAnimation />}

      <div className={LoginSignupStyles.CenteredContainer}>
        <div className={LoginSignupStyles.LeftSideArt}>
          {getEllipse1()}
          <div className={LoginSignupStyles.backgroundCircle2}></div>
          <img src="/AppLogoTransparent.png"></img>
          <span className={LoginSignupStyles.titleSpan}>
            <h1>Welcome!</h1>
            <p>Sign up to get started</p>
          </span>
        </div>
        <div
          className={LoginSignupStyles.LoginForm}
          style={{ paddingTop: "3%" }}
        >
          <h1>Sign Up</h1>

          <div style={{ display: "flex", width: "101%" }}>
            <input
              type="text"
              placeholder="First Name *"
              onChange={(e) => {
                setFirstNameInput(e.target.value);
              }}
              className={`${LoginSignupStyles.InputField}`}
              autoComplete="off"
              maxLength="100"
              style={{ padding: "12px" }}
            />

            <input
              type="text"
              placeholder="Last Name"
              onChange={(e) => {
                setLastNameInput(e.target.value);
              }}
              className={`${LoginSignupStyles.InputField}`}
              autoComplete="off"
              maxLength="100"
              style={{ padding: "12px" }}
            />
          </div>

          <input
            type="text"
            placeholder="Username *"
            onChange={(e) => {
              setUsernameInput(e.target.value);
            }}
            className={`${LoginSignupStyles.InputField}`}
            autoComplete="off"
            maxLength="100"
            style={{ padding: "12px" }}
          />

          <input
            type="password"
            placeholder="Password *"
            onChange={(e) => {
              setPasswordInput(e.target.value);
            }}
            className={`${LoginSignupStyles.InputField}`}
            autoComplete="off"
            maxLength="100"
            style={{ padding: "12px" }}
          />

          <input
            type="password"
            placeholder="Confirm Password *"
            onChange={(e) => {
              setconfirmPasswordInput(e.target.value);
            }}
            className={`${LoginSignupStyles.InputField}`}
            autoComplete="off"
            maxLength="100"
            style={{ padding: "12px" }}
          />

          <button
            className={LoginSignupStyles.submitBtn}
            onClick={Signup}
            style={{ padding: "12px" }}
          >
            Sign Up
            <FiChevronRight></FiChevronRight>
          </button>
          <p style={{ color: "red" }}>{error}</p>

          <GoogleButton
            onClick={redirectToGoogleSSO}
            type="light"
            style={{
              borderRadius: "50px",
              overflow: "hidden",
              width: "100%",
              height: "50px",
            }}
            className={LoginSignupStyles.GoogleButton}
          ></GoogleButton>

          <button
            className={LoginSignupStyles.alternateButton}
            onClick={() => router.push("/login")}
            style={{ padding: "12px" }}
          >
            Sign in instead
            <FiChevronRight></FiChevronRight>
          </button>
        </div>
      </div>
    </div>
  );
}
