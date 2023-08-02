import ViewDocumentsPageStyles from '../styles/ViewDocuments.module.css'
import SideBar from '@/components/sidebar/Sidebar';
import { checkAuthenticationWithCookie } from "@/utils/authUtils";
import { useState, useContext, useEffect} from 'react';
import axios from 'axios';
import ViewDocumentsContent from '@/components/ViewDocumentsContent/ViewDocumentsContent';
import UploadDocumentModal from '@/components/ViewDocumentsContent/UploadDocumentModal/UploadDocumentModal';
import { UserContext } from "../contexts/UserContext";
import LoadingAnimation from '@/components/layout/LoadingAnimation/LoadingAnimation';

export default function MyRecords({user, data}){

  const [sidebarClosed, setSidebarClosed] = useState(false);

  const [uploadDocumentModalOpen, setDocumentModalOpen] = useState(false);
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
        {uploadDocumentModalOpen && (
          <UploadDocumentModal uploadedFile={uploadedFile} setUploadedFile={setUploadedFile} setDocumentModalOpen={setDocumentModalOpen}></UploadDocumentModal>
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
            pageLocation="viewDocuments"
          ></SideBar>
        </div>
        <div className={ViewDocumentsPageStyles.ViewDocumentsContentStyle}>
          <ViewDocumentsContent documentsData={data} uploadedFile={uploadedFile} setUploadedFile={setUploadedFile} setDocumentModalOpen={setDocumentModalOpen}></ViewDocumentsContent>
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

  //get all documents
  const response = await axios({
    method: "post",
    data: {
      ContinuationKey: ""
    },
    withCredentials: true,
    url: `${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/document/getAllDocuments`,
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
