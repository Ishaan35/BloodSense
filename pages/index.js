import IndexStyles from '../styles/index.module.css'
import {FaChevronRight} from 'react-icons/fa'
import Head from "next/head";
import { useState, useContext, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import axios from 'axios';
import { useRouter } from 'next/router';
import LoadingAnimation from '@/components/layout/LoadingAnimation/LoadingAnimation';

export default function Home() {

  const router = useRouter();
  const { SignedInUser, SetSignedInUser, LoadingPage, setLoadingPage } =
    useContext(UserContext);

  useEffect(() =>{
    async function wakeup(){
      const res = await axios({
        method:"get",
        url:`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}`,
        withCredentials:true
      })
    }
    wakeup();
  },[])

  function redirectToLogin() {
    router.push("/signup");
  }

  async function makeRequestWithTimeout() {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Request timeout"));
      }, 4000); // 4 seconds timeout max
    });

    const axiosPromise = axios({
      url: `${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/ping`,
      withCredentials: true,
      method:"get"
    }); 

    try {
      // Wait for either the Axios request to resolve or the timeout to occur
      const result = await Promise.race([axiosPromise, timeoutPromise]);

      // Request completed successfully
      return result;
    } catch (error) {
      // Handle the timeout or other errors
      console.error(error);
      redirectToLogin(); // Redirect the user
      throw error; // Optional: rethrow the error to be handled in the calling code
    }
  }

  //basically even if the user is signed in, if the server is not responding in time as it may just be booting up, we redirect to signup page no matter what
  //if the server is active and we are not authenticated, we get redirected to sign in page regardless
  //if server is active and we are authenticated (within 3 seconds), then we are redirected to dashboard
  async function pingAndTryToGoToDashboard(){
    setLoadingPage(true);
    try {
      const res = await makeRequestWithTimeout();
      if(res && res.status === 200){
        router.push('/dashboard')
      }
      else if(res && res.status >= 400){
        router.push('/signup')
      }
      // Handle the data as needed
    } catch (error) {
      // Handle any errors or the timeout redirect
    }
  }



  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>
          Empower your health with BloodSense - Comprehensive Health Monitoring
          Tool
        </title>
        <meta
          name="description"
          content="Monitoring your health has never been easier. BloodSense is a comprehensive tool that puts you in the driver's seat of your well-being. Easily track your blood test results, manage medical records, and get personalized health analytics."
        />
        <meta
          name="keywords"
          content="BloodSense, health monitoring, blood test results, medical records, health analytics, well-being, health tracking"
        />
        <meta name="author" content="Your Name or Company Name" />

        {/* Open Graph / Facebook */}
        <meta
          property="og:title"
          content="Empower your health with BloodSense - Comprehensive Health Monitoring Tool"
        />
        <meta
          property="og:description"
          content="Monitoring your health has never been easier. BloodSense is a comprehensive tool that puts you in the driver's seat of your well-being. Easily track your blood test results, manage medical records, and get personalized health analytics."
        />
        <meta property="og:image" content="/AppLogoTransparent.png" />
        <meta property="og:image:alt" content="BloodSense Logo" />
        <meta property="og:url" content="https://www.yourwebsite.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="BloodSense" />

        {/* Twitter */}
        <meta
          name="twitter:title"
          content="Empower your health with BloodSense - Comprehensive Health Monitoring Tool"
        />
        <meta
          name="twitter:description"
          content="Monitoring your health has never been easier. BloodSense is a comprehensive tool that puts you in the driver's seat of your well-being. Easily track your blood test results, manage medical records, and get personalized health analytics."
        />
        <meta name="twitter:image" content="/AppLogoTransparent.png" />
        <meta name="twitter:image:alt" content="BloodSense Logo" />
        <meta name="twitter:card" content="summary_large_image" />

        {/* Google / Search Engine Verification */}
        <meta
          name="google-site-verification"
          content="your-google-site-verification-code"
        />

        {/* Canonical URL */}
        <link rel="canonical" href="https://www.yourwebsite.com/" />

        {/* Additional Meta Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="City, State" />
        <meta name="geo.position" content="latitude;longitude" />
        <meta name="ICBM" content="latitude, longitude" />

        {/* Schema.org Markup */}
        <script type="application/ld+json">
          {`
          {
            "@context": "http://schema.org",
            "@type": "WebSite",
            "name": "BloodSense - Comprehensive Health Monitoring Tool",
            "url": "https://www.yourwebsite.com/",
            "sameAs": [
              "https://www.facebook.com/yourpage",
              "https://twitter.com/yourprofile",
              "https://www.linkedin.com/in/yourprofile"
            ],
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://www.yourwebsite.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          }
          `}
        </script>
      </Head>
      <div className={IndexStyles.MainContainer}>
        {LoadingPage && <LoadingAnimation />}
        <div className={IndexStyles.IntroBox}>
          <img
            className={IndexStyles.TopLogo}
            src="/AppLogoTransparent.png"
          ></img>

          <div className={IndexStyles.LeftArticleIntroBox}>
            <h1>Empower your health with BloodSense!</h1>
            <br></br>
            <p>
              Monitoring your health has never been easier.
              {" " + process.env.NEXT_PUBLIC_APP_NAME} is a comprehensive tool
              that puts you in the driver&apos;s seat of your well-being.
              Whether you&apos;re monitoring your blood test results or simply
              organizing your bloodwork documents,{" "}
              {process.env.NEXT_PUBLIC_APP_NAME} makes it easy!
            </p>

            <div
              className={IndexStyles.TryOnDeskTop}
              onClick={() => {
                setLoadingPage(true);
                pingAndTryToGoToDashboard();
              }}
            >
              Get Started Now
              <FaChevronRight></FaChevronRight>
            </div>
            <label style={{ paddingBottom: "20px", color: "whitesmoke" }}>
              Or try the mobile app:
            </label>
            <br></br>
            <br></br>
            <div
              className={IndexStyles.GooglePlayButton}
              onClick={() => {
                window.open(
                  "https://play.google.com/store/apps/details?id=com.ishaanp.test&hl=en&gl=US",
                  "_blank"
                );
              }}
            ></div>
            <br></br>
          </div>
          <div className={IndexStyles.RightArticleIntroBox}>
            <img src="./ComputerBloodTestAppArt.svg" width="105%"></img>
            <a
              target="_blank"
              href="https://www.freepik.com/free-vector/telemedicine-isometric-composition-doctor-studying-information-about-patient-health-laptop-screen-blue_7285707.htm#page=3&query=medical%203d&position=17&from_view=search&track=ais"
              style={{ fontSize: "8px", color: "darkgray" }}
              rel="noreferrer noopener"
            >
              Image by macrovector on Freepik
            </a>
          </div>
        </div>

        <div className={IndexStyles.VerticalColumn}>
          <br></br>
          <br></br>
          <div style={{ display: "flex" }}>
            <div className={IndexStyles.LeftArticleIntroBox}>
              <h1 className={IndexStyles.h1Body}>
                Stay Organized and Informed
              </h1>
              <br></br>

              <p>
                With {process.env.NEXT_PUBLIC_APP_NAME}, you can say goodbye to
                the hassle of managing paper records. Our document storage
                feature lets you keep all your bloodwork documents in one place.
                Easily access past results whenever needed.
              </p>
            </div>
            <div
              className={IndexStyles.RightArticleIntroBox}
              style={{
                borderRadius: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img src="./CloudDocumentArt.svg" width="50%"></img>
              <a
                href="https://www.freepik.com/free-vector/illustration-cloud-with-concept-cloud-storage_2616273.htm#page=3&query=document%203d&position=33&from_view=search&track=ais"
                style={{ fontSize: "8px", color: "#c7c7c7" }}
                rel="noreferrer noopener"
              >
                Image by rawpixel.com on Freepik
              </a>{" "}
            </div>
          </div>

          <br></br>
          <br></br>
          <div style={{ display: "flex" }}>
            <div className={IndexStyles.LeftArticleIntroBox}>
              <h1 className={IndexStyles.h1Body}>
                Spot Trends and Take Action
              </h1>
              <br></br>

              <p>
                Understanding your blood test trends is vital to maintaining
                optimal health. Personalized analytics are provided to give
                clear visualizations of your data, allowing you to spot trends
                and identify potential issues. With this knowledge, you can make
                informed decisions about your lifestyle, diet, and exercise.
              </p>
            </div>
            <div
              className={IndexStyles.RightArticleIntroBox}
              style={{
                borderRadius: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img src="./ChartArt.svg" width="50%"></img>
            </div>
          </div>

          <br></br>
          <br></br>
          <br></br>
          <br></br>
        </div>
      </div>
    </>
  );
}
