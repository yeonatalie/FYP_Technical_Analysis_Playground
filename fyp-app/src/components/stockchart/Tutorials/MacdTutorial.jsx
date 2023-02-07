import * as d3 from "d3";
import { annotateChart, crossoverSignal, plotPath, tooltipIndicator, plotWinningLosingTrades, annotateTradePerformance } from './animationFramework';

function MacdTutorial({data, xScale, yScale, yProfitScale, tutorial, performance}) {

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

        // Calculate trade returns
        var signalIndex = 0
        var signal = allSignalData.at(signalIndex)
        var prevPosition = 0
        macdTutData.at(0)['strat_gross_cum_log_ret'] = 0
        macdTutData.at(0)['strat_gross_profit'] = 0

        macdTutData.forEach(function(d, index) { 
            if (d['date'] === signal['date']) {
                d['position'] = signal['signal']
                prevPosition = d['position']
 
                signalIndex = Math.min(signalIndex + 1, allSignalData.length - 1)
                signal = allSignalData.at(signalIndex)
            } else {
                d['position'] = prevPosition
            }

            var prevDay = macdTutData[Math.max(index-1, 0)]
            d['stock_daily_dollar_return'] = d['close'] - prevDay['close']
            d['stock_daily_log_return'] = Math.log(d['close'] / prevDay['close'])

            d['strat_daily_dollar_return'] = d['stock_daily_dollar_return'] * prevDay['position']
            d['strat_gross_profit'] = prevDay['strat_gross_profit'] + d['strat_daily_dollar_return']

            d['strat_daily_log_return'] = d['stock_daily_log_return'] * prevDay['position']
            d['strat_gross_cum_log_ret'] = prevDay['strat_gross_cum_log_ret'] + d['strat_daily_log_return']
            d['strat_gross_cum_ret'] = Math.exp(d['strat_gross_cum_log_ret']) - 1
        })  


        // Plot Profit
        plotPath({svg:svg, data:macdTutData, xScale:xScale, yScale:yProfitScale, variable:'strat_gross_profit', variableLabel:'', 
            color:"#E2AB06", displayText:'', delayTime:0, speed:0, displayTextTime:0})

        // Plot trade signals, unfilled for losing trades
        plotWinningLosingTrades({svg:svg, data:macdTutData, xScale:xScale, yScale:yScale, allSignalData:allSignalData})

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