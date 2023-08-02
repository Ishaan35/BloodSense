import { useEffect, useState } from 'react'
import MeasureSliderStyles from './MeasureSlider.module.css'

export default function MeasureSlider({options, selectedMeasure, setSelectedMeasure, customUnitMeasure, setCustomUnitMeasure}){

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [currMeasureSelectClassName, setCurrMeasureSelectClassName] = useState(undefined);
    useEffect(() =>{
        setSelectedIndex(0);
        setCurrMeasureSelectClassName(MeasureSliderStyles.sliderHighlightChoice0)

    }, [])

    useEffect(() =>{
        if(customUnitMeasure.trim() === ""){
            changeSelected({target:{id:0}})
        }
        else{
            setSelectedMeasure(customUnitMeasure)
        }
    }, [customUnitMeasure])
    


    const changeSelected = (e) =>{
        
        let index = parseInt(e.target.id)
        setSelectedIndex(index);
        setSelectedMeasure(options[index])

        if(index == 0) setCurrMeasureSelectClassName(MeasureSliderStyles.sliderHighlightChoice0)
        if(index == 1) setCurrMeasureSelectClassName(MeasureSliderStyles.sliderHighlightChoice1)
        if(index == 2) setCurrMeasureSelectClassName(MeasureSliderStyles.sliderHighlightChoice2)
    }

    useEffect(() =>{

        if(selectedIndex == 0) setCurrMeasureSelectClassName(MeasureSliderStyles.sliderHighlightChoice0)
        if(selectedIndex == 1) setCurrMeasureSelectClassName(MeasureSliderStyles.sliderHighlightChoice1)
        if(selectedIndex == 2) setCurrMeasureSelectClassName(MeasureSliderStyles.sliderHighlightChoice2)

    }, [selectedIndex])

    const addEntry = () =>{

    }

    return(
        <span>
            <div className={customUnitMeasure.trim() === "" ? MeasureSliderStyles.MainSliderBox : MeasureSliderStyles.MainSliderBoxDisabled}>
                {options && options.length > 0 && (
                    <>
                        <span className={`${MeasureSliderStyles.sliderHighlight} ${currMeasureSelectClassName}`}></span>
                        {options.map((option, index) =>{
                            return (
                                <div key={index} id={`${index}`} className={MeasureSliderStyles.sliderOptions} onClick={(e) => changeSelected(e)}>{option}</div>
                            )
                        })}
                    </>
                )}
                
            </div>
            <input placeholder='Custom Units' className={MeasureSliderStyles.customInputStyles} value={customUnitMeasure} onChange={(e) => setCustomUnitMeasure(e.target.value)}></input>
        </span>
        
    )
}