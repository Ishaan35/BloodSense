import { useEffect, useContext, useState } from "react";
import navbarStyles from './Navbar.module.css'
import Link from "next/link";
import { UserContext } from "../../../contexts/UserContext";
import LogoutBtn from "../../logoutBtn/LogoutBtn";
import Image from "next/image";

export default function Navbar(){

    const { SignedInUser, SetSignedInUser } = useContext(UserContext);
    const [loading, setLoading] = useState(true);

    const [loginSignupStyles, setLoginSignupStyles] = useState({});
    const [loginSignupTextStyles, setLoginSignupTextStyles] = useState({});


    useEffect(() =>{
      if(window.location.pathname === "/login" || window.location.pathname === "/signup"){
        setLoginSignupStyles({
          background: "#f4cece",
          border: "none",
        });
        setLoginSignupTextStyles({
          color: "#414252",
        });
      }
      else if(window.location.pathname === "/" || window.location.pathname === ""){
        setLoginSignupStyles({
          background: "#ffdede",
          borderBottom: "3px solid #f5d0d0",
        });
        setLoginSignupTextStyles({
          color: "#414252",
        });
      }
      else{
        setLoginSignupStyles({})
        setLoginSignupTextStyles({})
      }
    },[SignedInUser])

    useEffect(() =>{
      setLoading(false);
    }, [SignedInUser])

    return (
      <div className={navbarStyles.Navbar} style={loginSignupStyles}>
        <Link href="/dashboard" className={navbarStyles.titleLink}>
          <Image
            width="70"
            height="70"
            src="/AppLogoCircle.png"
            style={{ marginRight: "30px" }}
            alt=""
          ></Image>
          <h1 style={loginSignupTextStyles}>Blood Sense</h1>
        </Link>

        {/* placeholders for navbar when state is loading */}
        {loading && <div className={navbarStyles.placeholderLinks}></div>}
        {loading && <div className={navbarStyles.placeholderLinks}></div>}
        {loading && <div className={navbarStyles.placeholderLinks}></div>}

        {/* 2 links and a placeholder for when not signed in*/}
        {!SignedInUser && !loading && (
          <div className={navbarStyles.placeholderLinks}></div>
        )}
        {!SignedInUser &&
          !loading &&
          window.location.pathname !== "/login" &&
          window.location.pathname !== "/signup" &&
          window.location.pathname !== "/" && (
            <Link
              href="/login"
              className={navbarStyles.navbarLink}
              style={loginSignupTextStyles}
            >
              Login
            </Link>
          )}
        {!SignedInUser &&
          !loading &&
          window.location.pathname !== "/login" &&
          window.location.pathname !== "/signup" &&
          window.location.pathname !== "/" && (
            <Link
              href="/signup"
              className={navbarStyles.navbarLink}
              style={loginSignupTextStyles}
            >
              Sign Up
            </Link>
          )}

        {/* 1 link and 2 placeholders for when signed in*/}
        {SignedInUser && !loading && (
          <div className={navbarStyles.placeholderLinks}></div>
        )}
        {SignedInUser && !loading && (
          <div className={navbarStyles.placeholderLinks}></div>
        )}
        {SignedInUser && !loading && (
          <LogoutBtn className={navbarStyles.navbarLink}></LogoutBtn>
        )}
      </div>
    );
}