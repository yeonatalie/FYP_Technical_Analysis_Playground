import * as d3 from "d3";
import { annotateChart } from './animationFramework';

function MacdTutorial({data, xScale, yScale, macdTutorial}) {

    //////////////////////////////////////////////
    ////////////// CHART PREPARATION /////////////
    //////////////////////////////////////////////

    // remove previous plot and append new plot
    d3.select(".macd").remove()
    const svg = d3.select('.candlestickchart')
        .append("g")
        .attr("class", "macd")

    //////////////////////////////////////////////
    ////////////////// ANIMATION /////////////////
    //////////////////////////////////////////////

    if (macdTutorial) {
        // Annotate Close Prices
        annotateChart({svg:svg, data:data, xScale:xScale, yScale:yScale, variable:'close', 
            displayText:'Identify Close Prices', delayTime:500, displayTextTime:2000})
    }
}

export default MacdTutorial;