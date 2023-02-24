import * as d3 from "d3";
import { plotPath, crossoverSignal, tooltipIndicator, annotatePath, annotateSignal } from './animationFramework';

function RsiChartTutorial({data, xScale, yScale, tutorial, paramData, performance}) {
    
    //////////////////////////////////////////////
    ////////////// DATA PREPARATION //////////////
    //////////////////////////////////////////////
    var period = paramData['rsi']['period']
    var overbought = paramData['rsi']['overbought']
    var oversold = paramData['rsi']['oversold']

    // Calculate RSI values and format data into a list of dictionaries
    var closeDates = data.map(d => d.date)
    var closePrices = data.map(d => d.close)
    var closeData = {}
    closeDates.map((x, i) => (closeData[x] = closePrices[i]))

    const RSI = require('technicalindicators').RSI;
    var rsiValues = RSI.calculate({period: period, values: closePrices}) 
    var rsiDates = data.map(d => d.date).slice(period)
    var rsiData = {}
    rsiDates.map((x, i) => (rsiData[x] = rsiValues[i]))

    var rsiTutData = []
    for (const [date, rsi] of Object.entries(rsiData)) {
        rsiTutData.push({
            'date': Date.parse(date),
            'close': closeData[date],
            'rsi': rsi,
            'overbought': overbought, // Filter levels
            'oversold': oversold, // Filter levels
        })
    }

    var allSignalData = []

    // //////////////////////////////////////////////
    // ////////////// CHART PREPARATION /////////////
    // //////////////////////////////////////////////

    // remove previous plot and append new plot
    d3.select(".rsiChart").remove()
    const svg = d3.select('.indicatorchart')
        .append("g")
        .attr("class", "rsiChart")

    // //////////////////////////////////////////////
    // ////////////////// ANIMATION /////////////////
    // //////////////////////////////////////////////

    // Plot and Animate RSI filter levels
    if (tutorial === "rsi") {
        const delayTime = performance ? 0 : (data.length * 50) + 1000 // wait for up down price mvoements to be animated
        // Plot RSI
        plotPath({svg:svg, data:rsiTutData, xScale:xScale, yScale:yScale, variable:'rsi', variableLabel:'', 
            color:"black", displayText:`Plot ${period} day RSI`, delayTime:delayTime, displayTextTime:2000})
        // Plot Filters
        plotPath({svg:svg, data:rsiTutData, xScale:xScale, yScale:yScale, variable:'oversold', variableLabel:'Oversold', 
            color:"green", animate:false, dashed:true, displayText:`Plot ${period} day RSI`, delayTime:delayTime, displayTextTime:3000})
        plotPath({svg:svg, data:rsiTutData, xScale:xScale, yScale:yScale, variable:'overbought', variableLabel:'Overbought', 
            color:"red", animate:false, dashed:true, displayText:`Plot ${period} day RSI`, delayTime:delayTime, displayTextTime:3000})

        // RSI Filter Signals
        crossoverSignal({svg:svg, data:rsiTutData, xScale:xScale, yScale:yScale, variable1:'rsi', variable2:'oversold', longSignal:true, crossAbove:false, delayTime:delayTime,
            displayText:`Long when RSI Crosses Below ${oversold}, Short when RSI Crosses Above ${overbought}`, delayTextTime:(delayTime + 4000), displayTextTime:7000, allSignalData:allSignalData, performance:false}) // long signal
        crossoverSignal({svg:svg, data:rsiTutData, xScale:xScale, yScale:yScale, variable1:'rsi', variable2:'overbought', longSignal:false, crossAbove:true, delayTime:delayTime,
            displayText:`Long when RSI Crosses Below ${oversold}, Short when RSI Crosses Above ${overbought}`, delayTextTime:(delayTime + 4000), displayTextTime:7000, allSignalData:allSignalData, performance:false}) // short signal
        
        // Tooltip
        tooltipIndicator({svg:svg, data:rsiTutData, xScale:xScale, yScale:yScale, indicatorChart: true})

        // Annotate Path
        annotatePath({svg:svg, variable:'rsi', displayTime:3000, displayText:'Relative Strength Index is a Momentum Indicator. Assumes Mean Reversion.'})

        // Annotate Signal
        annotateSignal({svg:svg, data:data, xScale:xScale, yScale:yScale, displayTime:3000})
    }
}

export default RsiChartTutorial;