import Link from "next/link";
import Styles404 from '../styles/404.module.css'

export default function FourOhFour() {
  return (
    <div className={Styles404.MainContainer}>
      <div className={Styles404.center}>
        <h2>The page you were looking for could not be found!</h2>
        <Link href="/">Go back home</Link>
        <img
          src="AppLogoTransparent.png"
          alt=""
          className={Styles404.grayscaleImage}
        />
      </div>
    </div>
  );
}



FourOhFour.getLayout = (page) => {
  return (
    <>
      {page}
    </>
  );
};
