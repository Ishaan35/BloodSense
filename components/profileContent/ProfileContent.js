import ProfileContentStyles from "./ProfileContent.module.css";
import { UserContext } from "@/contexts/UserContext";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/router";
import {FiChevronRight, FiArrowRight} from 'react-icons/fi'
import {BiEdit} from 'react-icons/bi'

export default function ProfileContent() {


  const router = useRouter();
  const { SignedInUser } = useContext(UserContext);
  const [savingData, setSavingData] = useState(false);
  const [error, setError] = useState("");
  

  const [changed_first_name, set_changed_first_name] = useState('')
  const [changed_last_name, set_changed_last_name] = useState('');
  const [changed_email, set_changed_email] = useState('');
  const [changed_age, set_changed_age] = useState('');
  const [changed_height_cm, set_changed_height_cm] = useState('');
  const [changed_weight_kg, set_changed_weight_kg] = useState('');
  const [changed_profile_img, set_changed_profile_img] = useState(undefined);
  const [uploaded_picture_url, set_uploaded_picture_url] = useState('')


  const [edit_first_name, set_edit_first_name] = useState(false);
  const [edit_last_name, set_edit_last_name] = useState(false);
  const [edit_email, set_edit_email] = useState(false);
  const [edit_age, set_edit_age] = useState(false);
  const [edit_height_cm, set_edit_height_cm] = useState(false);
  const [edit_weight_kg, set_edit_weight_kg] = useState(false);
  const [edit_profile_img, set_edit_profile_img] = useState(false);

  useEffect(() =>{
    if(SignedInUser){
        set_changed_first_name(SignedInUser.first_name);
        set_changed_last_name(SignedInUser.last_name);
        set_changed_age(SignedInUser.age);
        set_changed_email(SignedInUser.email);
        set_changed_height_cm(SignedInUser.height_cm);
        set_changed_weight_kg(SignedInUser.weight_kg);
        set_changed_profile_img(null);
        if(SignedInUser.profile_img && SignedInUser.profile_img.length > 0)
          set_uploaded_picture_url(SignedInUser.profile_img);
    }
    
  }, [SignedInUser])

  useEffect(() =>{
    if(!changed_profile_img || changed_profile_img === ''){
      set_uploaded_picture_url('');
    }
    else{
      set_uploaded_picture_url(URL.createObjectURL(changed_profile_img));
    }
  }, [changed_profile_img])

  const uploadChanges = async () => {
    if (
      same(changed_first_name, SignedInUser.first_name) &&
      same(changed_last_name, SignedInUser.last_name) &&
      same(changed_email, SignedInUser.email) &&
      same(changed_age, SignedInUser.age) && 
      same(changed_height_cm, SignedInUser.height_cm) && 
      same(changed_weight_kg, SignedInUser.weight_kg) &&
      !changed_profile_img
    ) {
        setError("No changes were made!");
        return;
    }

    if(!changed_first_name || changed_first_name === ''){
        setError("First name cannot be empty!");
        return;
    }
    if(!validateData())
      return;

    setSavingData(true);
    
    try{

      const formData = new FormData();
      if(changed_profile_img && changed_profile_img !== ''){
        formData.append("profileImage", changed_profile_img); // Replace 'imageFile' with your actual image file
      }
      
      formData.append(
      "updatedUserInfo",
      JSON.stringify({
        first_name: changed_first_name,
        last_name: changed_last_name,
        email: changed_email,
        age: changed_age,
        height_cm: changed_height_cm,
        weight_kg: changed_weight_kg,
      }));
        
      const response = await axios({
        method: "post",
        data: formData,
        withCredentials: true,
        url: `${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/profile/changes`,
        headers: {
          "Content-Type": "multipart/form-data", // Set the content type as multipart/form-data
        },
      });
      if(changed_profile_img && response.data.imageUploaded !== undefined && !response.data.imageUploaded){
        setError("Unexpected image upload error. Make sure file is an image!");
      }

      if(response.status === 200){
        router.reload();
      }
    }catch(err){
      console.log(err);
       if(err.response){
        if(err.response.status === 401){
         router.reload();
        }
       }
    }    
    setSavingData(false);
  }

  function validateData() {
    if(changed_age && (parseInt(changed_age) >= 128 || parseInt(changed_age) < 0)){
      setError("Age must be below 128 and non-negative!");
      console.log("Age error");
      return false;
    }
    if(changed_first_name && changed_first_name.length >= 50){
      setError("First name must be less than 50 characters");
      return false;
    }
    if(changed_last_name && changed_last_name.length >= 50){
      setError("Last name must be less than 50 characters");
      return false;
    }
    if(parseFloat(changed_weight_kg) >= 1000){
      setError("Weight must be less than 1000 kg");
      return false;
    }
    if (parseFloat(changed_height_cm) >= 1000) {
      setError("Height must be less than 1000 cm");
      return false;
    }

    if(changed_profile_img && !changed_profile_img.type.startsWith("image/")){
      setError("Profile picture must be an image file")
      return false;
    }
    return true;
  }

  const same = (v1, v2) =>{
    if(v1 === '') v1 = null;
    if(v2 === '') v2 = null;

    if(v1 && !v2 || !v1 && v2) return false;
    if(v1 === v2 || !v1 && !v2 || v1.toString() === v2.toString()) return true;
    return false;
  }
  return (
    <div className={ProfileContentStyles.ProfileContent}>

      <div style={{width:"70vw"}}>
        <div className={ProfileContentStyles.Header}>
            <h1>My Profile</h1>
            <FiChevronRight></FiChevronRight>
            <h2>Edit profile</h2>

            {SignedInUser && (
                  <button disabled={savingData} onClick={uploadChanges} className={ProfileContentStyles.SaveBtn}>
                    <label>Save</label>
                    <FiArrowRight></FiArrowRight>
                  </button>   
              )}
          </div>
          
      </div>
          
      <div className={ProfileContentStyles.ProfilePage}>
          

          <div className={ProfileContentStyles.InfoGrid}>

            <div className={ProfileContentStyles.InfoGridCol1}>
              {/* PROFILE PICTURE */}
              {SignedInUser && (
                <>
                    <div className={ProfileContentStyles.simpleFlexDivCol}>
                      <div className={ProfileContentStyles.imageContainer}>
                        <Image
                          style={{
                            marginLeft: "10px",
                            border: "5px solid rgb(223, 230, 241)",
                            borderRadius: "75px",
                            margin:"30px"
                          }}
                          src={
                            uploaded_picture_url ||
                            SignedInUser.profile_img ||
                            `/default-user.png`
                          }
                          width={150}
                          height={150}
                          alt=""
                        ></Image>
                        <label htmlFor="profile_img_input"><BiEdit></BiEdit></label>
                      </div>
                      <p className={ProfileContentStyles.UpdatedNameStuff}>{changed_first_name} {changed_last_name}</p>
                      <input
                        type="file"
                        accept="image/*"
                        placeholder="cm"
                        id="profile_img_input"
                        hidden
                        className={ProfileContentStyles.ChangeFieldTextInput}
                        value={undefined}
                        onChange={(e) =>
                          set_changed_profile_img(
                            e.target.files.length > 0
                              ? e.target.files[0]
                              : undefined
                          )
                        }
                      ></input>
                      
                    </div>
                </>
              )}
            </div>
            <div className={ProfileContentStyles.InfoGridCol2}>
              {SignedInUser && (
                <>
                  <div className={ProfileContentStyles.FieldRow} style={{gridColumn: "span 2"}}>
                    <label>
                      <b>Username: </b>
                    </label>
                    <div className={ProfileContentStyles.simpleFlexDiv}>
                      <input
                        type="text"
                        placeholder="Username"
                        className={ProfileContentStyles.ChangeFieldTextInput}
                        value={SignedInUser.username}
                        disabled
                      ></input>
                    </div>
                  </div>
                </>
              )}

              {/* FIRST NAME */}
              {SignedInUser && (
                <>
                  <div className={ProfileContentStyles.FieldRow}>
                    <label>
                      <b>First Name: </b>
                    </label>
                    <div className={ProfileContentStyles.simpleFlexDiv}>
                      <input
                        type="text"
                        placeholder="Name"
                        className={ProfileContentStyles.ChangeFieldTextInput}
                        value={changed_first_name}
                        disabled={!edit_first_name}
                        onChange={(e) => set_changed_first_name(e.target.value)}
                      ></input>

                      {!edit_first_name && (
                        <button
                          className={ProfileContentStyles.EditButton}
                          onClick={() => set_edit_first_name(!edit_first_name)}
                        >
                          Edit
                        </button>
                      )}
                      {edit_first_name && (
                        <button
                          className={ProfileContentStyles.DoneChangesButton}
                          onClick={() => set_edit_first_name(!edit_first_name)}
                        >
                          Done
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* LAST NAME */}
              {SignedInUser && (
                <>
                  <div className={ProfileContentStyles.FieldRow}>
                    <label>
                      <b>Last Name: </b>
                    </label>
                    <div className={ProfileContentStyles.simpleFlexDiv}>
                      <input
                        type="text"
                        placeholder="Last Name"
                        className={ProfileContentStyles.ChangeFieldTextInput}
                        value={
                          !changed_last_name || changed_last_name === ""
                            ? ""
                            : changed_last_name
                        }
                        onChange={(e) => set_changed_last_name(e.target.value)}
                        disabled={!edit_last_name}
                      ></input>
                      {!edit_last_name && (
                        <button
                          className={ProfileContentStyles.EditButton}
                          onClick={() => set_edit_last_name(!edit_last_name)}
                        >
                          Edit
                        </button>
                      )}
                      {edit_last_name && (
                        <button
                          className={ProfileContentStyles.DoneChangesButton}
                          onClick={() => set_edit_last_name(!edit_last_name)}
                        >
                          Done
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
              {/* EMAIL */}
              {SignedInUser && !SignedInUser.isGoogle && (
                <>
                  <div className={ProfileContentStyles.FieldRow}>
                    <label>
                      <b>Email: </b>
                    </label>
                    <div className={ProfileContentStyles.simpleFlexDiv}>
                      <input
                        type="email"
                        placeholder="Email"
                        className={ProfileContentStyles.ChangeFieldTextInput}
                        value={
                          !changed_email || changed_email === ""
                            ? ""
                            : changed_email
                        }
                        disabled={!edit_email}
                        onChange={(e) => set_changed_email(e.target.value)}
                      ></input>
                      {!edit_email && (
                        <button
                          className={ProfileContentStyles.EditButton}
                          onClick={() => set_edit_email(!edit_email)}
                        >
                          Edit
                        </button>
                      )}
                      {edit_email && (
                        <button
                          className={ProfileContentStyles.DoneChangesButton}
                          onClick={() => set_edit_email(!edit_email)}
                        >
                          Done
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
              {/* AGE */}
              {SignedInUser && (
                <>
                  <div className={ProfileContentStyles.FieldRow} style={{gridRow:"span 1", gridColumn:"1 / -1", width:"50%"}}>
                    <label>
                      <b>Age: </b>
                    </label>
                    <div className={ProfileContentStyles.simpleFlexDiv}>
                      <input
                        type="number"
                        placeholder="Age"
                        className={ProfileContentStyles.ChangeFieldTextInput}
                        value={
                          !changed_age || changed_age === "" ? "" : changed_age
                        }
                        disabled={!edit_age}
                        onChange={(e) => set_changed_age(e.target.value)}
                      ></input>
                      {!edit_age && (
                        <button
                          className={ProfileContentStyles.EditButton}
                          onClick={() => set_edit_age(!edit_age)}
                        >
                          Edit
                        </button>
                      )}
                      {edit_age && (
                        <button
                          className={ProfileContentStyles.DoneChangesButton}
                          onClick={() => set_edit_age(!edit_age)}
                        >
                          Done
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
              {/* HEIGHT */}
              {SignedInUser && (
                <>
                  <div className={ProfileContentStyles.FieldRow} style={{gridRow:"span 1", gridColumn:"1 / -1", width:"50%"}}>
                    <label>
                      <b>Height {`(cm)`}: </b>
                    </label>
                    <div className={ProfileContentStyles.simpleFlexDiv}>
                      <input
                        type="number"
                        placeholder="cm"
                        className={ProfileContentStyles.ChangeFieldTextInput}
                        value={
                          !changed_height_cm || changed_height_cm === ""
                            ? ""
                            : changed_height_cm
                        }
                        disabled={!edit_height_cm}
                        onChange={(e) => set_changed_height_cm(e.target.value)}
                      ></input>
                      {!edit_height_cm && (
                        <button
                          className={ProfileContentStyles.EditButton}
                          onClick={() => set_edit_height_cm(!edit_height_cm)}
                        >
                          Edit
                        </button>
                      )}
                      {edit_height_cm && (
                        <button
                          className={ProfileContentStyles.DoneChangesButton}
                          onClick={() => set_edit_height_cm(!edit_height_cm)}
                        >
                          Done
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
              {/* WEIGHT */}
              {SignedInUser && (
                <>
                  <div className={ProfileContentStyles.FieldRow} style={{gridRow:"span 1", gridColumn:"1 / -1", width:"50%"}}>
                    <label>
                      <b>Weight {`(kg)`}: </b>
                    </label>
                    <div className={ProfileContentStyles.simpleFlexDiv}>
                      <input
                        type="number"
                        placeholder="kg"
                        className={ProfileContentStyles.ChangeFieldTextInput}
                        value={
                          !changed_weight_kg || changed_weight_kg === ""
                            ? ""
                            : changed_weight_kg
                        }
                        onChange={(e) => set_changed_weight_kg(e.target.value)}
                        disabled={!edit_weight_kg}
                      ></input>
                      {!edit_weight_kg && (
                        <button
                          className={ProfileContentStyles.EditButton}
                          onClick={() => set_edit_weight_kg(!edit_weight_kg)}
                        >
                          Edit
                        </button>
                      )}
                      {edit_weight_kg && (
                        <button
                          className={ProfileContentStyles.DoneChangesButton}
                          onClick={() => set_edit_weight_kg(!edit_weight_kg)}
                        >
                          Done
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}

              <h2 style={{ color: "red" }}>{error}</h2>
              
            </div>
            
          </div>
      </div>
    </div>
  );
}
