import { useEffect, useState } from 'react'
import NewBiomarkerSelect from './NewBiomarkerSelect/NewBiomarkerSelect';
import NewRecordContentStyles from './NewRecordContent.module.css'
import {BsFillCloudArrowUpFill, BsCloudArrowUp} from 'react-icons/bs'
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { useRouter } from 'next/router';
import FormElement from './FormElement/FormElement';

import { DateCalendar, DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';


export default function NewRecordPageContent({RECORD_DATA, SET_RECORD_DATA}){


    const [FormElements, SetFormElements] = useState([]);
    const [RecordName, SetRecordName] = useState("Untitled Record");
    const [RecordDate, SetRecordDate] = useState("");
    const [dayJSDate, setDayJSDate] = useState(dayjs());
    
    const [formId, setFormId] = useState("");
    const [RecordID, setRecordID] = useState("");

    const[saveLoading, setSaveLoading] = useState(false);

    const router = useRouter();

    useEffect(() =>{
        SetFormElements(RECORD_DATA.formElements)
        setFormId(RECORD_DATA.id)
        setRecordID(RECORD_DATA.RecordID)
        SetRecordDate(RECORD_DATA.recordDate)
        SetRecordName(RECORD_DATA.recordName)
        setDayJSDate(dayjs(RECORD_DATA.recordDate));
    }, [RECORD_DATA])

    useEffect(() =>{
        SetRecordDate(dayJSDate.format('YYYY-MM-DD'))
    }, [dayJSDate])

    const saveForm = async () =>{

        const RecordFinalJSON = {
            RecordID: RecordID,
            recordDate: RecordDate,
            formElements: FormElements,
            recordName: RecordName,
            id:formId,
            dateEdited: Date.now(),
            inTrash: RECORD_DATA.inTrash,
        }
        setSaveLoading(true);

        try{
            const response = await axios({
                method: "post",
                data: {
                    RecordData: RecordFinalJSON
                },
                withCredentials: true,
                url: `${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/records/saveRecord`,
                headers: {
                "Content-Type": "application/json", 
                },
            });

            if(response.status === 200){
                setSaveLoading(false);
            }
        }catch(err){
            console.log(err);
            if(err.response){
                if(err.response.status === 401){
                    router.reload();
                }
            }
          }   
    }

    const deleteElement = (index) =>{
        SetFormElements([...FormElements.slice(0, index), ...FormElements.slice(index+1)])
    }


    return (
        <div className={NewRecordContentStyles.MainContainer}>
            <div className={NewRecordContentStyles.ThinHeader}>
                <input placeholder='Enter a name for this record' value={RecordName} onChange={(e) => SetRecordName(e.target.value)} className={NewRecordContentStyles.RecordNameInput}></input>
                <div className={NewRecordContentStyles.DateInput}>
                    <DatePicker onChange={(newValue) => setDayJSDate(newValue)} value={dayJSDate}></DatePicker>
                </div>
                <button className={NewRecordContentStyles.SaveButton} onClick={saveForm} disabled={saveLoading}>Save <BsCloudArrowUp></BsCloudArrowUp></button>
            </div>
            <NewBiomarkerSelect FormElements={FormElements} SetFormElements={SetFormElements}></NewBiomarkerSelect>

            

            <div className={NewRecordContentStyles.Form}>
                {FormElements.map((element, index) => {
                    return (
                        <FormElement formElementData={element} index={index} deleteFormElement={deleteElement} key={index}></FormElement>
                    )   
                })}
            </div>
        </div>
        
    )
}