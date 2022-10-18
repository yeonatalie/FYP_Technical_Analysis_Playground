import * as d3 from "d3";
import { annotateChart, plotPath, crossoverSignal, tooltipIndicator } from './animationFramework';

function EmaCrossover({data, xScale, yScale, emaCrossover}) {
    
    //////////////////////////////////////////////
    ////////////// DATA PREPARATION //////////////
    //////////////////////////////////////////////

    // Calculate EMA values and format data into a list of dictionaries
    // [{date:, close:, smaShort, smaLong,}]
    var closeDates = data.map(d => d.date)
    var closePrices = data.map(d => d.close)
    var closeData = {}
    closeDates.map((x, i) => (closeData[x] = closePrices[i]))

    const EMA = require('technicalindicators').EMA;

    var emaShortDates = data.map(d => d.date).slice(7-1)
    var emaShortValues = EMA.calculate({period: 7, values: closePrices}) //list of SMA values
    var emaShortData = {}
    emaShortDates.map((x, i) => (emaShortData[x] = emaShortValues[i]))

    var emaLongDates = data.map(d => d.date).slice(14-1)
    var emaLongValues = EMA.calculate({period: 14, values: closePrices}) //list of SMA values
    var emaLongData = {}
    emaLongDates.map((x, i) => (emaLongData[x] = emaLongValues[i]))

    var emaData = []
    for (const [date, emaLong] of Object.entries(emaLongData)) {
        emaData.push({
            'date': Date.parse(date),
            'close': closeData[date],
            'emaShort': emaShortData[date],
            'emaLong': emaLong
        })
    }

    //////////////////////////////////////////////
    ////////////// CHART PREPARATION /////////////
    //////////////////////////////////////////////

    // remove previous plot and append new plot
    d3.select(".emacrossover").remove()
    const svg = d3.select('.candlestickchart')
        .append("g")
        .attr("class", "emacrossover")
        .attr("class", "emacrossover")


    //////////////////////////////////////////////
    ////////////////// ANIMATION /////////////////
    //////////////////////////////////////////////

    // Plot and Animate EMA Crossover
    if (emaCrossover) {
        // Annotate Close Prices
        annotateChart({svg:svg, data:data, xScale:xScale, yScale:yScale, variable:'close', 
            displayText:'Identify Close Prices', delayTime:500, displayTime:3000, displayTextTime:3000})
        
        // Plot EMAs
        plotPath({svg:svg, data:emaData, xScale:xScale, yScale:yScale, variable:'emaShort', variableLabel:'7 days', 
            color:"darkblue", displayText:'Plot 7 & 14 day EMAs', delayTime:4000, displayTextTime:3000})
        plotPath({svg:svg, data:emaData, xScale:xScale, yScale:yScale, variable:'emaLong', variableLabel:'14 days', 
            color:"brown", displayText:'Plot 7 & 14 day EMAs', delayTime:4000, displayTextTime:3000})

        // EMA crossover
        crossoverSignal({svg:svg, data:emaData, xScale:xScale, yScale:yScale, variable1:'emaShort', variable2:'emaLong', delayTime:4000,
            displayText:'Long/Short when Short Term EMA Crosses Above/Below Long Term EMA', delayTextTime:8000, displayTextTime:5000}) // long signal
        crossoverSignal({svg:svg, data:emaData, xScale:xScale, yScale:yScale, variable1:'emaShort', variable2:'emaLong', longSignal:false, crossAbove:false, delayTime:4000,
            displayText:'Long/Short when Short Term EMA Crosses Above/Below Long Term EMA', delayTextTime:8000, displayTextTime:5000}) // short signal

        // Tooltip
        tooltipIndicator({svg:svg, data:emaData, xScale:xScale, yScale:yScale})
    }
}

export default EmaCrossover;