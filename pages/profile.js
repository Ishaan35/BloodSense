import ProfileStyles from '../styles/Profile.module.css'
import { checkAuthenticationWithCookie } from "@/utils/authUtils";
import { useEffect, useState, useContext } from 'react';
import { UserContext } from "../contexts/UserContext";
import SideBar from '@/components/sidebar/Sidebar';
import ProfileContent from '@/components/profileContent/ProfileContent';
import LoadingAnimation from '@/components/layout/LoadingAnimation/LoadingAnimation';

export default function Profile({user}){

    const {SignedInUser, SetSignedInUser, LoadingPage, setLoadingPage} = useContext(UserContext);
    const [loading, setLoading] = useState(false);

    const [sidebarClosed, setSidebarClosed] = useState(false);

    //just note that doing `SetSignedInUser(user)` without a useEffect or something initially isn't allowed
    useEffect(() => {
        SetSignedInUser(user);
    }, [SetSignedInUser, user])

    useEffect(() =>{
      setTimeout(() =>{
        setLoadingPage(false)
      }, 400)
    },[])

    return (
      <div className={ProfileStyles.ProfileContainer}>
        {LoadingPage && (
          <LoadingAnimation/>
        )}
        <div
          className={`${ProfileStyles.ProfileSidebarStyle} ${
            sidebarClosed
              ? ProfileStyles.ProfileSidebarCloseStyle
              : ProfileStyles.ProfileSidebarOpenStyle
          }`}
        >
          <SideBar
            sidebarClosed={sidebarClosed}
            setSidebarClosed={setSidebarClosed}
            pageLocation="profile"
          ></SideBar>
        </div>
        <div className={ProfileStyles.ProfileContentStyle}>
          <ProfileContent loading={loading}></ProfileContent>
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

  return {
    props: {
      user: user,
    },
  };
}


