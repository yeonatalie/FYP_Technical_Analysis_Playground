import * as d3 from "d3";
import { plotPath, plotBar, crossoverSignal, tooltip, annotatePath, annotateSignal } from './animationFramework';

function MacdChartTutorial({data, xScale, yScale, tutorial, paramData, performance}) {
    
    //////////////////////////////////////////////
    ////////////// DATA PREPARATION //////////////
    //////////////////////////////////////////////
    var short = paramData['macd']['short']
    var long = paramData['macd']['long']
    var signal = paramData['macd']['signal']

    // Calculate MACD values and format data into a list of dictionaries
    var closeDates = data.map(d => d.date)
    var closePrices = data.map(d => d.close)
    var closeData = {}
    closeDates.map((x, i) => (closeData[x] = closePrices[i]))

    const MACD = require('technicalindicators').MACD;
    var macdValues = MACD.calculate({fastPeriod:short, slowPeriod:long, signalPeriod:signal, SimpleMAOscillator:false,
        SimpleMASignal:false, values:closePrices}) 
    var macdDates = data.map(d => d.date).slice(long-1)
    var macdData = {}
    macdDates.map((x, i) => (macdData[x] = macdValues[i])) // {date: {MACD: , signal:, histogram:, }}

    var macdTutData = []
    for (const [date, macd] of Object.entries(macdData)) {
        if (macd['signal'] != null) {
            macdTutData.push({
                'date': parseInt(date),
                'close': closeData[date],
                'macd': macd['MACD'],
                'signal': macd['signal'],
                'histogram': macd['histogram']
            })
        }
    }

    var allSignalData = []

    // //////////////////////////////////////////////
    // ////////////// CHART PREPARATION /////////////
    // //////////////////////////////////////////////

    // remove previous plot and append new plot
    d3.select(".macdChart").remove()
    const svg = d3.select('.indicatorchart')
        .append("g")
        .attr("class", "macdChart")

    // //////////////////////////////////////////////
    // ////////////////// ANIMATION /////////////////
    // //////////////////////////////////////////////

    // Plot and Animate MACD
    if (tutorial === "macd") {
        const delayTime = performance ? 0 : 3000
        const speed = performance ? 0 : 100

        // Plot MACD
        plotPath({svg:svg, data:macdTutData, xScale:xScale, yScale:yScale, variable:'macd', variableLabel:'MACD', 
            color:"black", displayText:`Plot ${short} / ${long} day MACD, ${signal} day Signal`, delayTime:delayTime, animate:!performance, displayTextTime:5000})
        
        // Plot Signal Line
        plotPath({svg:svg, data:macdTutData, xScale:xScale, yScale:yScale, variable:'signal', variableLabel:'Signal', 
            color:"orange", displayText:`Plot ${short} / ${long} day MACD, ${signal} day Signal`, delayTime:delayTime, animate:!performance, displayTextTime:5000})
        
        // Plot Histogram
        plotBar({svg:svg, data:macdTutData, xScale:xScale, yScale:yScale, variable:'histogram', delayTime:delayTime, animate:!performance})

        // MACD Signals
        crossoverSignal({svg:svg, data:macdTutData, xScale:xScale, yScale:yScale, variable1:'macd', variable2:'signal', longSignal:true, crossAbove:true, delayTime:delayTime,
            displayText:'Long / Short when MACD Crosses Above / Below Signal Line', delayTextTime:8000, displayTextTime:5000, allSignalData:allSignalData, performance:false, speed:speed}) // long signal
        crossoverSignal({svg:svg, data:macdTutData, xScale:xScale, yScale:yScale, variable1:'macd', variable2:'signal', longSignal:false, crossAbove:false, delayTime:delayTime,
            displayText:'Long / Short when MACD Crosses Above / Below Signal Line', delayTextTime:8000, displayTextTime:5000, allSignalData:allSignalData, performance:false, speed:speed}) // short signal
        
        // Tooltip
        tooltip({svg:svg, data:macdTutData, xScale:xScale, yScale:yScale, indicatorChart: true})

        // Annotate Path
        annotatePath({svg:svg, variable:'macd', displayTime:3000, displayText:`Difference between ${short} day EMA and ${long} day EMA`})
        annotatePath({svg:svg, variable:'signal', displayTime:3000, displayText:`Signal Line calculated using a ${signal} day EMA of the MACD.`})

        // Annotate Signal
        annotateSignal({svg:svg, data:macdTutData, xScale:xScale, yScale:yScale, displayTime:3000})
    }
}

export default MacdChartTutorial;