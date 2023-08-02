import AnalysisByBiomarker from './AnalysisByBiomarker/AnalysisByBiomarker';
import AnalysisContentStyles from './AnalysisContent.module.css'
import { useState, useEffect, useContext } from 'react'
import CompareEntireRecords from './CompareEntireRecords/CompareEntireRecords';

export default function AnalysisContent(){

    const [selectedAnalysis, setSelectedAnalysis] = useState("AnalysisByBiomarker");
    

    return (
      <div className={AnalysisContentStyles.MainContainer}>
        <div className={AnalysisContentStyles.SidebarOptionsWithinContent}>
          <br></br>
          <button
            className={AnalysisContentStyles.SidebarButtons}
            disabled={selectedAnalysis === "AnalysisByBiomarker"}
            onClick={() => setSelectedAnalysis("AnalysisByBiomarker")}
          >
            Analyze by Biomarker
          </button>
          <button
            className={AnalysisContentStyles.SidebarButtons}
            disabled={selectedAnalysis === "CompareEntireRecords"}
            onClick={() => setSelectedAnalysis("CompareEntireRecords")}
          >
            Compare Past Records
          </button>
        </div>

        <div className={AnalysisContentStyles.ItemContainer}>
          {selectedAnalysis === "AnalysisByBiomarker" && (
            <AnalysisByBiomarker></AnalysisByBiomarker>
          )}
          {selectedAnalysis === "CompareEntireRecords" && (
            <CompareEntireRecords></CompareEntireRecords>
          )}
        </div>
      </div>
    );
}