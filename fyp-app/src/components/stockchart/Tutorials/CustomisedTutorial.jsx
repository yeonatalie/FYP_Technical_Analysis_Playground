import { StockChart } from '../StockChart'
import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation, useNavigate } from 'react-router-dom';

const CustomisedTutorial = ({customData, indicatorChartState, indicatorChartLabel, indicatorChartLower, indicatorChartUpper}) => {
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
    // const [indicatorChart, setIndicatorChart] = useState(indicatorChartState)

    var indicatorRange = [indicatorChartLower, indicatorChartUpper]

    const [performance, setPerformance] = useState(false)

    const [stopLoss, setStopLoss] = useState("Stop Loss (%)")
    const [takeProfit, setTakeProfit] = useState("Take Profit (%)")

    // default parameters for tutorial
    const [paramData, setParamData] = useState({
      sma: {short:7, long:14},
      ema: {short:7, long:14},
      rsi: {period:14, overbought:70, oversold:30},
      macd: {short:12, long:26, signal:9},
      bband: {period:7, stdDev:2}
    })

    if (customData == null) {
      return (<div></div>)
    } else {
      const blob = new Blob([customData.data], { type: 'text/csv;charset=utf-8,' })
      const stockData = URL.createObjectURL(blob)   

      return (
        <div>
          <h2 style={{paddingLeft:'30px'}}>Tutorial: {customData['tutorialName']}</h2>
          <div style={{overflowY: 'scroll', height: '80vh', clear: 'left', display:'block'}}>
            <StockChart specs={chartSpecs} indicatorChart={indicatorChartState} indicatorChartLabel={indicatorChartLabel} indicatorRange={indicatorRange} lightenCandlestick={lightenCandlestick} 
            stockData={stockData} tutorial={tutorial} paramData={paramData} performance={performance} stopLoss={stopLoss} takeProfit={takeProfit} customData={customData}/>
          </div>
        </div>
      );
    }
}
  
export default CustomisedTutorial;