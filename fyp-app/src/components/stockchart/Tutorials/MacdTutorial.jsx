import * as d3 from "d3";
import { annotateChart, crossoverSignal, plotWinningLosingTrades, annotateTradePerformance } from './animationFramework';

function MacdTutorial({data, xScale, yScale, tutorial, performance}) {

    //////////////////////////////////////////////
    ////////////// DATA PREPARATION //////////////
    //////////////////////////////////////////////

    // Calculate MACD values and format data into a list of dictionaries
    var closeDates = data.map(d => d.date)
    var closePrices = data.map(d => d.close)
    var closeData = {}
    closeDates.map((x, i) => (closeData[x] = closePrices[i]))

    const MACD = require('technicalindicators').MACD;
    var macdValues = MACD.calculate({fastPeriod:12, slowPeriod:26, signalPeriod:9, SimpleMAOscillator:false,
        SimpleMASignal:false, values:closePrices}) 
    var macdDates = data.map(d => d.date).slice(26-1)
    var macdData = {}
    macdDates.map((x, i) => (macdData[x] = macdValues[i])) // {date: {MACD: , signal:, histogram:, }}

    var macdTutData = []
    for (const [date, macd] of Object.entries(macdData)) {
        if (macd['signal'] != null) {
            macdTutData.push({
                'date': Date.parse(date),
                'close': closeData[date],
                'macd': macd['MACD'],
                'signal': macd['signal'],
                'histogram': macd['histogram']
            })
        }
    }

    var allSignalData = []

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

    if (tutorial === "macd" && !performance) {
        // Annotate Close Prices
        annotateChart({svg:svg, data:data, xScale:xScale, yScale:yScale, variable:'close', 
            displayText:'Identify Close Prices', delayTime:5000, displayTextTime:5000})
    
    } else if (tutorial === "macd" && performance) {
        // Get signal data
        crossoverSignal({svg:svg, data:macdTutData, xScale:xScale, yScale:yScale, variable1:'macd', variable2:'signal', longSignal:true, crossAbove:true, delayTime:10000,
            displayText:'Long / Short when MACD Crosses Above / Below Signal Line', delayTextTime:30000, displayTextTime:15000, allSignalData:allSignalData, performance:performance}) // long signal
        crossoverSignal({svg:svg, data:macdTutData, xScale:xScale, yScale:yScale, variable1:'macd', variable2:'signal', longSignal:false, crossAbove:false, delayTime:10000,
            displayText:'Long / Short when MACD Crosses Above / Below Signal Line', delayTextTime:30000, displayTextTime:15000, allSignalData:allSignalData, performance:performance}) // short signal

        // Plot trade signals, unfilled for losing trades
        plotWinningLosingTrades({svg:svg, data:macdTutData, xScale:xScale, yScale:yScale, allSignalData:allSignalData})

        // Tooltip showing trade returns
        annotateTradePerformance({svg:svg, data:macdTutData, xScale:xScale, yScale:yScale, displayTime:3000})
    }
}

export default MacdTutorial;