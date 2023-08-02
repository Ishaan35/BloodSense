import { useEffect } from "react";
import GoogleAuthStyles from './GoogleAuth.module.css'
import Image from "next/image";


export default function GoogleAuthError() {
  useEffect(() => {
    setTimeout(() => {
      window.opener.postMessage(
        "googleSSOLoginError",
        window.location.origin
      );
      window.close();
    }, 1000);
  }, []);

  return (
      <div className={GoogleAuthStyles.MainContainer}>
          <Image width="100" height="100" src="/AppLogoCircle.png" alt=""></Image>
          <p>There was an error authenticating with your Google Account. Please try again later!</p>
      </div>
  );
}

GoogleAuthError.getLayout = (page) => {
  return <>{page}</>;
};
