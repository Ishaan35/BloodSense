import { useEffect, useState } from 'react'
import ViewRecordsStyles from './ViewRecordsContent.module.css'
import {AiOutlineSearch} from 'react-icons/ai'
import {BiSortDown} from 'react-icons/bi'
import FilterDropdown from './FilterDropdown/FilterDropdown';
import RecordClickableItem from './RecordClickableItems/RecordClickableItem';
import axios from 'axios';
import { useRouter } from 'next/router';
import {BiTrash} from 'react-icons/bi';
import {FaFolder} from 'react-icons/fa'

import OperationPopupSystem from './OperationPopupSystem/OperationPopupSystem';
import { useRef } from 'react';




export default function ViewRecordsContent({data}){

    const router = useRouter();


    const [OriginalData, SetOriginalData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState(0);
    const [selectedFilterOption, setSelectedFilterOption] = useState("Last Edit")
    const [filterOptionList, setFilterOptionList] = useState(["Last Edit", "Title [a-z]", "Title [z-a]"]);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false)
    const [searchText, setSearchText] = useState("");

    const [viewingTrash, setViewingTrash] = useState(false);
    const[saveLoading, setSaveLoading] = useState(false);


    const queueOperationsManagerRef = useRef(null);

    useEffect(() =>{
        SetOriginalData(data)
    }, [data])

    useEffect(() =>{
        applySelectorFilter()
    }, [OriginalData])

    useEffect(() =>{
        setSelectedFilterOption(filterOptionList[selectedFilter]);
        applySelectorFilter();
    }, [selectedFilter])

    useEffect(() =>{
        applySelectorFilter();
    }, [viewingTrash])


    





    const applyTextFilterReturnData = (str) =>{
        let deepCopyObject = JSON.parse(JSON.stringify(OriginalData));
        deepCopyObject = deepCopyObject.filter(record => record.record_name.toLowerCase().indexOf(str.toLowerCase()) >= 0);
        return deepCopyObject;
    }

    const applySelectorFilter = () =>{

        let deepCopyFilteredByText = applyTextFilterReturnData(searchText)
        if(selectedFilter == 0){
            deepCopyFilteredByText.sort((a,b) => b.date_edited - a.date_edited); //default by date modified
        }
        else if(selectedFilter == 1){
            deepCopyFilteredByText.sort((a,b) => a.record_name.localeCompare(b.record_name)); //a-z
        }
        else if(selectedFilter == 2){
            deepCopyFilteredByText.sort((a,b) => b.record_name.localeCompare(a.record_name)); //z-a
        }
        if(viewingTrash){

            deepCopyFilteredByText = deepCopyFilteredByText.filter(record => (record.inTrash === 1))
        }
        else{
            deepCopyFilteredByText = deepCopyFilteredByText.filter(record => (record.inTrash === 0))
        }
        setFilteredData(deepCopyFilteredByText);
    }

    const CreateNewRecord = async () =>{
        try{
          const response = await axios({
            method: "post",
            data: {},
            withCredentials: true,
            url: `${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/records/createNewRecord`,
            headers: {
              "Content-Type": "application/json", // Set the content type as multipart/form-data
            },
          })
          const responseData = response.data;
          if(response.status >= 200 && response.status < 300){
            window.location.href = `/records/${responseData.id}`
          }
          else if(response.status === 401){
            router.reload()
          }
  
        }catch(err){
            console.log(err)
            router.reload();

        }
    }

    const removeRecord = async (index) =>{

        let recordToBeTrashed = JSON.parse(JSON.stringify(filteredData[index]));
        recordToBeTrashed.inTrash = 1;

        if(viewingTrash){
            queueOperationsManagerRef.current.addToQueue(`Deleting '${recordToBeTrashed.record_name}'`, Date.now(), () => permanentlyDeleteRecord(recordToBeTrashed), "Loading")
        }
        else
            queueOperationsManagerRef.current.addToQueue(`Moving '${recordToBeTrashed.record_name}' to the trash `, Date.now(), () => setTrash(recordToBeTrashed), "Loading"); //add this trashing operation to the queue

        
    }

    const setTrash = (RecordFinalJSON) => {
        return new Promise(async (resolve, reject) => {

            try{
                //UPDATE THE VISIBLE STATE HERE

                //update the filtered data which is visible currently
                const updatedFilteredData = filteredData.filter((record) => record.id !== RecordFinalJSON.id)
                setFilteredData(updatedFilteredData)
                //Update the original data too (with the trash property)
                let updatedOriginalData = OriginalData.map((record) => {
                    if (record.id === RecordFinalJSON.id) {
                        return RecordFinalJSON;
                    }
                    return record;
                });
                SetOriginalData(updatedOriginalData);
                
                const response = await axios({
                    method: "post",
                    data: {
                        RecordData: RecordFinalJSON
                    },
                    withCredentials: true,
                    url: `${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/records/saveRecordTrashStatus`,
                    headers: {
                    "Content-Type": "application/json", 
                    },
                });

                if(response.status === 200){
                    queueOperationsManagerRef.current.addToQueue(`Successfully moved '${RecordFinalJSON.record_name}' to the trash `, Date.now(), waitTwoSeconds, "Finished"); //add this trashing operation to the queue
                    resolve(response);
                }
            }catch(err){
                console.log(err);
                queueOperationsManagerRef.current.addToQueue(`There was an error moving '${RecordFinalJSON.record_name}' to the trash `, Date.now(), waitTwoSeconds, "Error"); 
                if(err.response){
                    if(err.response.status === 401){
                        router.reload();
                    }
                }
                reject(err);
            }  
        });
    };

    const permanentlyDeleteRecord = async (RecordFinalJSON) =>{
        
        return new Promise(async (resolve, reject) => {

            try{

                //UPDATE THE VISIBLE STATE HERE

                //update the filtered data which is visible currently
                const updatedFilteredData = filteredData.filter((record) => record.id !== RecordFinalJSON.id)
                setFilteredData(updatedFilteredData)
                //Update the original data too (delete it entirely)
                let updatedOriginalData = OriginalData.filter((record) => record.id !== RecordFinalJSON.id);
                SetOriginalData(updatedOriginalData);


                const response = await axios({
                    method: "post",
                    data: {
                        RecordData: RecordFinalJSON
                    },
                    withCredentials: true,
                    url: `${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/records/deleteRecord`,
                    headers: {
                    "Content-Type": "application/json", 
                    },
                });
    
                if(response.status === 200){
                    queueOperationsManagerRef.current.addToQueue(`Successfully deleted '${RecordFinalJSON.record_name}'`, Date.now(), waitTwoSeconds, "Finished"); //add a success indicator
                    resolve(response);
                }
            }catch(err){
                console.log(err);
                queueOperationsManagerRef.current.addToQueue(`There was an error deleting '${RecordFinalJSON.record_name}'`, Date.now(), waitTwoSeconds, "Error"); 
                if(err.response){
                    if(err.response.status === 401){
                        router.reload();
                    }
                }
                reject(err);
            }   

        })
        
    }

    const waitTwoSeconds = () =>{
        return new Promise((resolve, reject) =>{
            setTimeout(() =>{
                resolve();
            }, 2000)
        })
    }


    




    return (
        <div className={ViewRecordsStyles.MainContainer}>
            
            <div className={ViewRecordsStyles.SidebarOptionsWithinContent}>
                <div className={ViewRecordsStyles.SearchBar} >
                    <button className={ViewRecordsStyles.NewRecordButton} onClick={CreateNewRecord}>New Record</button>
                </div>
                <br></br>
                <button className={ViewRecordsStyles.SidebarButtons} disabled={!viewingTrash} onClick={() => setViewingTrash(false)}><FaFolder></FaFolder>All Records</button>
                <button className={ViewRecordsStyles.SidebarButtons} disabled={viewingTrash} onClick={() => setViewingTrash(true)}><BiTrash></BiTrash>Trash</button>
            </div>

            <div className={ViewRecordsStyles.ItemContainer}>

                <div className={ViewRecordsStyles.SearchBar}>
                    <div className={ViewRecordsStyles.searchInput}>
                        <AiOutlineSearch onClick={applySelectorFilter}></AiOutlineSearch>
                        <input type="text" placeholder='Search' value={searchText} onChange={(e) => setSearchText(e.target.value)}></input>
                    </div>

                    <div className={showFilterDropdown ? ViewRecordsStyles.FilterOptionListActive : ViewRecordsStyles.FilterOptionList} onClick={() => setShowFilterDropdown(!showFilterDropdown)}>
                        <BiSortDown></BiSortDown>
                        <label>{selectedFilterOption}</label>
                        {showFilterDropdown && (
                            <FilterDropdown setSelectedFilter={setSelectedFilter} setShowFilterDropdown={setShowFilterDropdown}></FilterDropdown>
                        )}
                        
                    </div>
                </div>

                <div className={ViewRecordsStyles.RecordItems}>
                    {filteredData.map((record, index) =>{
                        return (
                            <RecordClickableItem key={index} record={record} index={index} trashRecord={removeRecord}></RecordClickableItem>
                        )
                    })}
                    {filteredData.length === 0 && (
                        <label>No results found!</label>
                    )}
                </div>

            <OperationPopupSystem ref={queueOperationsManagerRef}></OperationPopupSystem>
            </div>

            
        </div>
    )
}