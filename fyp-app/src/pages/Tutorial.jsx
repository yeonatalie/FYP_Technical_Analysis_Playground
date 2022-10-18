import { StockChart } from '../components/stockchart/StockChart'
import React, { useState } from 'react';

function Tutorial() {
    const chartSpecs = {
        totalWidth: 1250,
        totalHeight: 500,
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

    // const [annotateOHLC, setAnnotateOHLC] = 
    //   useState({"open":false, "high":false, "low":false, "close":false});
    
    const [smaCrossover, setSmaCrossover] = useState(false)
    const [emaCrossover, setEmaCrossover] = useState(false)
    const [rsiTutorial, setRsiTutorial] = useState(false)
    const [macdTutorial, setMacdTutorial] = useState(false)
    const [bbandTutorial, setBbandTutorial] = useState(false)
    const [ppTutorial, setPpTutorial] = useState(false)
    
    const [lightenCandlestick, setLightenCandlestick] = useState(false)
    const [indicatorChart, setIndicatorChart] = useState(false)

    var tutorial = " "
    if (smaCrossover) {
      tutorial = ": SMA Crossover"
    }
    if (emaCrossover) {
      tutorial = ": EMA Crossover"
    }
    if (rsiTutorial) {
      tutorial = ": RSI"
    }
    if (macdTutorial) {
      tutorial = ": MACD"
    }
    if (bbandTutorial) {
      tutorial = ": Bollinger Bands"
    }
    if (ppTutorial) {
      tutorial = ": Pivot Points"
    }

    var indicatorChartLabel = "Indicator"
    var indicatorRange = [0, 0]
    if (macdTutorial) {
      indicatorChartLabel = "MACD"
      indicatorRange = [-5, 5]
    }
    if (rsiTutorial) {
      indicatorChartLabel = "RSI"
      indicatorRange = [0, 100]
    }

    return (
      <div>
        <h2 style={{paddingLeft: '30px'}}> Tutorial{tutorial}</h2>

        <div style={{overflowY: 'scroll', height: '500px'}}>
          <StockChart specs={chartSpecs} indicatorChart={indicatorChart} indicatorChartLabel={indicatorChartLabel} 
            indicatorRange={indicatorRange} lightenCandlestick={lightenCandlestick} smaCrossover={smaCrossover} 
            emaCrossover={emaCrossover} rsiTutorial={rsiTutorial} macdTutorial={macdTutorial} bbandTutorial={bbandTutorial}
            ppTutorial={ppTutorial}/>
        </div>

        <br></br>

        <button style={{marginLeft: '30px'}} onClick={() => {setSmaCrossover(!smaCrossover); setLightenCandlestick(!lightenCandlestick)}}>SMA Crossover</button>
        <button style={{marginLeft: '10px'}} onClick={() => {setEmaCrossover(!emaCrossover); setLightenCandlestick(!lightenCandlestick)}}>EMA Crossover</button>
        <button style={{marginLeft: '10px'}} onClick={() => {setRsiTutorial(!rsiTutorial); setIndicatorChart(!indicatorChart); setLightenCandlestick(!lightenCandlestick)}}>RSI</button>
        <button style={{marginLeft: '10px'}} onClick={() => {setMacdTutorial(!macdTutorial); setIndicatorChart(!indicatorChart); setLightenCandlestick(!lightenCandlestick)}}>MACD</button>
        <button style={{marginLeft: '10px'}} onClick={() => {setBbandTutorial(!bbandTutorial); setLightenCandlestick(!lightenCandlestick)}}>Bollinger Band</button>
        <button style={{marginLeft: '10px'}} onClick={() => {setPpTutorial(!ppTutorial); setLightenCandlestick(!lightenCandlestick)}}>Pivot Points</button>
      </div>
    );
}
  
export default Tutorial;