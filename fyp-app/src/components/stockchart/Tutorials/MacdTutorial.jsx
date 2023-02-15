import * as d3 from "d3";
import { annotateChart, crossoverSignal, plotPath, tooltipIndicator, plotWinningLosingTrades, annotateTradePerformance, returnsAndExitTrade } from './animationFramework';

function MacdTutorial({data, xScale, yScale, yProfitScale, tutorial, performance, stopLoss, takeProfit}) {

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
        var allSignalAndExitData = returnsAndExitTrade({svg:svg, xScale:xScale, yScale:yScale, data:macdTutData, allSignalData:allSignalData, stopLoss:stopLoss, takeProfit:takeProfit})

        // Plot Profit
        plotPath({svg:svg, data:macdTutData, xScale:xScale, yScale:yProfitScale, variable:'strat_gross_profit', variableLabel:'', 
            color:"#E2AB06", displayText:'', delayTime:0, speed:0, displayTextTime:0})

        // Plot trade signals, unfilled for losing trades
        plotWinningLosingTrades({svg:svg, data:macdTutData, xScale:xScale, yScale:yScale, allSignalAndExitData:allSignalAndExitData})

        // Tooltip showing strategy proft / returns
        var profitTooltipData = []
        macdTutData.forEach(function(d, index) { 
            profitTooltipData.push({
                'date': d['date'],
                'Profit ($)': d['strat_gross_profit'],
                'Return (%)': d['strat_gross_cum_ret']*100
            })
        })  
        tooltipIndicator({svg:svg, data:profitTooltipData, xScale:xScale, yScale:yScale})

        // Tooltip showing trade returns
        annotateTradePerformance({svg:svg, data:macdTutData, xScale:xScale, yScale:yScale, displayTime:3000})
    }
}

export default MacdTutorial;