import * as d3 from "d3";
import { annotateChart, plotPath, crossoverSignal, tooltipIndicator } from './animationFramework';
import { schemePastel1 } from 'd3';

function PpTutorial({data, xScale, yScale, ppTutorial}) {
    //////////////////////////////////////////////
    ////////////// DATA PREPARATION //////////////
    //////////////////////////////////////////////
    var prevHigh = data.at(0)['high']
    var prevLow = data.at(0)['low']
    var prevClose = data.at(0)['close']
    var prevTp = (prevHigh + prevLow + prevClose) / 3

    data = data.slice(1)
    data.forEach(function(d, index) {
        delete d.adjClose
        delete d.volume
        d['tp'] = (prevHigh + prevLow + prevClose) / 3
        d['r1'] = (prevTp * 2) - prevLow
        d['r2'] = prevTp + (prevHigh - prevLow)
        d['s1'] = (prevTp * 2) - prevHigh
        d['s2'] = prevTp - (prevHigh - prevLow)

        prevHigh = d['high']
        prevLow = d['low']
        prevClose = d['close']
        prevTp = d['tp']
    })

    //////////////////////////////////////////////
    ////////////// CHART PREPARATION /////////////
    //////////////////////////////////////////////

    // remove previous plot and append new plot
    d3.select(".pp").remove()
    const svg = d3.select('.candlestickchart')
        .append("g")
        .attr("class", "pp")

    //////////////////////////////////////////////
    ////////////////// ANIMATION /////////////////
    //////////////////////////////////////////////

    if (ppTutorial) {
        // Annotate Close Prices
        annotateChart({svg:svg, data:data, xScale:xScale, yScale:yScale, variable:'close', 
            displayText:'Identify Close Prices', delayTime:500, displayTime:1500, displayTextTime:1000})
        // Annotate High Prices
        annotateChart({svg:svg, data:data, xScale:xScale, yScale:yScale, variable:'high', 
            color:'green', displayText:'Identify High Prices', delayTime:2500, displayTime:1500, displayTextTime:1000})
        // Annotate Low Prices
        annotateChart({svg:svg, data:data, xScale:xScale, yScale:yScale, variable:'low', 
            color:'red', displayText:'Identify Low Prices', delayTime:4500, displayTime:1500, displayTextTime:1000})

        // Annotate Typical Price
        annotateChart({svg:svg, data:data, xScale:xScale, yScale:yScale, variable:'tp', 
        color:'blue', displayText:'Calculate Typical Price', delayTime:6500, displayTime:2000, displayTextTime:1500})

        // Plot Support and Resistance
        plotPath({svg:svg, data:data, xScale:xScale, yScale:yScale, variable:'r1', variableLabel:'R1', 
            color:schemePastel1[2], displayText:'Plot Support and Resistance using Previous Day Data', speed:200, delayTime:9000, displayTextTime:3000})
        plotPath({svg:svg, data:data, xScale:xScale, yScale:yScale, variable:'s1', variableLabel:'S1', 
            color:schemePastel1[0], displayText:'Plot Support and Resistance using Previous Day Data', speed:200, delayTime:9000, displayTextTime:3000})
        plotPath({svg:svg, data:data, xScale:xScale, yScale:yScale, variable:'r2', variableLabel:'R2', 
            color:'red', displayText:'Plot Support and Resistance using Previous Day Data', speed:200, delayTime:9000, displayTextTime:3000})
        plotPath({svg:svg, data:data, xScale:xScale, yScale:yScale, variable:'s2', variableLabel:'S2', 
            color:'green', displayText:'Plot Support and Resistance using Previous Day Data', speed:200, delayTime:9000, displayTextTime:3000})
        
        // Plot Close Price
        plotPath({svg:svg, data:data, xScale:xScale, yScale:yScale, variable:'close', variableLabel:'Close', 
            color:'black', displayText:'Plot Support and Resistance using Previous Day Data', speed:200, delayTime:9000, displayTextTime:3000})
        
        // Annotate Buy Sell Points
        crossoverSignal({svg:svg, data:data, xScale:xScale, yScale:yScale, variable1:'close', variable2:'s2', longSignal:true, crossAbove:false, delayTime:9000,
            displayText:'Long / Short when Close Price Crosses Support / Resistance', speed:200, delayTextTime:15000, displayTextTime:7000}) // long signal
        crossoverSignal({svg:svg, data:data, xScale:xScale, yScale:yScale, variable1:'close', variable2:'r2', longSignal:false, crossAbove:true, delayTime:9000,
            displayText:'Long / Short when Close Price Crosses Support / Resistance', speed:200, delayTextTime:15000, displayTextTime:7000}) // short signal
        
        // Tooltip
        console.log(data)
        tooltipIndicator({svg:svg, data:data, xScale:xScale, yScale:yScale})
    }
}

export default PpTutorial;