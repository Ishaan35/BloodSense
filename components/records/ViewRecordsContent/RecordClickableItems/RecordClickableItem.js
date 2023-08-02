import RecordClickableItemStyles from './RecordClickableItem.module.css'
import Image from 'next/image';
import {HiOutlineDotsVertical, HiOutlineTrash} from 'react-icons/hi'
import { useRouter } from 'next/router';
import { useState, useRef, useEffect, useContext } from 'react';
import { UserContext } from '@/contexts/UserContext';

export default function RecordClickableItem({record, index, trashRecord}){

    const router = useRouter();
    const [showDeleteOption, setShowDeleteOption] = useState(false);
    const {SignedInUser, SetSignedInUser, LoadingPage, setLoadingPage} = useContext(UserContext);



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
      setLoadingPage(true);
        router.push(`/records/${record.id}`)
    }

    const deletePrompt = (e) =>{
        e.stopPropagation();
        setShowDeleteOption(!showDeleteOption)
    }

    const deleteRecordElement = (e) =>{
        e.stopPropagation()
        setShowDeleteOption(false)
        trashRecord(index)
    }

    return (
        <div className={RecordClickableItemStyles.MainContainer} onClick={redirect}>
            <Image src="/RecordIcon.svg" width={40} height={40} alt=""></Image>
            <div className={RecordClickableItemStyles.RecordDetails}>
                <label>{record.record_name}</label>
                <label className={RecordClickableItemStyles.dateDetail}> Last Edited: {new Date(record.date_edited).toDateString()}</label>
            </div>
            <HiOutlineDotsVertical className={RecordClickableItemStyles.ThreeDots} onClick={deletePrompt}></HiOutlineDotsVertical>
            <div className={showDeleteOption ? RecordClickableItemStyles.DeleteElementPopupActive : RecordClickableItemStyles.DeleteElementPopup} ref={tooltipRef} onClick={(e) => deleteRecordElement(e)}>
                <HiOutlineTrash></HiOutlineTrash>
                <label style={{marginLeft:"5px"}}>Delete?</label>
            </div>
        
        </div>
    )
}