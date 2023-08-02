import DashboardContentStyles from './DashboardContent.module.css'
import CompleteYourProfileBox from './completeProfileBox/CompleteYourProfileBox';
import { UserContext } from '@/contexts/UserContext';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from "next/router";
import axios from 'axios';
import LoadingAnimation from '../layout/LoadingAnimation/LoadingAnimation';
import {BsClipboardHeart, BsClipboard2Check} from 'react-icons/bs'
import {AiOutlineFileSearch} from 'react-icons/ai'
import {SlGraph} from 'react-icons/sl'
import {CgProfile} from 'react-icons/cg'
import {MdOutlineScale} from 'react-icons/md'

import {Chart, ArcElement} from 'chart.js'
Chart.register(ArcElement);
import { Doughnut } from 'react-chartjs-2';
import CountUp from 'react-countup';
import Image from 'next/image';
import {FiChevronRight} from 'react-icons/fi'
import {LuFileClock} from 'react-icons/lu'
import {LiaClipboardListSolid} from 'react-icons/lia'

export default function DashboardContent({recentRecords, recentDocuments}){

    const { SignedInUser, LoadingPage, setLoadingPage } =
      useContext(UserContext);
    const router = useRouter()

    const [profileAmountComplete, setProfileAmountComplete] = useState(0);
    const [numberOfProfileItems, setNumberOfProfileItems] = useState(7);

    //for the profile completed dashboard item
    const [doughnutData, setDoughnutData] = useState(undefined);
    const [doughnutOptions, setDoughnutOptions] = useState(undefined);


    //bmi stuff
    const [bmiBarWidth, setBmiBarWidth] = useState(0);

    const [quickAccessRecords, setQuickAccessRecords] = useState(undefined);
    const [quickAccessDocuments, setQuickAccessDocuments] = useState(undefined);

    useEffect(() =>{
      setQuickAccessDocuments(recentDocuments)
      setQuickAccessRecords(recentRecords)
    }, [recentRecords, recentDocuments])

    useEffect(() =>{
      setTimeout(() =>{
        if(SignedInUser && SignedInUser.weight_kg && SignedInUser.height_cm){
          let bmi = (SignedInUser.weight_kg/(Math.pow(SignedInUser.height_cm/100, 2))).toFixed(2);

          let maxBmi = 36;
          let minBmi = 0;
          
          let widthpercent = (bmi - minBmi) / (maxBmi - minBmi) *100;
          if(widthpercent > 100)
            widthpercent = 100;
          if(widthpercent < 0)
            widthpercent = 0
          setBmiBarWidth(widthpercent)
        }
        else{
          setBmiBarWidth(0);
        }
      }, 25)
    })

    useEffect(() =>{
      let count = 0;
      if(SignedInUser){
        if(SignedInUser.profile_img && SignedInUser.profile_img !== "")
          count++;
        if(SignedInUser.first_name && SignedInUser.first_name !== "")
          count++;
        if(SignedInUser.last_name && SignedInUser.last_name !== "")
          count++;
        if(SignedInUser.email && SignedInUser.email !== "")
          count++;
        if(SignedInUser.age && SignedInUser.age !== "")
          count++;
        if(SignedInUser.height_cm && SignedInUser.height_cm !== "")
          count++;
        if(SignedInUser.weight_kg && SignedInUser.weight_kg !== "")
          count++;



        setProfileAmountComplete(count);

        const data = {
          datasets: [
            {
              data: [count, 7 - count], // [x, y] represents [filled data, remaining data]
              backgroundColor: ["#5edcff", "#959bab"],
            },
          ],
        };

        const options = {
          cutout: "75%", // Adjust this value to control the size of the center hole
          elements: {
            arc: {
              borderWidth: 1,
            },
          },
          animation: {
            animateRotate: true, // Enable rotation animation
            animateScale: true, // Enable scaling animation
            duration: 1000, // Set the animation duration in milliseconds (e.g., 1000ms = 1 second)
          },
        };

        setDoughnutData(data);
        setDoughnutOptions(options);
      }
    },[SignedInUser])

    const CreateNewRecord = async () =>{
      try{
        const response = await axios({
          method: "post",
          data: {},
          withCredentials: true,
          url: `${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/records/createNewRecord`,
          headers: {
            "Content-Type": "application/json", // Set the content type as multipart/form-data
          },
        })
        const responseData = response.data;
        if(response.status >= 200 && response.status < 300){
          setLoadingPage(true);
          router.push(`/records/${responseData.id}`);
        }

      }catch(err){
        router.reload()
      }
    }

    const ViewPastRecords = async() =>{
      setLoadingPage(true)
      router.push('/viewRecords')
    }

    const ViewUploadedDocuments = async() =>{
      setLoadingPage(true)
      router.push('/viewDocuments')
    }

    const ViewAnalysis = async() =>{
      setLoadingPage(true)
      router.push('/analysis')
    }

    const EditProfile = async() =>{
      setLoadingPage(true)
      router.push('/profile')
    }

    const getBMIIndicatorColor = () => {
      if(SignedInUser && SignedInUser.weight_kg && SignedInUser.height_cm){
        let bmi = (SignedInUser.weight_kg/(Math.pow(SignedInUser.height_cm/100, 2))).toFixed(2);

        if(bmi < 18.5)
          return DashboardContentStyles.IndicatorBarUnderweight;
        else if(bmi <= 24.8)
          return DashboardContentStyles.IndicatorBarNormal
        else if(bmi <= 29.9){
          return DashboardContentStyles.IndicatorBarOverweight
        }
        else if(bmi < 34.9)
          return DashboardContentStyles.IndicatorBarObese
        else
          return DashboardContentStyles.IndicatorBarExtremelyObese
      }
    }
    const getBMIIndicatorMeaning = () =>{
      if(SignedInUser && SignedInUser.weight_kg && SignedInUser.height_cm){
        let bmi = (SignedInUser.weight_kg/(Math.pow(SignedInUser.height_cm/100, 2))).toFixed(2);

        if(bmi < 18.5)
          return "UNDERWEIGHT";
        else if(bmi <= 24.8)
          return "NORMAL"
        else if(bmi <= 29.9){
          return "OVERWEIGHT"
        }
        else if(bmi < 34.9)
          return "OBESE"
        else
          return "EXTREMELY OBESE"
      }
      else
        return ""
    }

    const redirectToRecord = (id) =>{
      setLoadingPage(true);
      router.push(`/records/${id}`)
    }
    const redirectToDocument = (id) => {
      window.open(
        `${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/files/${id}`
      );
    };

    return (
      <div className={DashboardContentStyles.DashboardContent}>
        <div className={DashboardContentStyles.MainGrid}>
          <div
            className={DashboardContentStyles.createNewRecordBox}
            onClick={CreateNewRecord}
          >
            <label>Create a new record!</label>
            <div className={DashboardContentStyles.newRecordIcon}>
              <BsClipboardHeart></BsClipboardHeart>
            </div>
          </div>

          <div
            className={DashboardContentStyles.createNewRecordBox}
            onClick={ViewPastRecords}
          >
            <label>View my Past Records</label>
            <div className={DashboardContentStyles.pastRecordsIcon}>
              <BsClipboard2Check></BsClipboard2Check>
            </div>
          </div>

          <div
            className={DashboardContentStyles.createNewRecordBox}
            onClick={ViewUploadedDocuments}
          >
            <label>View my Uploaded Documents</label>
            <div className={DashboardContentStyles.pastDocumentsIcon}>
              <AiOutlineFileSearch></AiOutlineFileSearch>
            </div>
          </div>

          <div
            className={DashboardContentStyles.createNewRecordBox}
            onClick={ViewAnalysis}
          >
            <label>Compare and Analyze Bloodwork</label>
            <div className={DashboardContentStyles.analyzeRecordsIcon}>
              <SlGraph></SlGraph>
            </div>
          </div>

          {SignedInUser &&
            !(
              SignedInUser.age &&
              SignedInUser.last_name &&
              SignedInUser.height_cm &&
              SignedInUser.weight_kg &&
              SignedInUser.profile_img &&
              SignedInUser.email
            ) && (
              <div
                className={DashboardContentStyles.editProfileBox}
                onClick={EditProfile}
              >
                <span
                  className={DashboardContentStyles.completeProfileHeadingSpan}
                >
                  <label>Complete your profile</label>
                  <div className={DashboardContentStyles.profileIcon}>
                    <CgProfile></CgProfile>
                  </div>
                </span>
                {doughnutData && doughnutOptions && (
                  <div
                    className={
                      DashboardContentStyles.ProfileCompleteDoughnutStyles
                    }
                  >
                    <Doughnut data={doughnutData} options={doughnutOptions} />
                    <CountUp
                      className={DashboardContentStyles.DoughnutPercentLabel}
                      end={parseInt(
                        (profileAmountComplete / numberOfProfileItems) * 100
                      )}
                      suffix="%"
                      duration={1.5}
                    ></CountUp>
                  </div>
                )}
              </div>
            )}

          {SignedInUser && (
            <div
              className={DashboardContentStyles.editProfileBox}
              onClick={EditProfile}
            >
              <span
                className={DashboardContentStyles.completeProfileHeadingSpan}
              >
                <label>BMI</label>
                <div className={DashboardContentStyles.BMIIcon}>
                  <MdOutlineScale></MdOutlineScale>
                </div>
              </span>
              {SignedInUser.weight_kg && SignedInUser.height_cm && (
                <>
                  <CountUp
                    end={
                      SignedInUser.weight_kg /
                      Math.pow(SignedInUser.height_cm / 100, 2)
                    }
                    start={0}
                    delay={0}
                    duration={1.5}
                    decimals={2}
                  >
                    {({ countUpRef }) => (
                      <div>
                        <span
                          ref={countUpRef}
                          className={DashboardContentStyles.BMILabel}
                        />
                      </div>
                    )}
                  </CountUp>
                  <div
                    className={`${
                      DashboardContentStyles.IndicatorBar
                    } ${getBMIIndicatorColor()}`}
                    style={{ width: `${bmiBarWidth}%` }}
                  ></div>

                  <label className={DashboardContentStyles.IndicatorMeaning}>
                    {getBMIIndicatorMeaning()}
                  </label>
                </>
              )}
              {(!SignedInUser.weight_kg || !SignedInUser.height_cm) && (
                <CountUp
                  end={parseInt(
                    (profileAmountComplete / numberOfProfileItems) * 100
                  )}
                  start={0}
                  delay={0}
                  duration={1.5}
                >
                  {({ countUpRef }) => (
                    <div>
                      <span className={DashboardContentStyles.BMILabel}>
                        --
                      </span>
                    </div>
                  )}
                </CountUp>
              )}
            </div>
          )}

          <div className={DashboardContentStyles.QuickAccessContainer}>
            <span className={DashboardContentStyles.completeProfileHeadingSpan}>
              <label>Recent Records</label>
              <div className={DashboardContentStyles.recentRecordIcon}>
                <LiaClipboardListSolid></LiaClipboardListSolid>
              </div>
            </span>

            <div className={DashboardContentStyles.recentItemlist}>
              {quickAccessRecords &&
                quickAccessRecords.map((item) => {
                  return (
                    <div
                      className={DashboardContentStyles.ClickableListItem}
                      onClick={() => redirectToRecord(`${item.id}`)}
                      key={item.id}
                    >
                      <Image
                        src="/RecordIcon.svg"
                        width={40}
                        height={40}
                        alt=""
                      ></Image>

                      <label>
                        {item.record_name}
                        <FiChevronRight></FiChevronRight>
                      </label>
                    </div>
                  );
                })}

              {(!quickAccessRecords || quickAccessRecords.length <= 0) && (
                <p
                  style={{
                    color: "#a1a1a1",
                    fontWeight: "400",
                    fontSize: "18px",
                  }}
                >
                  You have no recent records!
                </p>
              )}
            </div>
          </div>

          <div className={DashboardContentStyles.QuickAccessContainer}>
            <span className={DashboardContentStyles.completeProfileHeadingSpan}>
              <label>Recent Documents</label>
              <div className={DashboardContentStyles.recentDocumentIcon}>
                <LuFileClock></LuFileClock>
              </div>
            </span>

            <div className={DashboardContentStyles.recentItemlist}>
              {quickAccessDocuments &&
                quickAccessDocuments.map((item) => {
                  return (
                    <div
                      className={DashboardContentStyles.ClickableListItem}
                      onClick={() => redirectToDocument(`${item.document_id}`)}
                      key={`${item.document_id}`}
                    >
                      <Image
                        src="/PDFIcon.png"
                        width={40}
                        height={40}
                        alt=""
                      ></Image>

                      <label>
                        {item.document_name}
                        <FiChevronRight></FiChevronRight>
                      </label>
                    </div>
                  );
                })}
              {(!quickAccessDocuments || quickAccessDocuments.length <= 0) && (
                <p
                  style={{
                    color: "#a1a1a1",
                    fontWeight: "400",
                    fontSize: "18px",
                  }}
                >
                  You have no recent documents!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
}