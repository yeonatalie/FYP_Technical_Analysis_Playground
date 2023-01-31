import * as d3 from "d3";
import { annotateChart, annotateUpDown, crossoverSignal, plotWinningLosingTrades, annotateTradePerformance } from './animationFramework';

function RsiTutorial({data, xScale, yScale, tutorial, performance}) {

    //////////////////////////////////////////////
    ////////////// DATA PREPARATION //////////////
    //////////////////////////////////////////////

    // Calculate RSI values and format data into a list of dictionaries
    var closeDates = data.map(d => d.date)
    var closePrices = data.map(d => d.close)
    var closeData = {}
    closeDates.map((x, i) => (closeData[x] = closePrices[i]))

    const RSI = require('technicalindicators').RSI;
    var rsiValues = RSI.calculate({period: 14, values: closePrices}) 
    var rsiDates = data.map(d => d.date).slice(14)
    var rsiData = {}
    rsiDates.map((x, i) => (rsiData[x] = rsiValues[i]))

    var rsiTutData = []
    for (const [date, rsi] of Object.entries(rsiData)) {
        rsiTutData.push({
            'date': Date.parse(date),
            'close': closeData[date],
            'rsi': rsi,
            'overbought': 70, // Filter levels
            'oversold': 30, // Filter levels
        })
    }

    var allSignalData = []

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

    if (tutorial === "rsi" && !performance) {
        // Annotate Close Prices
        annotateChart({svg:svg, data:data, xScale:xScale, yScale:yScale, variable:'close', 
            displayText:'Identify Close Prices', delayTime:500, displayTextTime:2000})
        
        // Annotate Up Down Price Movements
        annotateUpDown({svg:svg, data:data, xScale:xScale, yScale:yScale, variable:'close', 
            displayText:'Identify Up/Down Price Movements. Calculate Average Gain/Loss (%)', delayTime:500, delayTextTime:3000, displayTextTime:5000})

    } else if (tutorial === "rsi" && performance) {
        // Get signal data
        const delayTime = (data.length * 50) + 1000 // wait for up down price mvoements to be animated
        crossoverSignal({svg:svg, data:rsiTutData, xScale:xScale, yScale:yScale, variable1:'rsi', variable2:'oversold', longSignal:true, crossAbove:false, delayTime:delayTime,
            displayText:'Long when RSI Crosses Below 30, Short when RSI Crosses Above 70', delayTextTime:(delayTime + 4000), displayTextTime:7000, allSignalData:allSignalData, performance:false}) // long signal
        crossoverSignal({svg:svg, data:rsiTutData, xScale:xScale, yScale:yScale, variable1:'rsi', variable2:'overbought', longSignal:false, crossAbove:true, delayTime:delayTime,
            displayText:'Long when RSI Crosses Below 30, Short when RSI Crosses Above 70', delayTextTime:(delayTime + 4000), displayTextTime:7000, allSignalData:allSignalData, performance:false}) // short signal

        // Plot trade signals, unfilled for losing trades
        plotWinningLosingTrades({svg:svg, data:rsiTutData, xScale:xScale, yScale:yScale, allSignalData:allSignalData})

        // Tooltip showing trade returns
        annotateTradePerformance({svg:svg, data:rsiTutData, xScale:xScale, yScale:yScale, displayTime:3000})
    }
}

export default RsiTutorial;