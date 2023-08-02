import NewBiomarkerStyles from './NewBiomarkerStyles.module.css'
import {FiSearch} from 'react-icons/fi'
import {AiOutlinePlus} from 'react-icons/ai'
import MeasureSlider from './MeasureSlider/MeasureSlider'
import { useEffect, useState } from 'react';
import BiomarkerDropdown from './BiomarkerDropdown/BiomarkerDropdown';
import {RxCross2} from 'react-icons/rx'
import { readBiomarkerJSONFile } from '@/utils/loadBiomarkerData';

export default function NewBiomarkerSelect({FormElements,SetFormElements}){

    const [BiomarkerData, SetBiomarkerData] = useState([]);
    const [BiomarkerNames, setBiomarkerNames] = useState([])
    const [biomarkerInputText, setBiomarkerInputText] = useState("");
    const [currentSelectedBiomarker, setCurrentSelectedBiomarker] = useState("");
    const [measureOptions, setMeasureOptions] = useState([]);
    const [selectedMeasure, setSelectedMeasure] = useState("");
    const [measuredValue, setMeasuredValue] = useState(0);
    const [customUnitMeasure, setCustomUnitMeasure] = useState("");

    const [validEntry, setValidEntry] = useState(false);

    useEffect(() =>{
        const readData = async () =>{
            const jsonData = await readBiomarkerJSONFile();
            SetBiomarkerData(jsonData);
            setBiomarkerNames(jsonData.map(item => item.biomarker))
        }
        readData()
        setValidEntry(false)
    }, [])

    useEffect(() =>{
        const marker = BiomarkerData.find(item => item.biomarker === currentSelectedBiomarker);
        if(marker){
            setMeasureOptions(marker.units)
            setSelectedMeasure(marker.units[0])
        }
        checkIfCustomBioMarker();

    }, [currentSelectedBiomarker])

    useEffect(() =>{
        setValidEntry(currentSelectedBiomarker !== "" && measuredValue !== "0" && (measureOptions.length >= 1 || (customUnitMeasure !== "")) && measuredValue !== "");
    }, [measuredValue, measureOptions, currentSelectedBiomarker, customUnitMeasure])

    const resetSelection = () =>{
        setCurrentSelectedBiomarker("")
    }

    const checkIfCustomBioMarker = () =>{
        if(!BiomarkerNames.includes(currentSelectedBiomarker)){
            setMeasureOptions([]);
            setSelectedMeasure("");
        }
    }

    const AddEntryToList = () =>{

        SetFormElements([{        
            biomarker: currentSelectedBiomarker,
            selectedMeasure: selectedMeasure,
            measureOptions: measureOptions,
            customUnitMeasure: customUnitMeasure,
            measuredValue: measuredValue
        }, ...FormElements])
        
        //add it to the list and clear everything
        if(!validEntry) return;
        setSelectedMeasure([])
        setBiomarkerInputText("");
        setMeasureOptions([]);
        setValidEntry(false);
        setCurrentSelectedBiomarker("");
        setMeasuredValue(0);
        setCustomUnitMeasure("")
    }

    

    return (
        <div className={NewBiomarkerStyles.MainBox}>

            <p style={{fontSize:"25px", fontWeight:"500"}}>New Biomarker</p>

            <div className={NewBiomarkerStyles.newBiomarkerInputRows}>
                <label htmlFor="metricSearch">Biomarker</label>
                <span className={NewBiomarkerStyles.SelectBiomarkerContainer}>
                    {currentSelectedBiomarker !== "" && (
                        <div className={NewBiomarkerStyles.newBiomarkerSelectedMarker}>
                            <label>{currentSelectedBiomarker}</label>
                            <RxCross2 style={{marginLeft:"10px", transform:"scale(1.1)", marginBottom:"1px", cursor:"pointer"}} onClick={resetSelection}></RxCross2>
                        </div>
                    )}
                    
                    <span>
                        <div className={NewBiomarkerStyles.newBiomarkerInputField}>
                            <input type="text" placeholder='Search' id="metricSearch" onChange={(e) => setBiomarkerInputText(e.target.value)} value={biomarkerInputText}></input>
                            <FiSearch></FiSearch>
                        </div>
                        <BiomarkerDropdown biomarkerList={BiomarkerNames} currentSelectedBiomarker={currentSelectedBiomarker} setCurrentSelectedBiomarker={setCurrentSelectedBiomarker} biomarkerInputText={biomarkerInputText} setBiomarkerInputText={setBiomarkerInputText}></BiomarkerDropdown>
                    </span>
                </span>
                
                
            </div>

            <div className={NewBiomarkerStyles.newBiomarkerInputRows}>
                <label htmlFor='valueInput'>Value</label>
                <div className={NewBiomarkerStyles.newBiomarkerInputField}>
                    <input type="number" placeholder='For example, ' id="valueInput" value={measuredValue} onChange={(e) => setMeasuredValue(e.target.value)}></input>
                </div>
            </div>

            <div className={NewBiomarkerStyles.newBiomarkerInputRows}>
                <label htmlFor='valueInput'>Measure</label>
                <MeasureSlider options={measureOptions} selectedMeasure={selectedMeasure} setSelectedMeasure={setSelectedMeasure} customUnitMeasure={customUnitMeasure} setCustomUnitMeasure={setCustomUnitMeasure}></MeasureSlider>
            </div>

            <div className={NewBiomarkerStyles.newBiomarkerInputRows} style={{justifyContent:"center"}}>
                <div className={validEntry ? NewBiomarkerStyles.addBtn : NewBiomarkerStyles.addBtnDisabled} onClick={AddEntryToList}>
                    Add
                    <AiOutlinePlus></AiOutlinePlus>
                </div>
                
            </div>
            
        </div>
    )
}