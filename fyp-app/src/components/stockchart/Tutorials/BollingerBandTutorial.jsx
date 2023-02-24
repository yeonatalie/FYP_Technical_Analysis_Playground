import * as d3 from "d3";
import { annotateChart, plotPath, crossoverSignal, tooltipIndicator, annotatePath, annotateSignal, plotWinningLosingTrades, annotateTradePerformance, returnsAndExitTrade } from './animationFramework';

const BBand = require('technicalindicators').BollingerBands;

function BbandTutorial({data, xScale, yScale, yProfitScale, tutorial, paramData, performance, stopLoss, takeProfit}) {
    
    //////////////////////////////////////////////
    ////////////// DATA PREPARATION //////////////
    //////////////////////////////////////////////
    var period = paramData['bband']['period']
    var stdDev = paramData['bband']['stdDev']

    // Calculate SMA values and format data into a list of dictionaries
    // [{date:, close:, smaShort, smaLong,}]
    var closeDates = data.map(d => d.date)
    var closePrices = data.map(d => d.close)
    var closeData = {}
    closeDates.map((x, i) => (closeData[x] = closePrices[i]))

    var bbandDates = data.map(d => d.date).slice(period-1)
    var bbandValues = BBand.calculate({period: period, values: closePrices, stdDev: stdDev}) // [{middle:, upper:, lower:}]
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

    var allSignalData = []

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

    if (tutorial === "bband" && !performance) {
        // Annotate Close Prices
        annotateChart({svg:svg, data:data, xScale:xScale, yScale:yScale, variable:'close', 
            displayText:'Annotate Close Prices', delayTime:500, displayTime:3000, displayTextTime:2000})

        // Plot BBands
        const bbandTime = (bbandTutData.length * 50) + 1000
        plotPath({svg:svg, data:bbandTutData, xScale:xScale, yScale:yScale, variable:'middle', variableLabel:'Middle',
            color:"grey", displayText:`Plot ${period} day Bollinger Bands based on ${stdDev} Standard Deviations`, speed:50, delayTime:4000, displayTextTime:bbandTime})
        plotPath({svg:svg, data:bbandTutData, xScale:xScale, yScale:yScale, variable:'upper', variableLabel:'Upper',
            color:"darkred", displayText:`Plot ${period} day Bollinger Bands based on ${stdDev} Standard Deviations`, speed:50, delayTime:4000, displayTextTime:bbandTime})
        plotPath({svg:svg, data:bbandTutData, xScale:xScale, yScale:yScale, variable:'lower', variableLabel:'Lower',
            color:"darkgreen", displayText:`Plot ${period} day Bollinger Bands based on ${stdDev} Standard Deviations`, speed:50, delayTime:4000, displayTextTime:5000})

        // Plot Close Price
        plotPath({svg:svg, data:data, xScale:xScale, yScale:yScale, variable:'close', variableLabel:'Close Price',
            color:"black", displayText:'Plot Close Prices', delayTime:12000, displayTextTime:3000})

        // Annotate Buy Sell Points
        // long signal when cross below lower
        crossoverSignal({svg:svg, data:bbandTutData, xScale:xScale, yScale:yScale, variable1:'close', variable2:'lower', longSignal:true, crossAbove:false, delayTime:12000,
            displayText:'Long/Short when Prices Crosses Below/Above Lower/Upper Bollinger Band', delayTextTime:16000, displayTextTime:7000, allSignalData:allSignalData, performance:performance}) 
        // short signal when cross above upper
        crossoverSignal({svg:svg, data:bbandTutData, xScale:xScale, yScale:yScale, variable1:'close', variable2:'upper', longSignal:false, crossAbove:true, delayTime:12000,
            displayText:'Long/Short when Prices Crosses Below/Above Lower/Upper Bollinger Band', delayTextTime:16000, displayTextTime:7000, allSignalData:allSignalData, performance:performance}) 

        // Tooltip
        tooltipIndicator({svg:svg, data:bbandTutData, xScale:xScale, yScale:yScale})

        // Annotate Path
        annotatePath({svg:svg, variable:'middle', displayTime:3000, displayText:'Middle Bollinger Band'})
        annotatePath({svg:svg, variable:'upper', displayTime:3000, displayText:'Upper Bollinger Band'})
        annotatePath({svg:svg, variable:'lower', displayTime:3000, displayText:'Lower Bollinger Band'})
        annotatePath({svg:svg, variable:'close', displayTime:3000, displayText:'Close Price'})

        // Annotate Signal
        annotateSignal({svg:svg, data:bbandTutData, xScale:xScale, yScale:yScale, displayTime:3000})

    } else if (tutorial === "bband" && performance) {
        // Get signal data
        // long signal when cross below lower
        crossoverSignal({svg:svg, data:bbandTutData, xScale:xScale, yScale:yScale, variable1:'close', variable2:'lower', longSignal:true, crossAbove:false, delayTime:12000,
            displayText:'Long/Short when Prices Crosses Below/Above Lower/Upper Bollinger Band', delayTextTime:16000, displayTextTime:7000, allSignalData:allSignalData, performance:performance}) 
        // short signal when cross above upper
        crossoverSignal({svg:svg, data:bbandTutData, xScale:xScale, yScale:yScale, variable1:'close', variable2:'upper', longSignal:false, crossAbove:true, delayTime:12000,
            displayText:'Long/Short when Prices Crosses Below/Above Lower/Upper Bollinger Band', delayTextTime:16000, displayTextTime:7000, allSignalData:allSignalData, performance:performance}) 

        // sort long and short signals by trade date
        allSignalData.sort(function(a, b) {
            if (a.date < b.date) return -1;
            if (a.date > b.date) return 1;
            return 0;
        })

        // Stop loss
        stopLoss = -parseFloat(stopLoss)/100
        takeProfit = parseFloat(takeProfit)/100
        
        // Calculate trade returns & annotate stop loss / take profit
        var allSignalAndExitData = returnsAndExitTrade({svg:svg, xScale:xScale, yScale:yScale, data:bbandTutData, allSignalData:allSignalData, stopLoss:stopLoss, takeProfit:takeProfit})

        // Plot Profit
        plotPath({svg:svg, data:bbandTutData, xScale:xScale, yScale:yProfitScale, variable:'strat_gross_profit', variableLabel:'', 
            color:"#E2AB06", displayText:'', delayTime:0, speed:0, displayTextTime:0})

        // Plot trade signals, unfilled for losing trades
        plotWinningLosingTrades({svg:svg, data:bbandTutData, xScale:xScale, yScale:yScale, allSignalAndExitData:allSignalAndExitData})

        // Tooltip showing strategy proft / returns
        var profitTooltipData = []
        bbandTutData.forEach(function(d, index) { 
            profitTooltipData.push({
                'date': d['date'],
                'Profit ($)': d['strat_gross_profit'],
                'Return (%)': d['strat_gross_cum_ret']*100
            })
        })  
        tooltipIndicator({svg:svg, data:profitTooltipData, xScale:xScale, yScale:yScale})

        // Tooltip showing trade returns
        annotateTradePerformance({svg:svg, data:bbandTutData, xScale:xScale, yScale:yScale, displayTime:3000})
    }
}

export default BbandTutorial;