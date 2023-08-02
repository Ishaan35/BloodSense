import CompleteYourProfileBoxStyles from './CompleteYourProfileBox.module.css'
import Image from 'next/image';
import { UserContext } from "@/contexts/UserContext";
import { useContext } from "react";
import Link from 'next/link';

export default function CompleteYourProfileBox({loading}){

    const { SignedInUser } = useContext(UserContext);


    if(loading){
        return (
          <div
            className={CompleteYourProfileBoxStyles.MainBoxPlaceholder}
          ></div>
        );
    }
    if (
    SignedInUser &&
    (!SignedInUser.age ||
        !SignedInUser.last_name ||
        !SignedInUser.height_cm ||
        !SignedInUser.weight_kg ||
        !SignedInUser.profile_img ||
        !SignedInUser.email)
    ) {
        return (
          <Link href="/profile">
            <div className={CompleteYourProfileBoxStyles.MainBox}>
              <h2 className={CompleteYourProfileBoxStyles.Title}>
                Complete your profile!
              </h2>
            </div>
          </Link>
        );
    }
    

    return null;
    
}