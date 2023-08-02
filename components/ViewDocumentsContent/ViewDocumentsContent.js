import ViewDocumentsContentStyle from './ViewDocumentsContent.module.css'
import {AiOutlineSearch} from 'react-icons/ai'
import {BiSortDown} from 'react-icons/bi'
import { useEffect, useState } from 'react'
import FilterDropdown from '../records/ViewRecordsContent/FilterDropdown/FilterDropdown'
import {HiOutlineDocumentAdd} from 'react-icons/hi'
import { FaFolder } from 'react-icons/fa'
import axios from 'axios'
import ClickableDocumentItem from './clickableDocumentItem/ClickableDocumentItem'
import { useRouter } from 'next/router'

import OperationPopupSystem from '../records/ViewRecordsContent/OperationPopupSystem/OperationPopupSystem';
import { useRef } from 'react';

export default function ViewDocumentsContent({documentsData, uploadedFile, setUploadedFile, setDocumentModalOpen}){

    const [OriginalData, SetOriginalData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState(0);
    const [selectedFilterOption, setSelectedFilterOption] = useState("Last Edit")
    const [filterOptionList, setFilterOptionList] = useState(["Last Edit", "Title [a-z]", "Title [z-a]"]);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false)
    const [searchText, setSearchText] = useState("");

    const queueOperationsManagerRef = useRef(null);

    const router = useRouter();

    useEffect(() =>{
        setSelectedFilterOption(filterOptionList[selectedFilter]);
        applySelectorFilter();
    }, [selectedFilter])


    useEffect(() =>{
        SetOriginalData(documentsData)
    }, [documentsData])

    useEffect(() =>{
        applySelectorFilter()
    }, [OriginalData])

    useEffect(() =>{
        setSelectedFilterOption(filterOptionList[selectedFilter]);
        applySelectorFilter();
    }, [selectedFilter])

    const applyTextFilterReturnData = (str) =>{
        let deepCopyObject = JSON.parse(JSON.stringify(OriginalData));
        deepCopyObject = deepCopyObject.filter(document => document.document_name.toLowerCase().indexOf(str.toLowerCase()) >= 0);
        return deepCopyObject;
    }

    const applySelectorFilter = () =>{

        let deepCopyFilteredByText = applyTextFilterReturnData(searchText)
        if(selectedFilter == 0){
            deepCopyFilteredByText.sort((a,b) => b.date_added - a.date_added); //default by date modified
        }
        else if(selectedFilter == 1){
            deepCopyFilteredByText.sort((a,b) => a.document_name.localeCompare(b.document_name)); //a-z
        }
        else if(selectedFilter == 2){
            deepCopyFilteredByText.sort((a,b) => b.document_name.localeCompare(a.document_name)); //z-a
        }
        setFilteredData(deepCopyFilteredByText);
    }

    const deleteDocumentById = async(id, name) =>{

        //UPDATE THE VISIBLE STATE HERE

        //update the filtered data which is visible currently
        const updatedFilteredData = filteredData.filter((document) => document.document_id !== id)
        setFilteredData(updatedFilteredData)
        //Update the original data too (delete it entirely)
        let updatedOriginalData = OriginalData.filter((document) => document.document_id !== id);
        SetOriginalData(updatedOriginalData);

        queueOperationsManagerRef.current.addToQueue(`Deleting '${name}'`, Date.now(), () => permanentlyDeleteDocument(id, name), "Loading")

        
    }

    const permanentlyDeleteDocument = (id, name) =>{
        return new Promise(async (resolve, reject) => {

            try{
                const response = await axios({
                    method: "post",
                    data: {
                        documentId: id
                    },
                    withCredentials: true,
                    url: `${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/document/deleteDocument`,
                    headers: {
                    "Content-Type": "application/json", 
                    },
                })
    
                if(response.status === 200){
                    //success indicator 
                    resolve(response);
                    queueOperationsManagerRef.current.addToQueue(`Successfully deleted '${name}'`, Date.now(), waitTwoSeconds, "Finished");
                }
                else{
                    if(response.status === 401)
                        router.reload();
                    //error indicator
                    queueOperationsManagerRef.current.addToQueue(`There was an error deleting '${name}'`, Date.now(), waitTwoSeconds, "Error");
                    reject(err);
                }
    
                
            }catch(err){
                queueOperationsManagerRef.current.addToQueue(`There was an error deleting '${name}'`, Date.now(), waitTwoSeconds, "Error"); 
                
                if(err.response){
                    if(err.response.status === 401){
                        router.reload();
                    }
                }
                console.log(err)
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
        <>
            <div className={ViewDocumentsContentStyle.MainContainer}>
                <div className={ViewDocumentsContentStyle.SidebarOptionsWithinContent}>
                    <div className={ViewDocumentsContentStyle.SearchBar} >
                        <button className={ViewDocumentsContentStyle.NewRecordButton} onClick={() => setDocumentModalOpen(true)}>Upload Document <HiOutlineDocumentAdd></HiOutlineDocumentAdd></button>
                    </div>
                    <br></br>
                    <button className={ViewDocumentsContentStyle.SidebarButtons}><FaFolder></FaFolder>All Documents</button>
                </div>

                <div className={ViewDocumentsContentStyle.ItemContainer}>

                    <div className={ViewDocumentsContentStyle.SearchBar}>
                        <div className={ViewDocumentsContentStyle.searchInput}>
                            <AiOutlineSearch ></AiOutlineSearch>
                            <input type="text" placeholder='Search' value={searchText} onChange={(e) => setSearchText(e.target.value)}></input>
                        </div>

                        <div className={showFilterDropdown ? ViewDocumentsContentStyle.FilterOptionListActive : ViewDocumentsContentStyle.FilterOptionList} onClick={() => setShowFilterDropdown(!showFilterDropdown)}>
                            <BiSortDown></BiSortDown>
                            <label>{selectedFilterOption}</label>
                            {showFilterDropdown && (
                                <FilterDropdown setSelectedFilter={setSelectedFilter} setShowFilterDropdown={setShowFilterDropdown}></FilterDropdown>
                            )}
                            
                        </div>
                    </div>

                    <div className={ViewDocumentsContentStyle.RecordItems}>
                        {filteredData.map((document, index) =>{
                            return (
                                <ClickableDocumentItem key={index} documentData={document} index={index} deleteDocument={deleteDocumentById}></ClickableDocumentItem>
                            )
                        })}
                        {filteredData.length === 0 && (
                            <label>No results found!</label>
                        )}
                    </div>

                    <OperationPopupSystem ref={queueOperationsManagerRef}></OperationPopupSystem>
                </div>
            </div>
        </>
    )
}