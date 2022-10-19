import * as d3 from "d3";
import { annotateChart, plotPath, crossoverSignal, tooltipIndicator, annotatePath } from './animationFramework';

const BBand = require('technicalindicators').BollingerBands;

function BbandTutorial({data, xScale, yScale, tutorial}) {
    
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

    if (tutorial === "bband") {
        // Annotate Close Prices
        annotateChart({svg:svg, data:data, xScale:xScale, yScale:yScale, variable:'close', 
            displayText:'Annotate Close Prices', delayTime:500, displayTime:3000, displayTextTime:2000})

        // Plot BBands
        const bbandTime = (bbandTutData.length * 50) + 1000
        plotPath({svg:svg, data:bbandTutData, xScale:xScale, yScale:yScale, variable:'middle', variableLabel:'Middle',
            color:"grey", displayText:'Plot 7 day Bollinger Bands', speed:50, delayTime:4000, displayTextTime:bbandTime})
        plotPath({svg:svg, data:bbandTutData, xScale:xScale, yScale:yScale, variable:'upper', variableLabel:'Upper',
            color:"darkred", displayText:'Plot 7 day Bollinger Bands', speed:50, delayTime:4000, displayTextTime:bbandTime})
        plotPath({svg:svg, data:bbandTutData, xScale:xScale, yScale:yScale, variable:'lower', variableLabel:'Lower',
            color:"darkgreen", displayText:'Plot 7 day Bollinger Bands', speed:50, delayTime:4000, displayTextTime:5000})

        // Plot Close Price
        plotPath({svg:svg, data:data, xScale:xScale, yScale:yScale, variable:'close', variableLabel:'Close Price',
            color:"black", displayText:'Plot Close Prices', delayTime:12000, displayTextTime:3000})

        // Annotate Buy Sell Points
        // long signal when cross below lower
        crossoverSignal({svg:svg, data:bbandTutData, xScale:xScale, yScale:yScale, variable1:'close', variable2:'lower', longSignal:true, crossAbove:false, delayTime:12000,
            displayText:'Long/Short when Prices Crosses Below/Above Lower/Upper Bollinger Band', delayTextTime:16000, displayTextTime:7000}) 
        // short signal when cross above upper
        crossoverSignal({svg:svg, data:bbandTutData, xScale:xScale, yScale:yScale, variable1:'close', variable2:'upper', longSignal:false, crossAbove:true, delayTime:12000,
            displayText:'Long/Short when Prices Crosses Below/Above Lower/Upper Bollinger Band', delayTextTime:16000, displayTextTime:7000}) 

        // Tooltip
        tooltipIndicator({svg:svg, data:bbandTutData, xScale:xScale, yScale:yScale})

        // Annotate Path
        annotatePath({svg:svg, variable:'middle', displayTime:3000, displayText:'Middle Bollinger Band'})
        annotatePath({svg:svg, variable:'upper', displayTime:3000, displayText:'Upper Bollinger Band'})
        annotatePath({svg:svg, variable:'lower', displayTime:3000, displayText:'Lower Bollinger Band'})
        annotatePath({svg:svg, variable:'close', displayTime:3000, displayText:'Close Price'})
    }

}

export default BbandTutorial;