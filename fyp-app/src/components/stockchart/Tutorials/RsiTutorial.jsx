import * as d3 from "d3";
import { annotateChart, annotateUpDown, crossoverSignal, plotPath, tooltipIndicator, plotWinningLosingTrades, annotateTradePerformance } from './animationFramework';

function RsiTutorial({data, xScale, yScale, yProfitScale, tutorial, performance}) {

    //////////////////////////////////////////////
    ////////////// DATA PREPARATION //////////////
    //////////////////////////////////////////////

    // Calculate RSI values and format data into a list of dictionaries
    var closeDates = data.map(d => d.date)
    var closePrices = data.map(d => d.close)
    var closeData = {}
    closeDates.map((x, i) => (closeData[x] = closePrices[i]))

    const RSI = require('technicalindicators').RSI;
    var rsiValues = RSI.calculate({period: 14, values: closePrices}) 
    var rsiDates = data.map(d => d.date).slice(14)
    var rsiData = {}
    rsiDates.map((x, i) => (rsiData[x] = rsiValues[i]))

    var rsiTutData = []
    for (const [date, rsi] of Object.entries(rsiData)) {
        rsiTutData.push({
            'date': Date.parse(date),
            'close': closeData[date],
            'rsi': rsi,
            'overbought': 70, // Filter levels
            'oversold': 30, // Filter levels
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
            displayText:'Long when RSI Crosses Below 30, Short when RSI Crosses Above 70', delayTextTime:(delayTime + 4000), displayTextTime:7000, allSignalData:allSignalData, performance:false}) // long signal
        crossoverSignal({svg:svg, data:rsiTutData, xScale:xScale, yScale:yScale, variable1:'rsi', variable2:'overbought', longSignal:false, crossAbove:true, delayTime:delayTime,
            displayText:'Long when RSI Crosses Below 30, Short when RSI Crosses Above 70', delayTextTime:(delayTime + 4000), displayTextTime:7000, allSignalData:allSignalData, performance:false}) // short signal

        // sort long and short signals by trade date
        allSignalData.sort(function(a, b) {
            if (a.date < b.date) return -1;
            if (a.date > b.date) return 1;
            return 0;
        })

        // Calculate trade returns
        var signalIndex = 0
        var signal = allSignalData.at(signalIndex)
        var prevPosition = 0
        rsiTutData.at(0)['strat_gross_cum_log_ret'] = 0
        rsiTutData.at(0)['strat_gross_profit'] = 0

        rsiTutData.forEach(function(d, index) { 
            if (d['date'] === signal['date']) {
                d['position'] = signal['signal']
                prevPosition = d['position']
 
                signalIndex = Math.min(signalIndex + 1, allSignalData.length - 1)
                signal = allSignalData.at(signalIndex)
            } else {
                d['position'] = prevPosition
            }

            var prevDay = rsiTutData[Math.max(index-1, 0)]
            d['stock_daily_dollar_return'] = d['close'] - prevDay['close']
            d['stock_daily_log_return'] = Math.log(d['close'] / prevDay['close'])

            d['strat_daily_dollar_return'] = d['stock_daily_dollar_return'] * prevDay['position']
            d['strat_gross_profit'] = prevDay['strat_gross_profit'] + d['strat_daily_dollar_return']

            d['strat_daily_log_return'] = d['stock_daily_log_return'] * prevDay['position']
            d['strat_gross_cum_log_ret'] = prevDay['strat_gross_cum_log_ret'] + d['strat_daily_log_return']
            d['strat_gross_cum_ret'] = Math.exp(d['strat_gross_cum_log_ret']) - 1
        })  


        // Plot Profit
        plotPath({svg:svg, data:rsiTutData, xScale:xScale, yScale:yProfitScale, variable:'strat_gross_profit', variableLabel:'', 
            color:"#E2AB06", displayText:'', delayTime:0, speed:0, displayTextTime:0})

        // Plot trade signals, unfilled for losing trades
        plotWinningLosingTrades({svg:svg, data:rsiTutData, xScale:xScale, yScale:yScale, allSignalData:allSignalData})

        // Tooltip showing strategy proft / returns
        var profitTooltipData = []
        rsiTutData.forEach(function(d, index) { 
            profitTooltipData.push({
                'date': d['date'],
                'Profit ($)': d['strat_gross_profit'],
                'Return (%)': d['strat_gross_cum_ret']*100
            })
        })  
        tooltipIndicator({svg:svg, data:profitTooltipData, xScale:xScale, yScale:yScale})

        // Tooltip showing trade returns
        annotateTradePerformance({svg:svg, data:rsiTutData, xScale:xScale, yScale:yScale, displayTime:3000})
    }
}

export default RsiTutorial;