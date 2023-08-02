import { useEffect, useState, useRef } from 'react'
import AnalysisByBiomarkerGraphStyles from './AnalysisByBiomarkerGraphStyles.module.css'
import { Bar, Line } from 'react-chartjs-2';
import {Chart as ChartJS} from 'chart.js/auto'
import annotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(annotationPlugin);
import ChartDataLabels from 'chartjs-plugin-datalabels';

import {SlGraph} from 'react-icons/sl'
import {RiBarChart2Fill} from 'react-icons/ri'

export default function AnalysisByBiomarkerGraph({chartData, currentGraphBiomarker, currentSelectedUnit, graphType, normalRangeText}){

    const [data, setData] = useState(undefined);
    const [options, setOptions] = useState(undefined);
    const chartRef = useRef(null);
    const [currentSelectedMeasureUnit, setCurrentSelectedMeasureUnit] = useState("");


    const [greenColor, setGreenColor] = useState("rgba(33, 173, 148, 0.8)");
    const [yellowColor, setYellowColor] = useState("rgba(255, 175, 46, 0.8)")

    useEffect(() =>{
        setCurrentSelectedMeasureUnit(currentSelectedUnit);
    }, [currentSelectedUnit])
    

    useEffect(() =>{

        let myAnnotations = undefined;
        if(normalRangeText && normalRangeText.trim() !== ""){
            let {lower, higher} = getNormalRangeParsedValues(normalRangeText);

            if(higher === "infinity"){
                higher = Number.POSITIVE_INFINITY;
            }

            myAnnotations = {
                box1: {
                    type: 'box',
                    drawTime: 'beforeDraw',
                    xMin: -1,
                    xMax: 11,
                    yMin: lower,
                    yMax: higher,
                    backgroundColor: 'rgba(142, 222, 162, 0.25)',
                    borderDash: [15,20],
                    borderDashOffset:0,
                    borderWidth:2.5,
                    borderColor:"rgba(109, 194, 125,1)",
                    borderCapStyle:"round"
                    
                }
            }
        }

        
        
        const opt = {
            plugins: {
                tooltip: {
                    callbacks: {
                        title: (barData) => {return barData[0].dataset.recordNames[barData[0].dataIndex]},
                        label: (barData) => {return barData.dataset.data[barData.dataIndex] + " " + currentSelectedMeasureUnit},
                    }
                },
                datalabels: {
                    display: true,
                    color: 'black',
                    anchor:'end',
                    clamp: true,
                    align:'top',
                    offset:'5',
                    formatter: function(value, context) {
                        return value;
                    },
                    borderColor:'#d0d2d6',
                    borderWidth: "1",
                    color:"#48576e",
                    font: {
                        size:"16px"
                    },
                    padding:{
                        right:"10",
                        left:"10",
                        top:"5",
                        bottom:"5"
                    },
                    backgroundColor: "white"
                },
                annotation: {
                    annotations: myAnnotations
                  },
                title: {
                display: true,
                text: currentGraphBiomarker ? currentGraphBiomarker.biomarker : "", // Your desired main chart title
                font: {
                    size: 20, // Your desired font size for the main title
                },
                },
                  
                
            },
            
            scales: {
                y: {
                    suggestedMin: 0,
                    title: {
                        display: true,
                        text: currentSelectedUnit, // Your desired chart title
                        font: {
                          size: 16, // Your desired font size
                        },
                      },
                }
            },
            elements:{
                points:{
                    pointStyle:'rect'
                }
            }
           
        }
        setOptions(opt)

        
        if(chartData){

            let formatedValues = chartData.map((item) =>{
                return parseFloat(item.measuredValue);
            }).slice(-10);

            let rangeVals = normalRangeText ? normalRangeText.split('-') : undefined
            let colors = chartData.map((item) =>{
                if(!normalRangeText){
                    return "rgba(66, 135, 245, 0.8)"
                }
                else{
                    
                    if(rangeVals[1].toLowerCase().indexOf("infinity") >= 0){
                        if(parseFloat(rangeVals[0]) <= item.measuredValue)
                            return greenColor //green
                        else
                            return yellowColor; //yellow
                    }
                    else{
                        if(item.measuredValue >= parseFloat(rangeVals[0]) && item.measuredValue <= parseFloat(rangeVals[1]))
                            return greenColor //green
                        else
                            return yellowColor; //yellow
                    }
                }   
                
            }).slice(-10);

            let newData = {
                labels: chartData.map((item) => item.recordDate).slice(-10),
                datasets: [{
                    label: currentGraphBiomarker.biomarker,
                    data: formatedValues,
                    backgroundColor: colors,
                    borderRadius : 5 ,
                    recordNames: chartData.map((item) => item.recordName),
                    pointStyle: 'rectRounded',
                    pointRadius: 8,
                    fill: false,
                }]
            }
            setData(newData)
        }
    }, [chartData, currentSelectedMeasureUnit])

    const getNormalRangeParsedValues = (normalRangeText) =>{
        let rangeVals = normalRangeText.split('-');
        if(rangeVals[1].toLowerCase().indexOf("infinity") >= 0){
            return {
                lower: parseFloat(rangeVals[0]),
                higher: "infinity"
            }
        }
        else{
            return {
                lower: parseFloat(rangeVals[0]),
                higher: parseFloat(rangeVals[1])
            }
        }

    }


    return(
        <div className={AnalysisByBiomarkerGraphStyles.MainContainer}>
            {data !== undefined && currentSelectedMeasureUnit && chartData.length > 0 && (
                <>
                {graphType === "Bar" && (

                    <Bar data={data} options={options} ref={chartRef} plugins={[ChartDataLabels, annotationPlugin]} id='dashedBorders'></Bar>
                )}
                {graphType === "Line" && (
                    <Line data={data} options={options} ref={chartRef} plugins={[ChartDataLabels, annotationPlugin]} id='dashedBorders'></Line>
                )}
                </>
            )}
            {(data === undefined || !currentSelectedMeasureUnit || !chartData || chartData.length <= 0) && (
                <div className={AnalysisByBiomarkerGraphStyles.NoDataFound}>

                    <p className={AnalysisByBiomarkerGraphStyles.NoDataToShowText}>No Data to Show!</p>

                    {graphType === "Bar" && (
                        <div className={AnalysisByBiomarkerGraphStyles.NoDataFoundIcon}>
                            <RiBarChart2Fill></RiBarChart2Fill>
                        </div>
                    )}
                    {graphType == "Line" && (
                        <div className={AnalysisByBiomarkerGraphStyles.NoDataFoundIcon}>
                            <SlGraph></SlGraph>
                        </div>
                    )}
                </div>
            ) }
        </div>
    )
}