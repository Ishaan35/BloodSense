import RecordClickableItemStyles from './ClickableDocumentItem.module.css'
import Image from 'next/image';
import {HiOutlineDotsVertical, HiOutlineTrash} from 'react-icons/hi'
import { useRouter } from 'next/router';
import { useState, useRef, useEffect } from 'react';


export default function ClickableDocumentItem({documentData, index, deleteDocument}){

    const router = useRouter();
    const [showDeleteOption, setShowDeleteOption] = useState(false);



    const tooltipRef = useRef(null);

    //if we press outside the delete button, close it automatically
    useEffect(() => {
        const handleOutsideClick = (event) => {
          if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
            setShowDeleteOption(false);
          }
        };
    
        const handleEscapeKey = (event) => {
          if (event.key === 'Escape') {
            setShowDeleteOption(false);
          }
        };
    
        if (showDeleteOption) {
          document.addEventListener('mousedown', handleOutsideClick);
          document.addEventListener('keydown', handleEscapeKey);
        }
    
        return () => {
          document.removeEventListener('mousedown', handleOutsideClick);
          document.removeEventListener('keydown', handleEscapeKey);
        };
      }, [showDeleteOption]);

    const redirect = () =>{
        window.open(`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/files/${documentData.document_id}`)
    }

    const deletePrompt = (e) =>{
        e.stopPropagation();
        setShowDeleteOption(!showDeleteOption)
    }

    const deleteRecordElement = (e) =>{
        e.stopPropagation()
        setShowDeleteOption(false)
        deleteDocument(documentData.document_id, documentData.document_name)
    }

    return (
        <div className={RecordClickableItemStyles.MainContainer} onClick={redirect}>
            <Image src="/PDFIcon.png" width={40} height={40} alt=""></Image>
            <div className={RecordClickableItemStyles.RecordDetails}>
                <label>{documentData.document_name}</label>
                <label className={RecordClickableItemStyles.dateDetail}> Last Edited: {new Date(documentData.date_added).toDateString()}</label>
            </div>
            <HiOutlineDotsVertical className={RecordClickableItemStyles.ThreeDots} onClick={deletePrompt}></HiOutlineDotsVertical>
            <div className={showDeleteOption ? RecordClickableItemStyles.DeleteElementPopupActive : RecordClickableItemStyles.DeleteElementPopup} ref={tooltipRef} onClick={(e) => deleteRecordElement(e)}>
                <HiOutlineTrash></HiOutlineTrash>
                <label style={{marginLeft:"5px"}}>Delete?</label>
            </div>
        
        </div>
    )
}