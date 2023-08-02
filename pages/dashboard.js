import { UserContext } from "../contexts/UserContext";
import { useContext, useEffect, useState } from "react";
import { checkAuthenticationWithCookie } from "@/utils/authUtils";
import SideBar from "@/components/sidebar/Sidebar";
import DashboardStyles from "../styles/Dashboard.module.css";
import DashboardContent from "@/components/dashboardContent/DashboardContent";
import LoadingAnimation from "@/components/layout/LoadingAnimation/LoadingAnimation";
import axios from "axios";

export default function Dashboard({user, recentRecords, recentDocuments}) {

  const {SignedInUser, SetSignedInUser, LoadingPage, setLoadingPage} = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const [sidebarClosed, setSidebarClosed] = useState(false);

  //just note that doing `SetSignedInUser(user)` without a useEffect or something initially 
  useEffect(() => {
    SetSignedInUser(user);
  }, [SetSignedInUser, user]);

  useEffect(() =>{
    setTimeout(() =>{
      setLoadingPage(false)
      setLoadingPage(false)
    }, 400)
  },[])

  return (
    <div className={DashboardStyles.DashboardContainer}>
      {LoadingPage && <LoadingAnimation></LoadingAnimation>}
      <div
        className={`${DashboardStyles.DashboardSidebarStyle} ${
          sidebarClosed
            ? DashboardStyles.DashboardSidebarCloseStyle
            : DashboardStyles.DashboardSidebarOpenStyle
        }`}
      >
        <SideBar
          sidebarClosed={sidebarClosed}
          setSidebarClosed={setSidebarClosed}
          pageLocation="dashboard"
        ></SideBar>
      </div>
      <div className={DashboardStyles.DashboardContentStyle}>
        <DashboardContent
          loading={loading}
          recentRecords={recentRecords}
          recentDocuments={recentDocuments}
        ></DashboardContent>
      </div>
    </div>
  );
}

//serverside protected route
export async function getServerSideProps(context) {
  // Perform authentication and authorization checks here

  const user = await checkAuthenticationWithCookie(context.req.headers.cookie);
  if (!user) {
    

    console.log("The user was not authenticated properly")
    return {
      redirect: {
        destination:
          "/login",
        permanent: false,
      },
    };
  }


  const response = await axios({
    method: "post",
    url: `${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/dashboard/getInitData`,
    withCredentials: true,
    headers: {
      // Add any additional headers if needed
      "Content-Type": "application/json",
      Cookie: context.req.headers.cookie,
    },
  });

  if(response.status >= 500){
    response.data = {};
    response.data.recentRecords = [];
    response.data.recentDocuments = []
  }

  return {
    props: {
      user: user,
      recentRecords: response.data.recentRecords,
      recentDocuments: response.data.recentDocuments
    },
  }
}