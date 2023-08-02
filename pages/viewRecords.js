import ViewRecordsPageStyles from '../styles/ViewRecords.module.css'
import SideBar from '@/components/sidebar/Sidebar';
import { checkAuthenticationWithCookie } from "@/utils/authUtils";
import { useState, useContext, useEffect} from 'react';
import axios from 'axios';
import ViewRecordsContent from '@/components/records/ViewRecordsContent/ViewRecordsContent';
import { UserContext } from "../contexts/UserContext";
import LoadingAnimation from '@/components/layout/LoadingAnimation/LoadingAnimation';

export default function MyRecords({user, data}){

  const [sidebarClosed, setSidebarClosed] = useState(false);
  const {SignedInUser, SetSignedInUser, LoadingPage, setLoadingPage} = useContext(UserContext);

  useEffect(() => {
    SetSignedInUser(user);
  }, [SetSignedInUser, user]);

  useEffect(() =>{
    setTimeout(() =>{
      setLoadingPage(false)
    }, 400)
  },[])

    return (
      <div className={ViewRecordsPageStyles.ViewRecordsPageContainer}>
        {LoadingPage && (
          <LoadingAnimation/>
        )}
        <div
          className={`${ViewRecordsPageStyles.ViewRecordsSidebarStyle} ${
            sidebarClosed
              ? ViewRecordsPageStyles.ViewRecordsSidebarCloseStyle
              : ViewRecordsPageStyles.ViewRecordsSidebarOpenStyle
          }`}
        >
          <SideBar
            sidebarClosed={sidebarClosed}
            setSidebarClosed={setSidebarClosed}
            pageLocation="viewRecords"
          ></SideBar>
        </div>
        <div className={ViewRecordsPageStyles.ViewRecordsContentStyle}>
          
          <ViewRecordsContent data={data}></ViewRecordsContent>
        </div>
      </div>
    );
}

//serverside protected route
export async function getServerSideProps(context) {
  // Perform authentication and authorization checks here

  const user = await checkAuthenticationWithCookie(context.req.headers.cookie);
  
  if (!user) {

    return {
      redirect: {
        destination:
          "/login",//?authenticationStatusChecked=true&isAuthenticated=false", //incude additional query params to avoid duplicate auth check. authenticationStatusChecked indicates that we already know whether or not the user is authenticated or not, and isAuthenticated=false indicates we know the user isn't authenticated
        permanent: false,
      },
    };
  }

  //get past records
  let data = {};

  //getAllRecords
  const response = await axios({
    method: "post",
    data: {
      ContinuationKey: ""
    },
    withCredentials: true,
    url: `${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/records/getAllRecords`,
    headers: {
      "Content-Type": "application/json", // Set the content type as multipart/form-data
        Cookie: context.req.headers.cookie
    },
  })

  

  return {
    props: {
      user: user,
      data: response.data
    },
  };
}
