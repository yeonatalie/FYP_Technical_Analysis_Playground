import * as d3 from "d3";
import { annotateChart, plotPath, crossoverSignal, tooltipIndicator, annotatePath, annotateSignal} from './animationFramework';
import { utcFormat } from 'd3';
const SMA = require('technicalindicators').SMA;

function SmaCrossover({data, xScale, yScale, tutorial}) {
    //////////////////////////////////////////////
    ////////////// DATA PREPARATION //////////////
    //////////////////////////////////////////////

    // Calculate SMA values and format data into a list of dictionaries
    // [{date:, close:, smaShort, smaLong,}]
    var closeDates = data.map(d => d.date)
    var closePrices = data.map(d => d.close)
    var closeData = {}
    closeDates.map((x, i) => (closeData[x] = closePrices[i]))

    var smaShortDates = data.map(d => d.date).slice(7-1)
    var smaShortValues = SMA.calculate({period: 7, values: closePrices}) //list of SMA values
    var smaShortData = {}
    smaShortDates.map((x, i) => (smaShortData[x] = smaShortValues[i]))

    var smaLongDates = data.map(d => d.date).slice(14-1)
    var smaLongValues = SMA.calculate({period: 14, values: closePrices}) //list of SMA values
    var smaLongData = {}
    smaLongDates.map((x, i) => (smaLongData[x] = smaLongValues[i]))

    var smaData = []
    for (const [date, smaLong] of Object.entries(smaLongData)) {
        smaData.push({
            'date': Date.parse(date),
            'close': closeData[date],
            'smaShort': smaShortData[date],
            'smaLong': smaLong
        })
    }

    var allSignalData = []

    //////////////////////////////////////////////
    ////////////// CHART PREPARATION /////////////
    //////////////////////////////////////////////

    // remove previous plot and append new plot
    d3.select(".smacrossover").remove()
    const svg = d3.select('.candlestickchart')
        .append("g")
        .attr("class", "smacrossover")


    //////////////////////////////////////////////
    ////////////////// ANIMATION /////////////////
    //////////////////////////////////////////////

    // Plot and Animate SMA Crossover
    if (tutorial === "sma") {
        // Annotate Close Prices
        annotateChart({svg:svg, data:data, xScale:xScale, yScale:yScale, variable:'close', 
            displayText:'Identify Close Prices', delayTime:500, displayTime:3000, displayTextTime:3000})
        
        // Plot SMAs
        plotPath({svg:svg, data:smaData, xScale:xScale, yScale:yScale, variable:'smaShort', variableLabel:'7 days', 
            color:"darkblue", displayText:'Plot 7 & 14 day SMAs', delayTime:4000, displayTextTime:2000})
        plotPath({svg:svg, data:smaData, xScale:xScale, yScale:yScale, variable:'smaLong', variableLabel:'14 days', 
            color:"brown", displayText:'Plot 7 & 14 day SMAs', delayTime:4000, displayTextTime:2000})

        // SMA crossover
        allSignalData = crossoverSignal({svg:svg, data:smaData, xScale:xScale, yScale:yScale, variable1:'smaShort', variable2:'smaLong', delayTime:4000,
            displayText:'Long/Short when Short Term SMA Crosses Above/Below Long Term SMA', delayTextTime:7000, displayTextTime:2000, allSignalData:allSignalData}) // long signal
        allSignalData = crossoverSignal({svg:svg, data:smaData, xScale:xScale, yScale:yScale, variable1:'smaShort', variable2:'smaLong', longSignal:false, crossAbove:false, delayTime:4000,
            displayText:'Long/Short when Short Term SMA Crosses Above/Below Long Term SMA', delayTextTime:7000, displayTextTime:2000, allSignalData:allSignalData}) // short signal
        
        // Tooltip
        tooltipIndicator({svg:svg, data:smaData, xScale:xScale, yScale:yScale})

        // Annotate Path
        annotatePath({svg:svg, variable:'smaShort', displayTime:3000, displayText:'Simple Moving Average of Close Prices the Last 7 Days'})
        annotatePath({svg:svg, variable:'smaLong', displayTime:3000, displayText:'Simple Moving Average of Close Prices the Last 14 Days'})

        // Annotate Signal
        annotateSignal({svg:svg, data:smaData, xScale:xScale, yScale:yScale, displayTime:3000})


        // TRADE PERFORMANCES
        //////////////////////
        const formatDate = utcFormat('%B %-d, %Y');

        allSignalData.sort(function(a, b) {
            if (a.date < b.date) return -1;
            if (a.date > b.date) return 1;
            return 0;
        })

        allSignalData.forEach(function(d, index) {
            if (index + 1 < allSignalData.length) {
                var nextData = allSignalData.at(index + 1);
            } else {
                nextData = {
                    'date': smaData.at(-1).date,
                    'dateFormatted': formatDate(smaData.at(-1).date),
                    'signal': 0,
                    'close': smaData.at(-1)['close'],
                    'yPoint': smaData.at(-1)['smaShort']
                }
            }
            allSignalData.at(index)['dollar_return'] = d['signal'] * (nextData['close'] - d['close'])
            allSignalData.at(index)['profitable'] = allSignalData.at(index)['dollar_return'] > 0
            allSignalData.at(index)['percentage_return'] = allSignalData.at(index)['dollar_return'] / d['close'] * 100
        })

        console.log("### Signal Data ###")
        console.log(allSignalData)
        console.log("###")
    }
}

export default SmaCrossover;

// function for COLORED text
// function smaCrossoverText(shortColor, longColor, delayTime) {
//     const smaText = svg.append("svg:text");
//     smaText.append("svg:tspan").text("Plot ");
//     smaText.append("svg:tspan").style("fill", shortColor).text("Short Term SMA");
//     smaText.append("svg:tspan").text(" & ");
//     smaText.append("svg:tspan").style("fill", longColor).text("Long Term SMA");
//     smaText
//         .attr("transform", "translate(20, 20)")
//         .style("font-weight", "bold")
//         .style("opacity", 0);
    
//     smaText.transition()
//         .delay(delayTime)
//         .transition()
//         .style("opacity", 1)
    
//     const longText = svg.append("svg:text");
//     longText.append("svg:tspan").style("fill", schemeSet1[2]).text("Long");
//     longText.append("svg:tspan").text(" when Short Term SMA");
//     longText.append("svg:tspan").style("fill", schemeSet1[2]).text(" Crosses Above ");
//     longText.append("svg:tspan").text("Long Term SMA");
    
//     longText
//         .attr("transform", "translate(20, 40)")
//         .style("font-weight", "bold")
//         .style("opacity", 0);
    
//     longText.transition()
//         .delay(delayTime+1500)
//         .transition()
//         .style("opacity", 1)
    
//     const shortText = svg.append("svg:text");
//     shortText.append("svg:tspan").style("fill", schemeSet1[0]).text("Short");
//     shortText.append("svg:tspan").text(" when Short Term SMA");
//     shortText.append("svg:tspan").style("fill", schemeSet1[0]).text(" Crosses Below ");
//     shortText.append("svg:tspan").text("Long Term SMA");

//     shortText
//         .attr("transform", "translate(20, 60)")
//         .style("font-weight", "bold")
//         .style("opacity", 0);
    
//     shortText.transition()
//         .delay(delayTime+2500)
//         .transition()
//         .style("opacity", 1)
// }