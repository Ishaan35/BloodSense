import Navbar from "@/components/layout/navbar/Navbar"
import "../styles/globals.css";
import { UserContextProvider } from "../contexts/UserContext";
import Footer from "@/components/layout/footer/Footer";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

export default function App({ Component, pageProps }) {
  
  //if the component has a custom getLayout, use that getLayout function instead
    //for example, we may not want the navbar in every page, and if the page's getLayout function excludes the navbar, then it will render without it. Otherwise, the navbar will be added to  each page by default
  if (Component.getLayout) {
    return Component.getLayout(<Component {...pageProps}></Component>);
  }


  return (
    <>
      <UserContextProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Navbar></Navbar>
          <Component {...pageProps} />
          <Footer></Footer>
        </LocalizationProvider>
      </UserContextProvider>
    </>
  );
  
}
