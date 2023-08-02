import axios from "axios";
import { useRouter } from "next/router";
import {MdLogout} from 'react-icons/md'

import LogoutButtonStyles from './LogoutBtn.module.css'

export default function LogoutBtn(){
    const router = useRouter();
    
    const handleLogout = async () => {
      try {
        const response = await axios({
          method: "post",
          withCredentials: true,
          url: `${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/logout`,
        }); 


        localStorage.clear(); // Clear any stored user data, if applicable
        router.push("/login"); // Redirect the user to the sign-in page
      } catch (error) {
        console.error("Error logging out:", error);
      }
    };

    return (
        <>
            <button onClick={handleLogout} className={LogoutButtonStyles.MainContainer}> <MdLogout> </MdLogout>Sign Out</button>
        </>
    )
}