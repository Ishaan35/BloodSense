import SidebarStyles from './Sidebar.module.css'
import Link from 'next/link';
import {AiOutlineDashboard, AiOutlineProfile} from 'react-icons/ai'
import {CgProfile} from 'react-icons/cg'
import {IoDocumentTextOutline} from 'react-icons/io5'
import { UserContext } from "../../contexts/UserContext";
import {useState, useContext, useEffect} from 'react'
import Image from 'next/image';
import {BsChevronLeft, BsChevronRight} from 'react-icons/bs'
import {PiGraph} from 'react-icons/pi'
import { Avatar } from '@mui/material';

export default function SideBar(props){

    const {SignedInUser, SetSignedInUser, LoadingPage, setLoadingPage} = useContext(UserContext);
    
    const {sidebarClosed, setSidebarClosed, pageLocation} = props;

    useEffect(() =>{
    }, [SignedInUser])
    return (
      <div className={SidebarStyles.sidebar}>
        <button
          className={`${SidebarStyles.sidebarCloseButton}`}
          onClick={() => setSidebarClosed(!sidebarClosed)}
        >
          {sidebarClosed && (
            <BsChevronRight></BsChevronRight>
          )}
          {!sidebarClosed && (
            <BsChevronLeft></BsChevronLeft>
          )}
        </button>

        {!sidebarClosed && (
          <>
            {SignedInUser && (
              <>
                {SignedInUser.profile_img && (
                  <Image src={SignedInUser.profile_img ? SignedInUser.profile_img : "/default-user.png"} width={`120`} height={`120`} alt='' style={{borderRadius:"50%", border:"5px solid #dfe6f1"}}></Image>
                )}
                {!SignedInUser.profile_img && (
                  <Avatar sx={{width:120, height:120, bgcolor:"#ba3254", fontSize: 40}}>{SignedInUser.first_name[0]}</Avatar>
                )}
                <p className={SidebarStyles.firstNameHeading}>{SignedInUser.first_name + " "} {SignedInUser.last_name} </p>
              </>
            )}
            <Link href="/dashboard" className={SidebarStyles.sidebarLinks} onClick={() => setLoadingPage(pageLocation !== "dashboard")}>
            <div className={SidebarStyles.SidebarLinkDiv}>
              <AiOutlineDashboard></AiOutlineDashboard>
              <label>Dashboard</label>
              {pageLocation === "dashboard"  && (
                <span className={SidebarStyles.activePageHighlightLink}></span>
              )}
              
            </div>
            
          </Link>

          <Link href="/profile" className={SidebarStyles.sidebarLinks} onClick={() => setLoadingPage(pageLocation !== "profile")}>
            <div className={SidebarStyles.SidebarLinkDiv}>
              <CgProfile></CgProfile>
              <label>Profile</label>
              {pageLocation === "profile"  && (
                <span className={SidebarStyles.activePageHighlightLink}></span>
              )}
            </div>
          </Link>

          <Link href="/viewRecords" className={SidebarStyles.sidebarLinks} onClick={() => setLoadingPage(pageLocation !== "viewRecords")}>
            <div className={SidebarStyles.SidebarLinkDiv}>
              <AiOutlineProfile></AiOutlineProfile>
              <label>Past Records</label>
              {pageLocation === "viewRecords"  && (
                <span className={SidebarStyles.activePageHighlightLink}></span>
              )}
            </div>
          </Link>

          <Link href="/viewDocuments" className={SidebarStyles.sidebarLinks} onClick={() => setLoadingPage(pageLocation !== "viewDocuments")}>
            <div className={SidebarStyles.SidebarLinkDiv}>
              <IoDocumentTextOutline></IoDocumentTextOutline>
              <label>Bloodwork Documents</label>
              {pageLocation === "viewDocuments"  && (
                <span className={SidebarStyles.activePageHighlightLink}></span>
              )}
            </div>
          </Link>
          <Link href="/analysis" className={SidebarStyles.sidebarLinks} onClick={() => setLoadingPage(pageLocation !== "analysis")}>
            <div className={SidebarStyles.SidebarLinkDiv}>
              <PiGraph></PiGraph>
              <label>Analysis</label>
              {pageLocation === "analysis"  && (
                <span className={SidebarStyles.activePageHighlightLink}></span>
              )}
            </div>
          </Link>
          </>
        )}
        

      </div>
    );
}