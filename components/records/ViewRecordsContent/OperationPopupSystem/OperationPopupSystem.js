import OperationPopupSystemStyles from './OperationPopupSystem.module.css'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import React, { forwardRef, useImperativeHandle } from 'react';
import { BiTrash } from 'react-icons/bi';
import { BsCheckCircle } from 'react-icons/bs';
import { BiLoader } from 'react-icons/bi';
import {VscError} from 'react-icons/vsc'

//The use of forwardRef is only necessary if you want to pass the ref from the parent component to the child component and access the child component's methods through that ref.
const OperationPopupSystem = forwardRef((props, ref) => {

    const [queue, setQueue] = useState([]);

    const addToQueue = async (c, id, promise, iconStr) => {
        
        let iconToDisplay = undefined;
        if(iconStr === "Loading")
            iconToDisplay = renderLoading;
        else if(iconStr === "Finished")
            iconToDisplay = renderFinished;
        else if(iconStr === "Error")
            iconToDisplay = renderError;
        else{
            iconToDisplay = renderDefault
        }

        const newItem = { id: id, content: c, icon:iconToDisplay };
        setQueue((prevQueue) => [newItem, ...prevQueue]);
        

        try{
            await promise();
        }
        catch(err){
            console.log(err)
        }
        setQueue((prevQueue) => prevQueue.filter((item) => item.id !== id));
    };

    // Expose the addToQueue method to the parent component so it can pass promises and add elements to the queue
    useImperativeHandle(ref, () => ({
        addToQueue
    }));


    const waitTwoSeconds = () =>{
        return new Promise((resolve, reject) =>{
            setTimeout(() =>{
                resolve();
            }, 2000)
        })
    }

    const renderFinished = () =>{
        return <BsCheckCircle style={{transform:"scale(2)", margin:"20px"}}></BsCheckCircle>
    }

    const renderLoading = () =>{
        return <BiLoader style={{transform:"scale(2)", margin:"20px"}}></BiLoader>
    }

    const renderError = () =>{
        return <VscError style={{transform:"scale(2)", margin:"20px"}}></VscError>
    }

    const renderDefault = () =>{
        return <div style={{transform:"scale(2)", margin:"20px"}}></div>
    }

    return (
        <div className={OperationPopupSystemStyles.MainContainer}>
            
           <br></br>
            <br></br>
            <br></br>

            <ul>
                <AnimatePresence>
                    {queue.map((item) =>{
                        return(
                            <motion.div
                                initial={{ x: 300 }}
                                animate={{ x: -300 }}
                                exit={{ x:300 }}
                                transition={{ duration: 0.4, type: "spring", stiffness: 400, damping: 25 }}
                                key={item.id}
                                className={OperationPopupSystemStyles.QueueItem}
                            >
                                {item.icon()}
                                <label style={{wordWrap:"break-word", whiteSpace:"normal", width:"250px"}}>{item.content}</label>
                            </motion.div>
                        )
                    })}
                </AnimatePresence>
            </ul>
        </div>
    )
})

OperationPopupSystem.displayName = "OperationPopupSystem";


export default OperationPopupSystem;