import FormElementStyles from './FormElement.module.css'
import {HiOutlineDotsVertical, HiOutlineTrash} from 'react-icons/hi'
import { useEffect, useState, useRef } from 'react'

export default function FormElement({formElementData, index, deleteFormElement}){

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

    return (
        <div className={FormElementStyles.FormElement}>
            <label className={FormElementStyles.FormElementTitle}>{formElementData.biomarker}</label>
            <label className={FormElementStyles.FormElementValue}>
                {formElementData.measuredValue}
                <label>{formElementData.selectedMeasure}</label>
            </label>
            <HiOutlineDotsVertical className={FormElementStyles.FormElementThreeDots} onClick={() => setShowDeleteOption(!showDeleteOption)}></HiOutlineDotsVertical>
            
            <div className={showDeleteOption ? FormElementStyles.DeleteElementPopupActive : FormElementStyles.DeleteElementPopup} ref={tooltipRef} onClick={() => {setShowDeleteOption(false); deleteFormElement(index)}}>
                <HiOutlineTrash></HiOutlineTrash>
                <label style={{marginLeft:"5px"}}>Delete?</label>
            </div>
        </div>
    )
}