import BiomarkerAnalysisDropdown from '../Dropdown/BiomarkerAnalysisDropdown'
import AnalysisByBiomarkerStyles from './AnalysisByBiomarker.module.css'
import { useEffect, useState } from 'react'
import axios from 'axios';
import { readBiomarkerJSONFile } from '@/utils/loadBiomarkerData';
import {useRouter} from 'next/router'
import {RxCross2} from 'react-icons/rx'
import { DateCalendar, DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import AnalysisByBiomarkerGraph from './AnalysisByBiomarkerGraph/AnalysisByBiomarkerGraph';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

export default function AnalysisByBiomarker(){

    
    const [biomarkerList, setBiomarkerList] = useState([]);
    const [filteredBiomarkerList, setFilteredBiomarkerList] = useState([])
    const router = useRouter();
    const [error, setError] = useState("");

    const [searchText, setSearchText] = useState("")
    const [selectedBiomarker, setSelectedBiomarker] = useState("");
    const [selectedBiomarkerData, setSelectedBiomarkerData] = useState(undefined);

    const [minimumDate, setMinimumDate] = useState(dayjs());
    const [minimumDateFormatted, setMinimumDateFormatted] = useState("");


    const [loading, setLoading] = useState(false);


    //these represent the fetched graph data that doesnt change until the user hits Go! again
    const [biomarkerPastRecordData, setBiomarkerPastRecordData] = useState(undefined);
    const [filteredBiomarkerPastRecordData, setFilteredBiomarkerPastRecordData] = useState(undefined)
    const [fetchedDataBiomarker, setFetchedDataBiomarker] = useState(undefined); //string
    const [currentGraphBiomarker, setCurrentGraphBiomarker] = useState(undefined) //data object containing general details of that biomarker
    const [currentBiomarkerUnitOptions, setCurrentBiomarkerUnitOptions] = useState(undefined);
    const [currentSelectedUnit, setCurrentSelectedUnit] = useState(undefined);

    useEffect(() =>{
        setMinimumDateFormatted(minimumDate.format('YYYY-MM-DD'))
    }, [minimumDate])

    useEffect(() =>{
        setError("");
        fetchBiomarkers();
    }, []);

    useEffect(() =>{
        handleInputChange();
    }, [searchText])


    const fetchBiomarkers = async () =>{
        setLoading(true);
        let jsonData = await readBiomarkerJSONFile();
        try{
            const response = await axios({
                method:"get",
                url:`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/records/getCustomBiomarkers`,
                withCredentials: true,
            })
            let customBiomarkers = response.data;
            customBiomarkers.forEach((item) =>{
                jsonData.push({
                    biomarker: item.biomarker,
                    units:[...item.measure]
                })
            })
        }catch(err){
            if(err.response && err.response.status === 401)
                handleLogout();
            else{
                setError("There was an error connecting to the server. Please refresh the page and try again!")
            }
        }
        setLoading(false);
        setBiomarkerList(jsonData)
    }

    const handleLogout = async () => {
        try {
          const response = await axios({
            method: "post",
            withCredentials: true,
            url: `${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/logout`,
          }); 
    
          localStorage.clear(); // Clear any stored user data, if applicable
          router.push("/login"); // Redirect the user to the sign-in page
        } catch (error) {
          console.error("Error logging out:", error);
        }
    };
    
    const handleInputChange = () =>{
        //filter the data
        if(searchText === ""){
            setFilteredBiomarkerList([]);
            return
        }
        setFilteredBiomarkerList(biomarkerList.filter((item) =>{
            return item.biomarker.toLowerCase().indexOf(searchText.toLowerCase()) >= 0
        }))
    }
    
    const handleSearchSelect = (item) =>{
        setSearchText("");
        setSelectedBiomarker(item.biomarker);
        setSelectedBiomarkerData(item)
    }
    const clearSelection = () =>{
        setSelectedBiomarker("");
        setSelectedBiomarkerData(undefined)
        setSearchText("");
    }

    //remember, some items have an upper bound of infinity
    const fetchData = async () =>{
        //make sure data is valid and that we are arent re-fetching the same biomarker again and again
        if(minimumDateFormatted === "" || selectedBiomarker === "")
            return;
        
        
        setLoading(true);
        setFetchedDataBiomarker(selectedBiomarker);

        const fetchURL = `${[process.env.NEXT_PUBLIC_BASE_SERVER_URL]}/analysis/getBiomarkerFromEveryRecord`
        const response = await axios({
            url:fetchURL,
            withCredentials:true,
            data: {
                selectedBiomarker:selectedBiomarker,
                minimumDate:minimumDateFormatted
            },
            method:"post"
        })        
        response.data.sort((a,b) =>{
            return a.recordDate.localeCompare(b.recordDate)
        })
        setBiomarkerPastRecordData(response.data)
        setCurrentGraphBiomarker(JSON.parse(JSON.stringify(selectedBiomarkerData)))
        
        //unit data
        setCurrentSelectedUnit(selectedBiomarkerData.units[0])
        setFilteredBiomarkerPastRecordData(response.data.filter((item) =>{
            return (
              item.selectedMeasure === selectedBiomarkerData.units[0] ||
              item.selectedMeasure.trim() === selectedBiomarkerData.units[0]
            );
        }))
        setCurrentBiomarkerUnitOptions(selectedBiomarkerData.units);

        //construct a graph here i guess

        

        setLoading(false);

    }

    function changeSelectedUnitForGraph(selection){
        setCurrentSelectedUnit(selection.value);
        setFilteredBiomarkerPastRecordData(biomarkerPastRecordData.filter((item) =>{
            return item.selectedMeasure === selection.value || item.selectedMeasure.trim() === selection.value;
        }))
    }

    function normalRangeText(){
        let normalRangeText = currentGraphBiomarker.normalRanges[currentSelectedUnit];
        if (!normalRangeText) {
          normalRangeText =
            currentGraphBiomarker.normalRanges[currentSelectedUnit.trim()];
        }
        let rangeVals = normalRangeText.split("-");

        if(rangeVals[1].toLowerCase().indexOf("infinity") >= 0){
            return rangeVals[0] + "-" + rangeVals[1]
        }
        else{
            return rangeVals[0] + "-" + rangeVals[1];
        }
    }

    function formattedNormalRangeText(){

        let normalRangeText = currentGraphBiomarker.normalRanges[currentSelectedUnit];
        if (!normalRangeText) {
          normalRangeText =
            currentGraphBiomarker.normalRanges[currentSelectedUnit.trim()];
        }
        let rangeVals = normalRangeText.split("-");

        if(rangeVals[1].toLowerCase().indexOf("infinity") >= 0){
            return " > " + rangeVals[0]
        }
        else{
            return rangeVals[0] + "-" + rangeVals[1];
        }
    }

    const isNormalRange = (val, measureUnit) =>{

        let normalRangeText = currentGraphBiomarker.normalRanges[measureUnit]
        if(!normalRangeText){
            normalRangeText = currentGraphBiomarker.normalRanges[measureUnit.trim()];
        }
        let rangeVals = normalRangeText ? normalRangeText.split('-') : ["0","0"];
        if(rangeVals[1].toLowerCase().indexOf("infinity") >= 0){
            return val >= parseFloat(rangeVals[0])
        }
        else{
            return val >= parseFloat(rangeVals[0]) && val <= parseFloat(rangeVals[1]);
        }

    }
    
    return (
        <div className={AnalysisByBiomarkerStyles.MainContainer}>
            

            <br></br>
            <br></br>

            <div className={AnalysisByBiomarkerStyles.SearchBox}>
                <p className={AnalysisByBiomarkerStyles.Heading}>Analysis by Biomarker</p>
                <label className={AnalysisByBiomarkerStyles.prompt}>Select a Biomarker:</label>

                <div className={AnalysisByBiomarkerStyles.AllInputs}>
                    <div className={AnalysisByBiomarkerStyles.Dropdown}>
                        <BiomarkerAnalysisDropdown optionList={filteredBiomarkerList} searchText={searchText} setSearchText={setSearchText}  handleSearchSelect={handleSearchSelect}></BiomarkerAnalysisDropdown>
                        {selectedBiomarker !== "" && (
                            <div className={AnalysisByBiomarkerStyles.SelectedBiomarker}>
                                {selectedBiomarker}
                                <RxCross2 onClick={clearSelection}></RxCross2>
                            </div>
                        )}
                    </div>

                    <div className={AnalysisByBiomarkerStyles.DateInput}>
                        <label htmlFor='dateInput'>Earliest Date:</label>
                        {/* <input type='Date' id="dateInput"></input> */}
                        <DatePicker onChange={(newValue) => setMinimumDate(newValue)} value={minimumDate}></DatePicker>
                    </div>

                    <button className={AnalysisByBiomarkerStyles.SearchButton} disabled={loading} onClick={fetchData}>Go!</button>
                </div>
                
            </div>
            {error !== "" && (
                <p style={{color:"red"}}>{error}</p>
            )}

            <br></br>
            <br></br>
            <div className={AnalysisByBiomarkerStyles.GraphContainer}>

                {currentGraphBiomarker !== undefined && currentGraphBiomarker.normalRanges && (
                    <div className={AnalysisByBiomarkerStyles.NormalRangeText}>
                        <div className={AnalysisByBiomarkerStyles.NormalRangeLegendIcon}></div>
                        <div className={AnalysisByBiomarkerStyles.NormalRangeHeading}>Normal Range: </div>
                        <div>{formattedNormalRangeText()} {currentSelectedUnit}</div>
                    </div>
                )}
                {currentBiomarkerUnitOptions && (
                    <div className={AnalysisByBiomarkerStyles.UnitSelectInput}>
                        <Dropdown   options={currentBiomarkerUnitOptions} onChange={changeSelectedUnitForGraph} value={currentSelectedUnit} placeholder={"Select"} />
                    </div>
                )}
                <br></br>
                {(
                    <>
                    <AnalysisByBiomarkerGraph chartData={filteredBiomarkerPastRecordData} currentGraphBiomarker={currentGraphBiomarker} currentSelectedUnit={currentSelectedUnit} graphType={"Bar"} normalRangeText={(currentGraphBiomarker !== undefined && currentGraphBiomarker.normalRanges) ?  normalRangeText() : undefined}>
                    </AnalysisByBiomarkerGraph> 
                    <AnalysisByBiomarkerGraph chartData={filteredBiomarkerPastRecordData} currentGraphBiomarker={currentGraphBiomarker} currentSelectedUnit={currentSelectedUnit} graphType={"Line"} normalRangeText={(currentGraphBiomarker !== undefined && currentGraphBiomarker.normalRanges) ?  normalRangeText() : undefined}>
                    </AnalysisByBiomarkerGraph>
                    </>
                    
                )}
            </div>
            <br></br>
            <br></br>
            <div className={AnalysisByBiomarkerStyles.TableContainer}>

                {currentGraphBiomarker && (
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Record Name</th>
                                <th>{currentGraphBiomarker.biomarker}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {biomarkerPastRecordData.map((item, index) =>{
                                return (
                                    <tr key={index} >
                                        <td>{item.recordDate}</td>
                                        <td>{item.recordName}</td>
                                        <td className={AnalysisByBiomarkerStyles.ValueColumnItem}>
                                            {item.measuredValue} 
                                            {" "}
                                            {item.selectedMeasure}
                                            {currentGraphBiomarker !== undefined && currentGraphBiomarker.normalRanges && (
                                                <div className={isNormalRange(item.measuredValue, item.selectedMeasure) ? AnalysisByBiomarkerStyles.IndicatorBoxGood : AnalysisByBiomarkerStyles.IndicatorBoxBad}></div>
                                            )}
                                        </td>
                                    </tr>

                                )
                            })}
                        </tbody>
                    </table>
                )}
                
            </div>


        </div>
    )
}