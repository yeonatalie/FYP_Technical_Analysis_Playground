import * as d3 from "d3";
import { annotateChart, plotPath, crossoverSignal, annotateUpDown, tooltip, annotatePath, annotateSignal, plotBar } from './animationFramework';

function CustomChartTutorial({data, xScale, yScale, tutorial, customData}) {
    if (tutorial === "custom") {
        var allSignalData = []
        
        //////////////////////////////////////////////
        ////////////// CHART PREPARATION /////////////
        //////////////////////////////////////////////

        // remove previous plot and append new plot
        d3.select(".customChartTutorial").remove()
        const svg = d3.select('.indicatorchart')
            .append("g")
            .attr("class", "customChartTutorial")
        
        //////////////////////////////////////////////
        ////////////////// ANIMATIONS ////////////////
        //////////////////////////////////////////////

        if (customData['annotate'].variable !== "" && customData['annotate'].indicatorChart) {
            const annotateData = customData['annotate']
            annotateChart({svg:svg, data:data, xScale:xScale, yScale:yScale, variable:annotateData['variable'], color:annotateData['color'],
                displayText:annotateData['displayText'], delayTime:parseInt(annotateData['delayTime']), displayTime:parseInt(annotateData['displayTime']), 
                displayTextTime:parseInt(annotateData['displayTextTime'])})

        }  
        
        if (customData['plotLine1'].variable !== "" && customData['plotLine1'].indicatorChart) {
            const plotLineData1 = customData['plotLine1']
            plotPath({svg:svg, data:data, xScale:xScale, yScale:yScale, variable:plotLineData1['variable'], 
                variableLabel:plotLineData1['variableLabel'], color:plotLineData1['color'], displayText:plotLineData1['displayText'], 
                delayTime:parseInt(plotLineData1['delayTime']), displayTextTime:parseInt(plotLineData1['displayTextTime'])})
        }

        if (customData['plotLine2'].variable !== "" && customData['plotLine2'].indicatorChart) {
            const plotLineData2 = customData['plotLine2']
            plotPath({svg:svg, data:data, xScale:xScale, yScale:yScale, variable:plotLineData2['variable'], 
                variableLabel:plotLineData2['variableLabel'], color:plotLineData2['color'], displayText:plotLineData2['displayTest'], 
                delayTime:parseInt(plotLineData2['delayTime']), displayTextTime:parseInt(plotLineData2['displayTextTime'])})
        }

        if (customData['longSignal'].variable1 !== "" && customData['longSignal'].indicatorChart) {
            const longSignalData = customData['longSignal']
            crossoverSignal({svg:svg, data:data, xScale:xScale, yScale:yScale, variable1:longSignalData['variable1'], 
                variable2:longSignalData['variable2'], longSignal:true, 
                crossAbove:(longSignalData['crossAbove'] === 'Cross Above'), delayTime:parseInt(longSignalData['delayTime']), 
                displayText:longSignalData['displayText'], delayTextTime:parseInt(longSignalData['delayTextTime']), 
                displayTextTime:parseInt(longSignalData['displayTextTime']), allSignalData:allSignalData, performance:performance})
        }

        if (customData['shortSignal'].variable1 !== "" && customData['shortSignal'].indicatorChart) {
            const shortSignalData = customData['shortSignal']
            crossoverSignal({svg:svg, data:data, xScale:xScale, yScale:yScale, variable1:shortSignalData['variable1'], 
                variable2:shortSignalData['variable2'], longSignal:false, 
                crossAbove:(shortSignalData['crossAbove'] === 'Cross Above'), delayTime:parseInt(shortSignalData['delayTime']), 
                displayText:shortSignalData['displayText'], delayTextTime:parseInt(shortSignalData['delayTextTime']), 
                displayTextTime:parseInt(shortSignalData['displayTextTime']), allSignalData:allSignalData, performance:performance})
        }

        if (customData['annotateUpDown'].variable !== "" && customData['annotateUpDown'].indicatorChart) {
            const annotateUpDownData = customData['annotateUpDown']
            annotateUpDown({svg:svg, data:data, xScale:xScale, yScale:yScale, variable:annotateUpDownData['variable'],
            displayText:annotateUpDownData['displayText'], delayTime:parseInt(annotateUpDownData['delayTime']), 
            delayTextTime:parseInt(annotateUpDownData['delayTextTime']), displayTextTime:parseInt(annotateUpDownData['displayTextTime'])})
        }

        if (customData['tooltipIndicator'].tooltip === true && customData['tooltipIndicator'].indicatorChart) {
            tooltip({svg:svg, data:data, xScale:xScale, yScale:yScale, indicatorChart:true})
        }

        if (customData['annotatePath1'].variable !== "" && customData['annotatePath1'].indicatorChart) {
            const annotatePathData1 = customData['annotatePath1']
            annotatePath({svg:svg, variable:annotatePathData1['variable'], displayTime:parseInt(annotatePathData1['displayTime']), displayText:annotatePathData1['displayText']})
        }
        
        if (customData['annotatePath2'].variable !== "" && customData['annotatePath2'].indicatorChart) {
            const annotatePathData2 = customData['annotatePath2']
            annotatePath({svg:svg, variable:annotatePathData2['variable'], displayTime:parseInt(annotatePathData2['displayTime']), displayText:annotatePathData2['displayText']})
        }

        if (customData['annotateSignal'].displayTime !== "" && customData['annotateSignal'].indicatorChart) {
            const annotateSignalData = customData['annotateSignal']
            annotateSignal({svg:svg, data:data, xScale:xScale, yScale:yScale, displayTime:parseInt(annotateSignalData['displayTime'])})
        }

        if (customData['plotBar'].variable !== "" && customData['plotBar'].indicatorChart) {
            const plotBarData = customData['plotBar']
            plotBar({svg:svg, data:data, xScale:xScale, yScale:yScale, variable:plotBarData['variable'], delayTime:parseInt(plotBarData['delayTime'])})
        }
    }
}

export default CustomChartTutorial;