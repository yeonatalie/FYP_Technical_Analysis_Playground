import * as d3 from "d3";
import { plotPath, plotBar, crossoverSignal, tooltipIndicator, annotatePath, annotateSignal } from './animationFramework';

function MacdChartTutorial({data, xScale, yScale, tutorial}) {
    
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
        // Plot MACD
        plotPath({svg:svg, data:macdTutData, xScale:xScale, yScale:yScale, variable:'macd', variableLabel:'MACD', 
            color:"black", displayText:'Plot 12 / 26 day MACD, 9 day Signal', delayTime:500, displayTextTime:3000})
        
        // Plot Signal Line
        plotPath({svg:svg, data:macdTutData, xScale:xScale, yScale:yScale, variable:'signal', variableLabel:'Signal', 
            color:"orange", displayText:'Plot 12 / 26 day MACD, 9 day Signal', delayTime:500, displayTextTime:3000})
        
        // Plot Histogram
        plotBar({svg:svg, data:macdTutData, xScale:xScale, yScale:yScale, variable:'histogram', delayTime:500})

        // MACD Signals
        crossoverSignal({svg:svg, data:macdTutData, xScale:xScale, yScale:yScale, variable1:'macd', variable2:'signal', longSignal:true, crossAbove:true, delayTime:500,
            displayText:'Long / Short when MACD Crosses Above / Below Signal Line', delayTextTime:5000, displayTextTime:6000}) // long signal
        crossoverSignal({svg:svg, data:macdTutData, xScale:xScale, yScale:yScale, variable1:'macd', variable2:'signal', longSignal:false, crossAbove:false, delayTime:500,
            displayText:'Long / Short when MACD Crosses Above / Below Signal Line', delayTextTime:5000, displayTextTime:6000}) // short signal
        
        // Tooltip
        tooltipIndicator({svg:svg, data:macdTutData, xScale:xScale, yScale:yScale, indicatorChart: true})

        // Annotate Path
        annotatePath({svg:svg, variable:'macd', displayTime:3000, displayText:'Difference betweenn 12 day EMA and 26 day EMA'})
        annotatePath({svg:svg, variable:'signal', displayTime:3000, displayText:'Signal Line calculated using a 9 day EMA of the MACD.'})

        // Annotate Signal
        annotateSignal({svg:svg, data:macdTutData, xScale:xScale, yScale:yScale, displayTime:3000})
    }
}

export default MacdChartTutorial;