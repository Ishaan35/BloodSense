import NewRecordPageStyles from '../../styles/NewRecord.module.css'
import NewRecordPageContent from '@/components/records/NewRecordContent/NewRecordPageContent';
import SideBar from '@/components/sidebar/Sidebar';
import { checkAuthenticationWithCookie } from "@/utils/authUtils";

import { useState, useEffect, useContext } from 'react';
import { UserContext } from '@/contexts/UserContext';
import axios from 'axios';
import LoadingAnimation from '@/components/layout/LoadingAnimation/LoadingAnimation';

export default function EditRecord({user, data}){

  const [sidebarClosed, setSidebarClosed] = useState(false);
  const {SignedInUser, SetSignedInUser, LoadingPage, setLoadingPage} = useContext(UserContext);
  const [RECORD_DATA, SET_RECORD_DATA] = useState(undefined)

  useEffect(() => {
    SET_RECORD_DATA(data);
  }, [])

  useEffect(() => {
    SetSignedInUser(user);
}, [SetSignedInUser, user]);

  useEffect(() =>{
    setTimeout(() =>{
      setLoadingPage(false)
    }, 400)
  },[])

    return (
      <div className={NewRecordPageStyles.NewRecordPageContainer}>
        {LoadingPage && (
          <LoadingAnimation/>
        )}
        <div
          className={`${NewRecordPageStyles.NewRecordSidebarStyle} ${
            sidebarClosed
              ? NewRecordPageStyles.NewRecordSidebarCloseStyle
              : NewRecordPageStyles.NewRecordSidebarOpenStyle
          }`}
        >
          <SideBar
            sidebarClosed={sidebarClosed}
            setSidebarClosed={setSidebarClosed}
          ></SideBar>
        </div>
        <div className={NewRecordPageStyles.NewRecordContentStyle}>
          {RECORD_DATA && (
              <NewRecordPageContent RECORD_DATA={RECORD_DATA} SET_RECORD_DATA={SET_RECORD_DATA}></NewRecordPageContent>
          )}
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

  const { recordID } = context.params;

  //get single record by ID
  let response = {};
  try{
    response = await axios({
      method: "post",
      data: {
        RecordID: recordID
      },
      withCredentials: true,
      url: `${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/records/getRecordByRecordID`,
      headers: {
        "Content-Type": "application/json", // Set the content type as multipart/form-data
          Cookie: context.req.headers.cookie
      },
    })

    response = response.data
    
    if(!response){
      throw new Error("Page does not exist")
    }

  }catch(err){
    console.log(err);
    return {
      notFound: true,
    }
  }
  

  return {
    props: {
      user: user,
      data:response
    },
  };
}
