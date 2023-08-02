import UploadDocumentModalStyles from './UploadDocumentModal.module.css'
import {ImUpload2} from 'react-icons/im'
import {AiOutlineFileText} from 'react-icons/ai'
import {RxCross2} from 'react-icons/rx'
import { useState, useRef } from 'react';
import axios from 'axios';
import {useRouter} from 'next/router';


export default function UploadDocumentModal({uploadedFile, setUploadedFile, setDocumentModalOpen}){

    const fileInputRef = useRef(undefined)

    const [error, setError] = useState("");
    const [fileName, setFileName] = useState("");
    const [uploadingFile, setUploadingFile] = useState(false);

    const router = useRouter();

    const fileDropEventHandler = (ev) =>{
        if(uploadingFile) return;
        ev.preventDefault();

        if (ev.dataTransfer.items) {
            // Use DataTransferItemList interface to access the file(s)
            
            if([...ev.dataTransfer.items].length > 1){
                setError("Please upload only one document!")
                return
            }
            setError("")

            let item = [...ev.dataTransfer.items][0]
              // If dropped items aren't files, reject them
            if (item.kind === "file") {
                const file = item.getAsFile();
                if(!file) return;

                if(file.type !== "application/pdf"){
                    setError("Please upload only PDF files!")
                    return;
                }
                setUploadedFile(file);
                setFileName(file.name)
            }
            else{
                setError("Please upload a valid file!")
            }
          } 
          else {
            // Use DataTransfer interface to access the file(s)

            if([...ev.dataTransfer.files].length > 1){
                setError("Please upload only one document!")
                return;
            }
            let file = [...ev.dataTransfer.files][0];
            if(!file) return;
            if(file.type !== "application/pdf"){
                setError("Please upload only PDF files!")
                return;
            }
            setUploadedFile(file);
            setFileName(file.name)
            setError("");
        }

    }

    const fileUploadEventHandler = (e) =>{
        if(uploadingFile) return;
        if(!e.target.files[0])
            return;
        if(e.target.files[0].type !== "application/pdf"){
            setError("Please upload only PDF files!")
            return;
        }
        setError("")
        
        setUploadedFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
    }

    const onDragOverHandler = (ev) =>{
        if(uploadingFile) return;
        // Prevent default behavior (Prevent file from being opened)
        ev.preventDefault();
    }

    const deleteFile = (e) =>{
        if(uploadingFile) return;
        e.stopPropagation();
        setFileName("")
        setError("")
        fileInputRef.current.value = ""
        setUploadedFile(undefined)
    }

    const uploadFileToServer = async() =>{

        setUploadingFile(true);
        try{

            const formData = new FormData();
            if(uploadedFile && fileName !== ''){
              formData.append("uploadedFile", uploadedFile); // Replace 'imageFile' with your actual image file
            }

            const response = await axios({
              method: "post",
              data: formData,
              withCredentials: true,
              url: `${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/document/upload`,
              headers: {
                "Content-Type": "multipart/form-data", // Set the content type as multipart/form-data
              },
            });
      
            if(response.status === 200){
              router.reload();
            }
          }catch(err){
            console.log(err);
             if(err.response){
              if(err.response.status === 401){
               router.reload();
              }
              else{
                setError("Internal Server Error")
              }
             }
          }
    }

    return (
        <div className={UploadDocumentModalStyles.MainContainer}>
            <div className={UploadDocumentModalStyles.ModalContent}>
                <button className={UploadDocumentModalStyles.closeButton} onClick={() => setDocumentModalOpen(false)} disabled={uploadingFile}>
                    <RxCross2></RxCross2>
                </button>
                <div className={UploadDocumentModalStyles.header}>
                    <h2>Upload a document!</h2>
                </div>
                <label htmlFor="fileInput" className={UploadDocumentModalStyles.FileDropZone} id="FileDropZone" onDrop={fileDropEventHandler} onDragOver={onDragOverHandler}>
                    <div className={UploadDocumentModalStyles.dragPrompt}>
                        <p>Click or drag your file here!</p>
                        <ImUpload2></ImUpload2>
                        {error !== "" && 
                            <p style={{color:"#a83232", fontWeight:"400"}}>
                                {error}
                            </p>
                        }
                        {error === "" && (
                            <p></p>
                        )}

                        {uploadedFile && fileName !== "" && (
                            <div className={UploadDocumentModalStyles.fileListBody}>

                                <div className={UploadDocumentModalStyles.FileItem}>
                                    <label style={{position:"absolute", left:"8px"}}>{fileName}</label>
                                    <RxCross2 style={{position:"absolute", right:"8px", color:"#a83232", cursor:"pointer"}} onClick={(e) => deleteFile(e)}></RxCross2>
                                </div>
                                <button className={UploadDocumentModalStyles.uploadButton} disabled={uploadingFile} onClick={uploadFileToServer}>Submit</button>
                            </div>
                            
                        )}
                        {(!uploadedFile || fileName === "") && (
                            <p></p>
                        )}
                    </div>
                </label>

                <input type="file" hidden id="fileInput" onChange={fileUploadEventHandler} ref={fileInputRef} disabled={uploadingFile}></input>
            </div>
        </div>
    )
}