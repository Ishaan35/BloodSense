import { useEffect, useState } from 'react'
import  BiomarkerDropdownStyles from './BiomarkerDropdown.module.css'

export default function BiomarkerDropdown({biomarkerList, currentSelectedBiomarker, setCurrentSelectedBiomarker, biomarkerInputText, setBiomarkerInputText}){

    const[filteredBiomarkerList, setFilteredBiomarkerList] = useState([]);

    useEffect(() =>{
        if(biomarkerInputText.trim().localeCompare("") === 0){
            setFilteredBiomarkerList([]);
            return;
        }

        const filteredBiomarkers = biomarkerList.filter(biomarker => {
            return biomarker.toLowerCase().indexOf(biomarkerInputText) >= 0;
        });
        filteredBiomarkers.push(biomarkerInputText + "ㅤ")
        setFilteredBiomarkerList(filteredBiomarkers)

    }, [biomarkerInputText])

    const changeSelectedBiomarker = (e) =>{
        setCurrentSelectedBiomarker(e.target.id);
        setBiomarkerInputText("")
        setFilteredBiomarkerList([])
    }
    
    return (
        <div className={BiomarkerDropdownStyles.Dropdown}>
            <div className={BiomarkerDropdownStyles.DropdownItemList}>
                {filteredBiomarkerList.map((biomarker, idx) =>{
                    return (
                        <div className={BiomarkerDropdownStyles.DropdownItem} key={idx} id={`${biomarker}`} onClick={(e) => changeSelectedBiomarker(e)}>
                            {biomarker.indexOf("ㅤ") < 0 ? (
                                (biomarker)
                            ) : (
                                <>
                                    {biomarker.substring(0, biomarker.indexOf("ㅤ"))}
                                    <em style={{color:"#999999", marginLeft:"15px", pointerEvents:"none"}}>(Custom field)</em>
                                </>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}