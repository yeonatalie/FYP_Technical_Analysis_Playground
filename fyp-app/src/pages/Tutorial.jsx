import { StockChart } from '../components/stockchart/StockChart'
import React, { useState } from 'react';

function Tutorial() {
    const chartSpecs = {
        totalWidth: 1200,
        totalHeight: 500,
        indicatorHeight: 200,
        mainChartRatio: 0.75,
        mainChartSpecs: {
          margin: { top: 20, right: 100, bottom: 40, left: 100 }
        },
        indicatorSpecs: {
          margin: { top: 20, right: 100, bottom: 40, left: 100 },
        },
        brushSpecs: {
          brushSize: 130,
          margin: { top: 20, right: 100, bottom: 40, left: 100 },
          yAxisNumTicks: 5
        }
    }

    const [annotateOHLC, setAnnotateOHLC] = 
      useState({"open":false, "high":false, "low":false, "close":false});
    
    const [smaCrossover, setSmaCrossover] = useState(false)
    const [emaCrossover, setEmaCrossover] = useState(false)
    const [rsiTutorial, setRsiTutorial] = useState(false)
    const [bbandTutorial, setBbandTutorial] = useState(false)
    
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
    if (bbandTutorial) {
      tutorial = ": Bollinger Bands"
    }

    var indicatorChartLabel = "Indicator"
    var indicatorRange = [0, 0]
    if (rsiTutorial) {
      indicatorChartLabel = "RSI"
      indicatorRange = [0, 100]
    }

    return (
        <div>
            <h1>Tutorial{tutorial}</h1>
            <StockChart specs={chartSpecs} indicatorChart={indicatorChart} indicatorChartLabel={indicatorChartLabel} 
              indicatorRange={indicatorRange} lightenCandlestick={lightenCandlestick} annotateOHLC={annotateOHLC} 
              smaCrossover={smaCrossover} emaCrossover={emaCrossover} rsiTutorial={rsiTutorial} bbandTutorial={bbandTutorial}/>

            <br></br>
            
            <button onClick={() => setAnnotateOHLC({"open": !annotateOHLC["open"]})}>Open Prices</button>
            <button onClick={() => setAnnotateOHLC({"high": !annotateOHLC["high"]})}>High Prices</button>
            <button onClick={() => setAnnotateOHLC({"low": !annotateOHLC["low"]})}>Low Prices</button>
            <button onClick={() => setAnnotateOHLC({"close": !annotateOHLC["close"]})}>Close Prices</button>

            <br></br>

            <button onClick={() => {setSmaCrossover(!smaCrossover); setLightenCandlestick(!lightenCandlestick)}}>SMA Crossover</button>
            <button onClick={() => {setEmaCrossover(!emaCrossover); setLightenCandlestick(!lightenCandlestick)}}>EMA Crossover</button>
            <button onClick={() => {setRsiTutorial(!rsiTutorial); setIndicatorChart(!indicatorChart); setLightenCandlestick(!lightenCandlestick)}}>RSI</button>
            <button onClick={() => {setBbandTutorial(!bbandTutorial); setLightenCandlestick(!lightenCandlestick)}}>Bollinger Band</button>
        </div>
    );
}
  
export default Tutorial;