import { StockChart } from '../components/stockchart/StockChart'
import React, { useState } from 'react';

function Tutorial() {
    const chartSpecs = {
        totalWidth: 1200,
        totalHeight: 500,
        seperationRatio: 0.8,
        mainChartSpecs: {
          margin: { top: 20, right: 100, bottom: 40, left: 100 }
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
    var tutorial = " "
    if (smaCrossover) {
      tutorial = ": SMA Crossover"
    }

    return (
        <div>
            <h1>Tutorial{tutorial}</h1>
            <StockChart specs={chartSpecs} annotateOHLC={annotateOHLC} smaCrossover={smaCrossover} />
            <br></br>
            <button onClick={() => setAnnotateOHLC({"open": !annotateOHLC["open"]})}>Open Prices</button>
            <button onClick={() => setAnnotateOHLC({"high": !annotateOHLC["high"]})}>High Prices</button>
            <button onClick={() => setAnnotateOHLC({"low": !annotateOHLC["low"]})}>Low Prices</button>
            <button onClick={() => setAnnotateOHLC({"close": !annotateOHLC["close"]})}>Close Prices</button>
            <button onClick={() => setSmaCrossover(!smaCrossover)}>SMA Crossover</button>
        </div>
    );
}
  
export default Tutorial;