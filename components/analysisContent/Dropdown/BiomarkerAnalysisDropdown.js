import DropdownStyles from './Dropdown.module.css'
import { useEffect, useState } from 'react'
import {GoSearch} from 'react-icons/go'

export default function BiomarkerAnalysisDropdown({optionList, searchText, setSearchText, handleSearchSelect}){

    const [options, setOptions] = useState([])

    useEffect(() =>{
        setOptions(optionList)
    }, [optionList]);


    return (
        <div className={DropdownStyles.MainContainer}>
            <span className={DropdownStyles.searchInput}>
                <input type="text" onChange={(e) => setSearchText(e.target.value)} value={searchText} ></input>
                <GoSearch></GoSearch>
            </span>
            <div className={DropdownStyles.OptionsContainer}>
                {options && options.map((item, index) =>{
                    return (
                        <div className={DropdownStyles.dropdownItems} key={index} onClick={() => handleSearchSelect(options[index])}>{item.biomarker}</div>
                    )
                })}
            </div>
            
        </div>
    )
}