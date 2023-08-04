import LoginSignupStyles from '../styles/LoginSignup.module.css'
import { useContext, useEffect, useState } from 'react';
import { checkAuthenticationWithCookie } from "@/utils/authUtils";
import axios from 'axios';
import { useRouter } from "next/router";
import { UserContext } from "../contexts/UserContext";
import LoadingAnimation from '@/components/layout/LoadingAnimation/LoadingAnimation';
import GoogleButton from 'react-google-button';
import Image from 'next/image';
import { FiChevronRight } from "react-icons/fi";
import cookie from 'js-cookie';

import {getCookie} from 'cookies-next'

export default function Login(){

    const [usernameInput, setUsernameInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [error, setError] = useState("");

    const { SignedInUser, SetSignedInUser, LoadingPage, setLoadingPage } = useContext(UserContext);

    useEffect(() => {
      SetSignedInUser(null);
    }, [SetSignedInUser]);

    useEffect(() =>{
      setTimeout(() =>{
        setLoadingPage(false)
      }, 400)
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

    const router = useRouter();
    const login = () =>{
      setLoadingPage(true)
      axios({
        method: "post",
        data: {
          username: usernameInput,
          password: passwordInput,
        },
        withCredentials: true,
        url: `${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/login`,
      })
        .then((res) => {
          if (res.data.success && res.status >= 200 && res.status <= 300) {
            router.push("/dashboard");
          } else {
            setError(res.data);
            setLoadingPage(false);
          }
        })
        .catch((err) => {
          setLoadingPage(false)
          setError(
            err.response && err.response.data
              ? err.response.data
              : "An error has occured"
          );
        });
    }

    const redirectToGoogleSSO = async () => {
      const googleLoginURL = `${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/login/google`;
      window.open(
        googleLoginURL,
        "_blank",
        "width=500, height=600"
      );

      //the postMessage api used here and in the success/error google-auth routes allow cross origin parent-child window communication.
      const messageListener = (event) => {
        if (
          event.origin === window.location.origin &&
          event.data === "googleSSOLoginSuccess"
        ) {
          window.removeEventListener("message", messageListener);
          router.push("/dashboard");
        }

        else if (
          event.origin === window.location.origin &&
          event.data === "googleSSOLoginError"
        ) {
          console.error("Google SSO login error!");
          window.removeEventListener("message", messageListener);
          setLoadingPage(true)
          router.push("/login");
        }
      };
      window.addEventListener("message", messageListener);
    };


    const getEllipse1 = () =>{
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
    }

    const redirectToSignup = () =>{
        router.push('/signup')
    }
   


    return (
      <div className={LoginSignupStyles.MainContainer}>
        {LoadingPage && <LoadingAnimation />}

        <div className={LoginSignupStyles.CenteredContainer}>
          <div className={LoginSignupStyles.LeftSideArt}>
            {getEllipse1()}
            <div className={LoginSignupStyles.backgroundCircle2}></div>
            <img src="/AppLogoTransparent.png"></img>
            <span className={LoginSignupStyles.titleSpan}>
              <h1>Welcome Back!</h1>
              <p>Sign in to get started</p>
            </span>
          </div>
          <div className={LoginSignupStyles.LoginForm}>
            <h1>Log In</h1>

            <input
              type="text"
              placeholder="username"
              onChange={(e) => {
                setUsernameInput(e.target.value);
              }}
              className={LoginSignupStyles.InputField}
              autoComplete="off"
              maxLength="100"
            ></input>
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => {
                setPasswordInput(e.target.value);
              }}
              className={LoginSignupStyles.InputField}
              autoComplete="off"
              maxLength="100"
            ></input>

            <button className={LoginSignupStyles.submitBtn} onClick={login}>
              Log In
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
              }}
              className={LoginSignupStyles.GoogleButton}
            ></GoogleButton>

            <br></br>
            <br></br>
            <label
              style={{ fontSize: "small", color: "#b7b9c4", marginLeft: "5px" }}
            >
              Don&apos;t have an account?
            </label>
            <button
              className={LoginSignupStyles.alternateButton}
              onClick={() => redirectToSignup()}
            >
              Sign up
              <FiChevronRight></FiChevronRight>
            </button>
          </div>
        </div>
      </div>
    );
}

