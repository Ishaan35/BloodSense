import { useEffect, useState } from 'react'
import CompareEntireRecordsStyles from './CompareEntireRecords.module.css'
import axios from 'axios';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { readBiomarkerJSONFile } from '@/utils/loadBiomarkerData';
import { useRouter } from 'next/router';
import {ImTable2} from 'react-icons/im'
import { BsSquare } from "react-icons/bs";
import AnimatedWheel from '@/components/layout/LoadingAnimation/AnimatedWheel';
export default function CompareEntireRecords(){

    const [fetchedRecordNames, setFetchedRecordNames] = useState();
    const [biomarkerList, setBiomarkerList] = useState(undefined)
    

    //Ids of the records
    const [selectedRecord1, setSelectedRecord1] = useState(undefined);
    const [selectedRecord2, setSelectedRecord2] = useState(undefined);
    const [selectedRecord3, setSelectedRecord3] = useState(undefined);

    
    const [selectedRecord1Name, setSelectedRecord1Name] = useState(undefined);
    const [selectedRecord2Name, setSelectedRecord2Name] = useState(undefined);
    const [selectedRecord3Name, setSelectedRecord3Name] = useState(undefined);

    const [selectedRecord1Date, setSelectedRecord1Date] = useState(undefined);
    const [selectedRecord2Date, setSelectedRecord2Date] = useState(undefined);
    const [selectedRecord3Date, setSelectedRecord3Date] = useState(undefined);

    //the actual data which will be displayed on the tables
    const [FinalBuildData, setFinalBuildData] = useState(undefined);
    const [initialPlaceHolder, setInitialPlaceHolder] = useState(true);
    const [loading, setLoading] = useState(false)

    const [initialInfoFetch, setInitialInfoFetch] = useState(true);
    const [error, setError] = useState("");

    const router = useRouter();

    useEffect(() =>{

        const setup = async () =>{
            await fetchRecordNames();
            await fetchBiomarkers();
        }
        setup();
    }, [])


    const fetchRecordNamesTemp = async () =>{
        setFetchedRecordNames([
            {
            "id":"b7a549af-f603-4270-92ce-a1c3c1d01cb1",
            "inTrash":0,
            "record_name":"April 2021 Record",
            "date_edited":1690238740745
            },
            {
            "id":"cbd942d5-cb7a-4d4c-afb0-31c413a68a9d",
            "inTrash":0,
            "record_name":"Dr. John Bloodwork",
            "date_edited":1690238592512
            },
            {
            "id":"09a6b0e7-c7f5-4694-96fb-7ccbc572736d",
            "inTrash":0,
            "record_name":"Untitled Record",
            "date_edited":1690238146328
            },
            {
            "id":"2707329e-f3e5-4486-985c-023e18522042",
            "inTrash":0,
            "record_name":"February 2023 Record",
            "date_edited":1689799463098
            },
            {
            "id":"8a821ec8-9db4-47ef-a8f1-a298f39becbe",
            "inTrash":0,
            "record_name":"March 2022 Record",
            "date_edited":1689707207355
            }
            ])
    }
    const fetchRecordNames = async () =>{
        try{
            const response = await axios({
                method:"post",
                url:`${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/records/getAllRecords`,
                withCredentials: true,
            })
            setFetchedRecordNames(response.data)
            setError("")
        }catch(err){
            console.log(err)
            if(err.response && err.response.status === 401)
                router.reload();
            else{
                setError("There was an error connecting to the server. Please refresh the page and try again!")
            }
        }
    }
    const fetchBiomarkersTemp = async () =>{
        let jsonData = await readBiomarkerJSONFile();
        setBiomarkerList(jsonData)
    }
    const fetchBiomarkers = async () =>{
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
                router.reload();
            else{
                setError("There was an error connecting to the server. Please refresh the page and try again!")
            }
        }
        setBiomarkerList(jsonData)
    }

    const fetchRecordData = async () =>{
        setLoading(true)
        let recordsToSearch = [
          selectedRecord1,
          selectedRecord2,
          selectedRecord3,
        ].filter(
          (item) =>
            item !== "" &&
            item !== undefined &&
            item !== null
        );


        if (!recordsToSearch || recordsToSearch.length === 0){
            setLoading(false);
            return;
        }
          try {
            const response = await axios({
              method: "post",
              withCredentials: true,
              url: `${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/analysis/getBiomarkerFormelementValues`,
              data: {
                recordIds: recordsToSearch,
              },
            });
            

            //april record, february record, untitled record////////////////////// (TEMP DATA)
            // let response = {};
            // response["data"] = JSON.parse(
            //   '[{"id":"b7a549af-f603-4270-92ce-a1c3c1d01cb1","recordName":"April 2021 Record","formElements":[{"$1":{"biomarker":"Vitamin D (25-hydroxyvitamin D)","selectedMeasure":" nmol/L","measuredValue":"107"}},{"$1":{"biomarker":"2,3-Diphosphoglycerate (2,3-DPG)","selectedMeasure":" mmol/mol Hb","measuredValue":"238"}},{"$1":{"biomarker":"Potassium (K+)","selectedMeasure":" mEq/L","measuredValue":"4.0"}},{"$1":{"biomarker":"Magnesium (Mg2+)","selectedMeasure":" mg/dL","measuredValue":"2.6"}},{"$1":{"biomarker":"Vitamin B12 (Cobalamin)","selectedMeasure":" pg/mL","measuredValue":"732"}}]},{"id":"2707329e-f3e5-4486-985c-023e18522042","recordName":"February 2023 Record","formElements":[{"$1":{"biomarker":"Vitamin C (Ascorbic acid)","selectedMeasure":" mg/dL","measuredValue":"448"}},{"$1":{"biomarker":"Vitamin B12 (Cobalamin)","selectedMeasure":" pmol/L","measuredValue":"800"}},{"$1":{"biomarker":"Potassium (K+)","selectedMeasure":" mEq/L","measuredValue":"4.6"}},{"$1":{"biomarker":"Vitamin D (25-hydroxyvitamin D)","selectedMeasure":" nmol/L","measuredValue":"53"}}]},{"id":"09a6b0e7-c7f5-4694-96fb-7ccbc572736d","recordName":"Untitled Record","formElements":[{"$1":{"biomarker":"Strontiumㅤ","selectedMeasure":"hghg","measuredValue":"86"}},{"$1":{"biomarker":"Glomerular filtration rate (GFR)","selectedMeasure":" mL/min/1.73m²","measuredValue":"150"}}]}]'
            // );
            // response["status"] = 200;
            //////////////////////////////////////////////////////////////////////


            if (response.status === 401) router.reload();
            
            //to get rid of the "$1" in fromt of the form element objects which indicates a first level nesting or something
            if(response.data && response.data.length > 0){
                for (let i = 0; i < response.data.length; i++) {
                    for(let j = 0; j < response.data[i].formElements.length; j++){
                        response.data[i].formElements[j] = response.data[i].formElements[j]["$1"]
                    }
                }
            }
                        

            //confirm we actually found our desired selected biomarkers from the queried data
            let potentialRecord1Found = response.data.find(
              (obj) => obj.id === selectedRecord1
            );
            let potentialRecord2Found = response.data.find(
              (obj) => obj.id === selectedRecord2
            );
            let potentialRecord3Found = response.data.find(
              (obj) => obj.id === selectedRecord3
            );
            setError("")

            
            setSelectedRecord1Name(potentialRecord1Found ? potentialRecord1Found.recordName : "")
            setSelectedRecord2Name(potentialRecord2Found ? potentialRecord2Found.recordName : "")
            setSelectedRecord3Name(potentialRecord3Found ? potentialRecord3Found.recordName : "")
            
            setSelectedRecord1Date(potentialRecord1Found ? potentialRecord1Found.recordDate : "")
            setSelectedRecord2Date(potentialRecord2Found ? potentialRecord2Found.recordDate : "")
            setSelectedRecord3Date(potentialRecord3Found ? potentialRecord3Found.recordDate : "")
            
            buildDisplayData(
              potentialRecord1Found ? potentialRecord1Found : undefined,
              potentialRecord2Found ? potentialRecord2Found : undefined,
              potentialRecord3Found ? potentialRecord3Found : undefined
            );
          } catch (err) {
            if (err.response && err.response.status === 401) router.reload();
            else {
              console.log(err);
              setError("Internal Server Error");
            }
          }
    }

    //this will build the table ready data for us
    const buildDisplayData = (chartData1, chartData2, chartData3) => {
        setInitialPlaceHolder(false)
        if (
          (!chartData1 || chartData1.formElements.length <= 0) &&
          (!chartData2 || chartData2.formElements.length <= 0) &&
          (!chartData3 || chartData3.formElements.length <= 0)
        ) {
          setFinalBuildData(undefined);
          setLoading(false);
          return;
        }
      //creates an object with every biomarker being the key, the normal ranges and data being the values
      let BuiltData = biomarkerList.reduce((result, obj) => {
        // Extract the 'biomarker' property from the current object and use it as a key
        const key = obj.biomarker;
        // Assign the current object to the new object with the 'biomarker' property as the key
        result[key] = { normalRanges: obj.normalRanges ? obj.normalRanges : undefined, data: [] };
        return result;
      }, {});
      

      //at this point after the following code block runs, it will put every form element entry in its respective bucket, where the bucket key is the biomarker, and the data contains info such as the chart where the data should be in (1,2,3), the meausred values for all occurances, the units for all those occurances, and the normal ranges
      if (chartData1 && chartData1.formElements) {
        chartData1.formElements.forEach((formElement) => {
          BuiltData[formElement.biomarker].data.push({
            chartNumber: 1,
            measuredValue: formElement.measuredValue,
            selectedMeasure: formElement.selectedMeasure
          });
        });
      }
      if (chartData2 && chartData2.formElements) {
        chartData2.formElements.forEach((formElement) => {
          BuiltData[formElement.biomarker].data.push({
            chartNumber: 2,
            measuredValue: formElement.measuredValue,
            selectedMeasure: formElement.selectedMeasure,
          });
        });
      }
      if (chartData3 && chartData3.formElements) {
        chartData3.formElements.forEach((formElement) => {
          BuiltData[formElement.biomarker].data.push({
            chartNumber: 3,
            measuredValue: formElement.measuredValue,
            selectedMeasure: formElement.selectedMeasure,
          });
        });
      }

      //removes all the elements that are not holding any data
      for (const bucket in BuiltData) {
        if (!BuiltData[bucket].data || BuiltData[bucket].data.length == 0) {
          delete BuiltData[bucket];
        }
      }

      
        setFinalBuildData(BuiltData);
      setLoading(false)
     
    };

    const parseRange = (range, mes) => {
        if(!range)
            return "";
        if(range.toLowerCase().indexOf("infinity") >= 0){
            return ">" + range.split('-')[0]
        }
        return range;
    }

    const getIndicatorJSX = (measuredValue, normalRange) =>{
        if(!normalRange)
            return <></>
        else{
            let normalRangeVals = normalRange.split('-');
            let lowerBound = 0;
            try{
                lowerBound = parseFloat(normalRangeVals[0]);
            }catch(err){
                return <></>
            }
            
            if(normalRangeVals[1].toLowerCase().indexOf("infinity") >= 0){
                if(parseFloat(measuredValue) >= lowerBound){
                    return (
                      <div
                        className={CompareEntireRecordsStyles.IndicatorBoxGood}
                      ></div>
                    );
                }
            }
            else{
                let upperBound = 999;
                 try {
                   upperBound = parseFloat(normalRangeVals[1]);
                 } catch (err) {
                   return <></>;
                 }
                if(parseFloat(measuredValue) >= lowerBound && parseFloat(measuredValue) <= upperBound){
                    return (
                      <div
                        className={CompareEntireRecordsStyles.IndicatorBoxGood}
                      ></div>
                    );
                }
                return (
                  <div
                    className={CompareEntireRecordsStyles.IndicatorBoxBad}
                  ></div>
                );
            }
        }
    }

    return (
      <div className={CompareEntireRecordsStyles.MainContainer}>
        <br></br>
        <br></br>
        <div className={CompareEntireRecordsStyles.SearchBox}>
          {fetchedRecordNames && fetchBiomarkers && (
            <>
              <p className={CompareEntireRecordsStyles.Heading}>
                Compare Past Records
              </p>
              <label className={CompareEntireRecordsStyles.prompt}>
                Select some records:
              </label>
              <div className={CompareEntireRecordsStyles.RecordSelectionGrid}>
                <FormControl fullWidth>
                  <InputLabel>Record #1</InputLabel>
                  <Select
                    value={selectedRecord1 ? selectedRecord1 : ""}
                    label="Record #1"
                    onChange={(e) => {
                      setSelectedRecord1(e.target.value);
                    }}
                  >
                    <MenuItem
                      value=""
                      key="1"
                      className={CompareEntireRecordsStyles.menuItem}
                    >
                      None
                    </MenuItem>
                    {fetchedRecordNames.map((item) => {
                      if (
                        selectedRecord2 !== item.id &&
                        selectedRecord3 !== item.id
                      ) {
                        return (
                          <MenuItem
                            value={item.id}
                            key={item.record_name + "1"}
                            className={CompareEntireRecordsStyles.menuItem}
                          >
                            <span>{item.record_name}</span>
                          </MenuItem>
                        );
                      }
                      else{
                        return <></>
                      }
                    })}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Record #2</InputLabel>
                  <Select
                    value={selectedRecord2 ? selectedRecord2 : ""}
                    label="Record #2"
                    onChange={(e) => setSelectedRecord2(e.target.value)}
                  >
                    <MenuItem
                      value=""
                      key="2"
                      className={CompareEntireRecordsStyles.menuItem}
                    >
                      None
                    </MenuItem>
                    {fetchedRecordNames.map((item) => {
                      if (
                        selectedRecord1 !== item.id &&
                        selectedRecord3 !== item.id
                      ) {
                        return (
                          <MenuItem
                            value={item.id}
                            key={item.record_name + "2"}
                            className={CompareEntireRecordsStyles.menuItem}
                          >
                            <span>{item.record_name}</span>
                          </MenuItem>
                        );
                      }
                      else{
                        return <></>
                      }
                    })}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Record #3</InputLabel>
                  <Select
                    value={selectedRecord3 ? selectedRecord3 : ""}
                    label="Record #3"
                    onChange={(e) => setSelectedRecord3(e.target.value)}
                  >
                    <MenuItem
                      value=""
                      key="3"
                      className={CompareEntireRecordsStyles.menuItem}
                    >
                      None
                    </MenuItem>
                    {fetchedRecordNames.map((item) => {
                      if (
                        selectedRecord1 !== item.id &&
                        selectedRecord2 !== item.id
                      ) {
                        return (
                          <MenuItem
                            value={item.id}
                            key={item.record_name + "3"}
                            className={CompareEntireRecordsStyles.menuItem}
                          >
                            <span>{item.record_name}</span>
                          </MenuItem>
                        );
                      }
                    })}
                  </Select>
                </FormControl>

                <button
                  className={CompareEntireRecordsStyles.SearchButton}
                  onClick={fetchRecordData}
                  disabled={loading}
                >
                  Go!
                </button>
              </div>
            </>
          )}

          {error && error !== "" && (
            <label style={{ color: "red", fontSize: "16px" }}>{error}</label>
          )}
        </div>

        <div className={CompareEntireRecordsStyles.TableContainer}>
          {FinalBuildData && !loading && (
            <table>
              <thead>
                <tr>
                  <th>Biomarker</th>
                  <th className={CompareEntireRecordsStyles.tableHeading}>
                    {selectedRecord1Name && selectedRecord1Name !== "" && (
                      <>
                        <span>{selectedRecord1Name}</span>{" "}
                        <label>({selectedRecord1Date})</label>
                      </>
                    )}
                  </th>
                  <th className={CompareEntireRecordsStyles.tableHeading}>
                    {selectedRecord2Name && selectedRecord2Name !== "" && (
                      <>
                        <span>{selectedRecord2Name}</span>{" "}
                        <label>({selectedRecord2Date})</label>
                      </>
                    )}
                  </th>
                  <th className={CompareEntireRecordsStyles.tableHeading}>
                    {selectedRecord3Name && selectedRecord3Name !== "" && (
                      <>
                        <span>{selectedRecord3Name}</span>{" "}
                        <label>({selectedRecord3Date})</label>
                      </>
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(FinalBuildData).map((key, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <label>{key}</label>
                      </td>
                      {(() => {
                        let foundElem = FinalBuildData[key].data.find(
                          (elem) => elem.chartNumber === 1
                        );
                        if (foundElem) {
                          return (
                            <td>
                              <div
                                className={
                                  CompareEntireRecordsStyles.TableDataDiv
                                }
                              >
                                <div>
                                  <label>
                                    {foundElem.measuredValue}{" "}
                                    {foundElem.selectedMeasure}
                                  </label>
                                  {FinalBuildData[key].normalRanges && (
                                    <span>
                                      Normal:{" "}
                                      {parseRange(
                                        FinalBuildData[key].normalRanges[
                                          foundElem.selectedMeasure
                                        ] ||
                                          FinalBuildData[key].normalRanges[
                                            foundElem.selectedMeasure.trim()
                                          ]
                                      )}
                                      {" " + foundElem.selectedMeasure}
                                    </span>
                                  )}
                                </div>
                                {FinalBuildData[key].normalRanges && (
                                  <>
                                    {getIndicatorJSX(
                                      foundElem.measuredValue,
                                      FinalBuildData[key].normalRanges[
                                        foundElem.selectedMeasure
                                      ] ||
                                        FinalBuildData[key].normalRanges[
                                          foundElem.selectedMeasure.trim()
                                        ]
                                    )}
                                  </>
                                )}
                              </div>
                            </td>
                          );
                        }

                        return <td></td>;
                      })()}
                      {(() => {
                        let foundElem = FinalBuildData[key].data.find(
                          (elem) => elem.chartNumber === 2
                        );
                        if (foundElem) {
                          return (
                            <td>
                              <div
                                className={
                                  CompareEntireRecordsStyles.TableDataDiv
                                }
                              >
                                <div>
                                  <label>
                                    {foundElem.measuredValue}{" "}
                                    {foundElem.selectedMeasure}
                                  </label>
                                  {FinalBuildData[key].normalRanges && (
                                    <span>
                                      Normal:{" "}
                                      {parseRange(
                                        FinalBuildData[key].normalRanges[
                                          foundElem.selectedMeasure
                                        ] ||
                                          FinalBuildData[key].normalRanges[
                                            foundElem.selectedMeasure.trim()
                                          ]
                                      )}
                                      {" " + foundElem.selectedMeasure}
                                    </span>
                                  )}
                                </div>
                                {FinalBuildData[key].normalRanges && (
                                  <>
                                    {getIndicatorJSX(
                                      foundElem.measuredValue,
                                      FinalBuildData[key].normalRanges[
                                        foundElem.selectedMeasure
                                      ] ||
                                        FinalBuildData[key].normalRanges[
                                          foundElem.selectedMeasure.trim()
                                        ]
                                    )}
                                  </>
                                )}
                              </div>
                            </td>
                          );
                        }

                        return <td></td>;
                      })()}
                      {(() => {
                        let foundElem = FinalBuildData[key].data.find(
                          (elem) => elem.chartNumber === 3
                        );
                        if (foundElem) {
                          return (
                            <td>
                              <div
                                className={
                                  CompareEntireRecordsStyles.TableDataDiv
                                }
                              >
                                <div>
                                  <label>
                                    {foundElem.measuredValue}{" "}
                                    {foundElem.selectedMeasure}
                                  </label>
                                  {FinalBuildData[key].normalRanges && (
                                    <span>
                                      Normal:{" "}
                                      {parseRange(
                                        FinalBuildData[key].normalRanges[
                                          foundElem.selectedMeasure
                                        ] ||
                                          FinalBuildData[key].normalRanges[
                                            foundElem.selectedMeasure.trim()
                                          ]
                                      )}
                                      {" " + foundElem.selectedMeasure}
                                    </span>
                                  )}
                                </div>
                                {FinalBuildData[key].normalRanges && (
                                  <>
                                    {getIndicatorJSX(
                                      foundElem.measuredValue,
                                      FinalBuildData[key].normalRanges[
                                        foundElem.selectedMeasure
                                      ] ||
                                        FinalBuildData[key].normalRanges[
                                          foundElem.selectedMeasure.trim()
                                        ]
                                    )}
                                  </>
                                )}
                              </div>
                            </td>
                          );
                        }

                        return <td></td>;
                      })()}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {loading && (
            <div className={CompareEntireRecordsStyles.NoDataFound}>
              <AnimatedWheel style={{transform: "scale(0.8)"}}></AnimatedWheel>
            </div>
          )}

          {!FinalBuildData && !initialPlaceHolder && !loading && (
            <div className={CompareEntireRecordsStyles.NoDataFound}>
              <p className={CompareEntireRecordsStyles.NoDataToShowText}>
                No data to show!
              </p>
              <BsSquare
                className={CompareEntireRecordsStyles.NoDataFoundIcon}
              ></BsSquare>
            </div>
          )}

          {!FinalBuildData && initialPlaceHolder && !loading && (
            <div className={CompareEntireRecordsStyles.NoDataFound}>
              <p className={CompareEntireRecordsStyles.NoDataToShowText}>
                Select some data to view!
              </p>
              <ImTable2
                className={CompareEntireRecordsStyles.NoDataFoundIcon}
              ></ImTable2>
            </div>
          )}
        </div>
      </div>
    );
}

