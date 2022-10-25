import { StockChart } from '../StockChart'
import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation, useNavigate } from 'react-router-dom';

const CustomisedTutorial = ({customData}) => {
  const chartSpecs = {
      totalWidth: 1250,
      totalHeight: 550,
      indicatorHeight: 200,
      mainChartRatio: 0.75,
      mainChartSpecs: {
        margin: { top: 20, right: 20, bottom: 40, left: 100 }
      },
      indicatorSpecs: {
        margin: { top: 20, right: 20, bottom: 40, left: 100 },
      },
      brushSpecs: {
        brushSize: 130,
        margin: { top: 20, right: 20, bottom: 40, left: 100 },
        yAxisNumTicks: 5
      }
    }

    const [tutorial, setTutorial] = useState("custom")
    const [lightenCandlestick, setLightenCandlestick] = useState(true)
    const [indicatorChart, setIndicatorChart] = useState(false)

    var indicatorChartLabel = "Indicator"
    var indicatorRange = [0, 0]

    if (customData == null) {
      return (<div></div>)
    } else {
      return (
        <div>
          <h2 style={{paddingLeft:'30px'}}>Tutorial: {customData['tutorialName']}</h2>
          <div style={{overflowY: 'scroll', height: '80vh', clear: 'left', display:'block'}}>
            <StockChart specs={chartSpecs} indicatorChart={indicatorChart} indicatorChartLabel={indicatorChartLabel} 
              indicatorRange={indicatorRange} lightenCandlestick={lightenCandlestick} tutorial={tutorial} customData={customData} />
          </div>
        </div>
      );
    }
}
  
export default CustomisedTutorial;