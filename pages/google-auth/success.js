import { useEffect } from "react"
import GoogleAuthStyles from './GoogleAuth.module.css'
import Image from "next/image";

export default function GoogleAuthSuccess(){
    useEffect(() => {
      setTimeout(() => {
        window.opener.postMessage(
          "googleSSOLoginSuccess",
          window.location.origin
        );
        window.close();
      }, 1000);
    }, []);
    
    return (
        <div className={GoogleAuthStyles.MainContainer}>
          <Image width="100" height="100" src="/AppLogoCircle.png" alt=""></Image>
          <p>You will be redirected shortly!</p>
        </div>
    )
}

//this is a custom layout function that determines how we want this page to be rendered. Explicitly states that this page should have no sibling/adjacent components such as a header or footer
GoogleAuthSuccess.getLayout = (page) => {
  return <>
    {page}
  </>;
};
