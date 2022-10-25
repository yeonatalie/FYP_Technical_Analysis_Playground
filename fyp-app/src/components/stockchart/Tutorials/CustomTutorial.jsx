import * as d3 from "d3";
import { annotateChart, plotPath, crossoverSignal, annotateUpDown, tooltipIndicator, annotatePath, annotateSignal } from './animationFramework';

const SMA = require('technicalindicators').SMA;
function CustomTutorial({data, xScale, yScale, tutorial, customData}) {
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

    //////////////////////////////////////////////////
    //////////////////////////////////////////////////
    //////////////////////////////////////////////////

    if (tutorial === "custom") {
        console.log('&&&&&&&')
        console.log(customData)
        console.log('&&&&&&&')

        //////////////////////////////////////////////
        ////////////// CHART PREPARATION /////////////
        //////////////////////////////////////////////

        // remove previous plot and append new plot
        d3.select(".customtutorial").remove()
        const svg = d3.select('.candlestickchart')
            .append("g")
            .attr("class", "customtutorial")
        
        //////////////////////////////////////////////
        ////////////////// ANIMATIONS ////////////////
        //////////////////////////////////////////////

        if (customData['annotate'].variable !== "") {
            const annotateData = customData['annotate']
            annotateChart({svg:svg, data:smaData, xScale:xScale, yScale:yScale, variable:annotateData['variable'], color:annotateData['color'],
                displayText:annotateData['displayText'], delayTime:parseInt(annotateData['delayTime']), displayTime:parseInt(annotateData['displayTime']), 
                displayTextTime:parseInt(annotateData['displayTextTime'])})

        }  
        
        if (customData['plotLine1'].variable !== "") {
            const plotLineData1 = customData['plotLine1']
            plotPath({svg:svg, data:smaData, xScale:xScale, yScale:yScale, variable:plotLineData1['variable'], 
                variableLabel:plotLineData1['variableLabel'], color:plotLineData1['color'], displayText:plotLineData1['displayTest'], 
                delayTime:parseInt(plotLineData1['delayTime']), displayTextTime:parseInt(plotLineData1['displayTextTime'])})
        }

        if (customData['plotLine2'].variable !== "") {
            const plotLineData2 = customData['plotLine2']
            plotPath({svg:svg, data:smaData, xScale:xScale, yScale:yScale, variable:plotLineData2['variable'], 
                variableLabel:plotLineData2['variableLabel'], color:plotLineData2['color'], displayText:plotLineData2['displayTest'], 
                delayTime:parseInt(plotLineData2['delayTime']), displayTextTime:parseInt(plotLineData2['displayTextTime'])})
        }

        if (customData['longSignal'].variable1 !== "") {
            const longSignalData = customData['longSignal']
            crossoverSignal({svg:svg, data:smaData, xScale:xScale, yScale:yScale, variable1:longSignalData['variable1'], 
                variable2:longSignalData['variable2'], longSignal:true, 
                crossAbove:(longSignalData['crossAbove'] === 'Cross Above'), delayTime:parseInt(longSignalData['delayTime']), 
                displayText:longSignalData['displayText'], delayTextTime:parseInt(longSignalData['delayTextTime']), 
                displayTextTime:parseInt(longSignalData['displayTextTime'])})
        }

        if (customData['shortSignal'].variable1 !== "") {
            const shortSignalData = customData['shortSignal']
            crossoverSignal({svg:svg, data:smaData, xScale:xScale, yScale:yScale, variable1:shortSignalData['variable1'], 
                variable2:shortSignalData['variable2'], longSignal:false, 
                crossAbove:(shortSignalData['crossAbove'] === 'Cross Above'), delayTime:parseInt(shortSignalData['delayTime']), 
                displayText:shortSignalData['displayText'], delayTextTime:parseInt(shortSignalData['delayTextTime']), 
                displayTextTime:parseInt(shortSignalData['displayTextTime'])})
        }

        if (customData['annotateUpDown'].variable !== "") {
            const annotateUpDownData = customData['annotateUpDown']
            annotateUpDown({svg:svg, data:smaData, xScale:xScale, yScale:yScale, variable:annotateUpDownData['variable'],
            displayText:annotateUpDownData['displayText'], delayTime:parseInt(annotateUpDownData['delayTime']), 
            delayTextTime:parseInt(annotateUpDownData['delayTextTime']), displayTextTime:parseInt(annotateUpDownData['displayTextTime'])})
        }

        if (customData['tooltipIndicator'] === true) {
            tooltipIndicator({svg:svg, data:smaData, xScale:xScale, yScale:yScale, indicatorChart:false})
        }

        if (customData['annotatePath1'].variable !== "") {
            const annotatePathData1 = customData['annotatePath1']
            annotatePath({svg:svg, variable:annotatePathData1['variable'], displayTime:parseInt(annotatePathData1['displayTime']), displayText:annotatePathData1['displayText']})
        }
        
        if (customData['annotatePath2'].variable !== "") {
            const annotatePathData2 = customData['annotatePath2']
            annotatePath({svg:svg, variable:annotatePathData2['variable'], displayTime:parseInt(annotatePathData2['displayTime']), displayText:annotatePathData2['displayText']})
        }

        if (customData['annotateSignal'].displayTime !== "") {
            const annotateSignalData = customData['annotateSignal']
            annotateSignal({svg:svg, data:smaData, xScale:xScale, yScale:yScale, displayTime:parseInt(annotateSignalData['displayTime'])})
        }
    }
}

export default CustomTutorial;