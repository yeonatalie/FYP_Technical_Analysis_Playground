import * as d3 from "d3";
import { annotateChart, plotPath, crossoverSignal } from './animationFramework';

const BBand = require('technicalindicators').BollingerBands;

function BbandTutorial({data, xScale, yScale, bbandTutorial}) {
    
    //////////////////////////////////////////////
    ////////////// DATA PREPARATION //////////////
    //////////////////////////////////////////////

    // Calculate SMA values and format data into a list of dictionaries
    // [{date:, close:, smaShort, smaLong,}]
    var closeDates = data.map(d => d.date)
    var closePrices = data.map(d => d.close)
    var closeData = {}
    closeDates.map((x, i) => (closeData[x] = closePrices[i]))

    var bbandDates = data.map(d => d.date).slice(7-1)
    var bbandValues = BBand.calculate({period: 7, values: closePrices, stdDev: 2}) // [{middle:, upper:, lower:}]
    var bbandData = {}
    bbandDates.map((x, i) => (bbandData[x] = bbandValues[i]))

    var bbandTutData = []
    for (const [date, bband] of Object.entries(bbandData)) {
        bbandTutData.push({
            'date': Date.parse(date),
            'close': closeData[date],
            'middle': bband['middle'],
            'upper': bband['upper'],
            'lower': bband['lower']
        })
    }

    //////////////////////////////////////////////
    ////////////// CHART PREPARATION /////////////
    //////////////////////////////////////////////

    // remove previous plot and append new plot
    d3.select(".bband").remove()
    const svg = d3.select('.candlestickchart')
        .append("g")
        .attr("class", "bband")

    //////////////////////////////////////////////
    ////////////////// ANIMATION /////////////////
    //////////////////////////////////////////////

    if (bbandTutorial) {
        // Plot Close Price Path
        plotPath({svg:svg, data:bbandTutData, xScale:xScale, yScale:yScale, variable:'middle', variableLabel:'Close Price',
            color:"black", displayText:'Plot Close Prices', delayTime:500, displayTextTime:5000})

        const delayTime = (data.length * 100) + 1000 // lot close price finish plotting
        // Plot BBands
        plotPath({svg:svg, data:bbandTutData, xScale:xScale, yScale:yScale, variable:'middle', variableLabel:'Middle',
            color:"lightgrey", displayText:'Plot 7 day Bollinger Bands', delayTime:delayTime, displayTextTime:2000})
        plotPath({svg:svg, data:bbandTutData, xScale:xScale, yScale:yScale, variable:'upper', variableLabel:'Upper',
            color:"blue", displayText:'Plot 7 day Bollinger Bands', delayTime:delayTime, displayTextTime:2000})
        plotPath({svg:svg, data:bbandTutData, xScale:xScale, yScale:yScale, variable:'lower', variableLabel:'Lower',
            color:"blue", displayText:'Plot 7 day Bollinger Bands', delayTime:delayTime, displayTextTime:2000})
    }

}

export default BbandTutorial;