import * as d3 from "d3";
import { annotateChart, annotateUpDown } from './animationFramework';

function RsiTutorial({data, xScale, yScale, tutorial}) {

    //////////////////////////////////////////////
    ////////////// CHART PREPARATION /////////////
    //////////////////////////////////////////////

    // remove previous plot and append new plot
    d3.select(".rsi").remove()
    const svg = d3.select('.candlestickchart')
        .append("g")
        .attr("class", "rsi")

    //////////////////////////////////////////////
    ////////////////// ANIMATION /////////////////
    //////////////////////////////////////////////

    if (tutorial === "rsi") {
        // Annotate Close Prices
        annotateChart({svg:svg, data:data, xScale:xScale, yScale:yScale, variable:'close', 
            displayText:'Identify Close Prices', delayTime:500, displayTextTime:2000})
        
        // Annotate Up Down Price Movements
        annotateUpDown({svg:svg, data:data, xScale:xScale, yScale:yScale, variable:'close', 
            displayText:'Identify Up/Down Price Movements. Calculate Average Gain/Loss (%)', delayTime:500, delayTextTime:3000, displayTextTime:5000})
    }
}

export default RsiTutorial;