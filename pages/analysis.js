import ViewDocumentsPageStyles from '../styles/ViewDocuments.module.css'
import SideBar from '@/components/sidebar/Sidebar';
import { checkAuthenticationWithCookie } from "@/utils/authUtils";
import { useState, useContext, useEffect} from 'react';
import { UserContext } from "../contexts/UserContext";
import AnalysisContent from '@/components/analysisContent/AnalysisContent';
import LoadingAnimation from '@/components/layout/LoadingAnimation/LoadingAnimation';

export default function MyRecords({user, data}){

  const [sidebarClosed, setSidebarClosed] = useState(false);

  const [uploadedFile, setUploadedFile] = useState(undefined);
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
      <div className={ViewDocumentsPageStyles.ViewDocumentsPageContainer}>
        {LoadingPage && (
          <LoadingAnimation/>
        )}
        <div
          className={`${ViewDocumentsPageStyles.ViewDocumentsSidebarStyle} ${
            sidebarClosed
              ? ViewDocumentsPageStyles.ViewDocumentsSidebarCloseStyle
              : ViewDocumentsPageStyles.ViewDocumentsSidebarOpenStyle
          }`}
        >
          <SideBar
            sidebarClosed={sidebarClosed}
            setSidebarClosed={setSidebarClosed}
            pageLocation="analysis"
          ></SideBar>
        </div>
        <div className={ViewDocumentsPageStyles.ViewDocumentsContentStyle}>
          <AnalysisContent></AnalysisContent>
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


  //get past documents
  let data = {};

  

  return {
    props: {
      user: user,
      data: data
    },
  };
}
