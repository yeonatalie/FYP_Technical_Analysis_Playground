import * as d3 from "d3";
import { annotateChart, annotateUpDown, crossoverSignal, plotPath, tooltipIndicator, plotWinningLosingTrades, annotateTradePerformance, returnsAndExitTrade } from './animationFramework';

function RsiTutorial({data, xScale, yScale, yProfitScale, tutorial, paramData, performance, stopLoss, takeProfit}) {

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

    //////////////////////////////////////////////
    ////////////// CHART PREPARATION /////////////
    //////////////////////////////////////////////

    // remove previous plot and append new plot
    d3.select(".rsi").remove()
    const svg = d3.select('.candlestickchart')
        .append("g")
        .attr("class", "rsi")

    //////////////////////////////////////////////
    ////////////////// ANIMATION /////////////////
    //////////////////////////////////////////////

    if (tutorial === "rsi" && !performance) {
        // Annotate Close Prices
        annotateChart({svg:svg, data:data, xScale:xScale, yScale:yScale, variable:'close', 
            displayText:'Identify Close Prices', delayTime:500, displayTextTime:2000})
        
        // Annotate Up Down Price Movements
        annotateUpDown({svg:svg, data:data, xScale:xScale, yScale:yScale, variable:'close', 
            displayText:'Identify Up/Down Price Movements. Calculate Average Gain/Loss (%)', delayTime:500, delayTextTime:3000, displayTextTime:5000})

    } else if (tutorial === "rsi" && performance) {
        // Get signal data
        const delayTime = (data.length * 50) + 1000 // wait for up down price mvoements to be animated
        crossoverSignal({svg:svg, data:rsiTutData, xScale:xScale, yScale:yScale, variable1:'rsi', variable2:'oversold', longSignal:true, crossAbove:false, delayTime:delayTime,
            displayText:`Long when RSI Crosses Below ${oversold}, Short when RSI Crosses Above ${overbought}`, delayTextTime:(delayTime + 4000), displayTextTime:7000, allSignalData:allSignalData, performance:false}) // long signal
        crossoverSignal({svg:svg, data:rsiTutData, xScale:xScale, yScale:yScale, variable1:'rsi', variable2:'overbought', longSignal:false, crossAbove:true, delayTime:delayTime,
            displayText:`Long when RSI Crosses Below ${oversold}, Short when RSI Crosses Above ${overbought}`, delayTextTime:(delayTime + 4000), displayTextTime:7000, allSignalData:allSignalData, performance:false}) // short signal

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
        var allSignalAndExitData = returnsAndExitTrade({svg:svg, xScale:xScale, yScale:yScale, data:rsiTutData, allSignalData:allSignalData, stopLoss:stopLoss, takeProfit:takeProfit})

        // Plot Profit
        plotPath({svg:svg, data:rsiTutData, xScale:xScale, yScale:yProfitScale, variable:'strat_gross_profit', variableLabel:'', 
            color:"#E2AB06", displayText:'', delayTime:0, speed:0, displayTextTime:0})

        // Plot trade signals, unfilled for losing trades
        plotWinningLosingTrades({svg:svg, data:rsiTutData, xScale:xScale, yScale:yScale, allSignalAndExitData:allSignalAndExitData})

        // Tooltip showing strategy proft / returns
        var profitTooltipData = []
        rsiTutData.forEach(function(d, index) { 
            profitTooltipData.push({
                'date': d['date'],
                'Profit ($)': d['strat_gross_profit'],
                'Return (%)': d['strat_gross_cum_ret']*100,
                'Trade Return (%)': d['trade_gross_cum_ret']*100
            })
        })  
        tooltipIndicator({svg:svg, data:profitTooltipData, xScale:xScale, yScale:yScale})

        // Tooltip showing trade returns
        annotateTradePerformance({svg:svg, data:rsiTutData, xScale:xScale, yScale:yScale, displayTime:3000})
    }
}

export default RsiTutorial;