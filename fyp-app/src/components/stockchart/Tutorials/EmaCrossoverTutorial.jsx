import * as d3 from "d3";
import { annotateChart, plotPath, crossoverSignal, tooltipIndicator, annotatePath, annotateSignal, plotWinningLosingTrades, annotateTradePerformance, returnsAndExitTrade } from './animationFramework';

function EmaCrossover({data, xScale, yScale, yProfitScale, tutorial, performance, stopLoss, takeProfit}) {
    
    //////////////////////////////////////////////
    ////////////// DATA PREPARATION //////////////
    //////////////////////////////////////////////

    // Calculate EMA values and format data into a list of dictionaries
    // [{date:, close:, smaShort, smaLong,}]
    var closeDates = data.map(d => d.date)
    var closePrices = data.map(d => d.close)
    var closeData = {}
    closeDates.map((x, i) => (closeData[x] = closePrices[i]))

    const EMA = require('technicalindicators').EMA;

    var emaShortDates = data.map(d => d.date).slice(7-1)
    var emaShortValues = EMA.calculate({period: 7, values: closePrices}) //list of SMA values
    var emaShortData = {}
    emaShortDates.map((x, i) => (emaShortData[x] = emaShortValues[i]))

    var emaLongDates = data.map(d => d.date).slice(14-1)
    var emaLongValues = EMA.calculate({period: 14, values: closePrices}) //list of SMA values
    var emaLongData = {}
    emaLongDates.map((x, i) => (emaLongData[x] = emaLongValues[i]))

    var emaData = []
    for (const [date, emaLong] of Object.entries(emaLongData)) {
        emaData.push({
            'date': Date.parse(date),
            'close': closeData[date],
            'emaShort': emaShortData[date],
            'emaLong': emaLong
        })
    }

    var allSignalData = []

    //////////////////////////////////////////////
    ////////////// CHART PREPARATION /////////////
    //////////////////////////////////////////////

    // remove previous plot and append new plot
    d3.select(".emacrossover").remove()
    const svg = d3.select('.candlestickchart')
        .append("g")
        .attr("class", "emacrossover")
        .attr("class", "emacrossover")


    //////////////////////////////////////////////
    ////////////////// ANIMATION /////////////////
    //////////////////////////////////////////////

    // Plot and Animate EMA Crossover
    if (tutorial === 'ema' && !performance) {
        // Annotate Close Prices
        annotateChart({svg:svg, data:data, xScale:xScale, yScale:yScale, variable:'close', 
            displayText:'Identify Close Prices', delayTime:3000, displayTime:5000, displayTextTime:5000})
        
        // Plot EMAs
        plotPath({svg:svg, data:emaData, xScale:xScale, yScale:yScale, variable:'emaShort', variableLabel:'7 days', 
            color:"darkblue", displayText:'Plot 7 & 14 day EMAs. EMAs are more Reactive to Price Changes than SMAs', delayTime:10000, displayTextTime:10000})
        plotPath({svg:svg, data:emaData, xScale:xScale, yScale:yScale, variable:'emaLong', variableLabel:'14 days', 
            color:"brown", displayText:'Plot 7 & 14 day EMAs. EMAs are more Reactive to Price Changes than SMAs', delayTime:10000, displayTextTime:10000})

        // EMA crossover
        crossoverSignal({svg:svg, data:emaData, xScale:xScale, yScale:yScale, variable1:'emaShort', variable2:'emaLong', delayTime:10000,
            displayText:'Long/Short when Short Term EMA Crosses Above/Below Long Term EMA', delayTextTime:22000, displayTextTime:20000, allSignalData:allSignalData, performance:performance}) // long signal
        crossoverSignal({svg:svg, data:emaData, xScale:xScale, yScale:yScale, variable1:'emaShort', variable2:'emaLong', longSignal:false, crossAbove:false, delayTime:10000,
            displayText:'Long/Short when Short Term EMA Crosses Above/Below Long Term EMA', delayTextTime:22000, displayTextTime:20000, allSignalData:allSignalData, performance:performance}) // short signal

        // Tooltip
        tooltipIndicator({svg:svg, data:emaData, xScale:xScale, yScale:yScale})

        // Annotate Path
        annotatePath({svg:svg, variable:'emaShort', displayTime:3000, displayText:'Exponential Moving Average of Close Prices the Last 7 Days'})
        annotatePath({svg:svg, variable:'emaLong', displayTime:3000, displayText:'Exponential Moving Average of Close Prices the Last 14 Days'})

        // Annotate Signal
        annotateSignal({svg:svg, data:emaData, xScale:xScale, yScale:yScale, displayTime:3000})


    ////////////////////////
    // TRADE PERFORMANCES //
    ////////////////////////

    } else if (tutorial === "ema" && performance) {
        // Get signal data from SMA crossover
        crossoverSignal({svg:svg, data:emaData, xScale:xScale, yScale:yScale, variable1:'emaShort', variable2:'emaLong', delayTime:10000,
            displayText:'Long/Short when Short Term EMA Crosses Above/Below Long Term EMA', delayTextTime:22000, displayTextTime:20000, allSignalData:allSignalData, performance:performance}) // long signal
        crossoverSignal({svg:svg, data:emaData, xScale:xScale, yScale:yScale, variable1:'emaShort', variable2:'emaLong', longSignal:false, crossAbove:false, delayTime:10000,
            displayText:'Long/Short when Short Term EMA Crosses Above/Below Long Term EMA', delayTextTime:22000, displayTextTime:20000, allSignalData:allSignalData, performance:performance}) // short signal

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
        var allSignalAndExitData = returnsAndExitTrade({svg:svg, xScale:xScale, yScale:yScale, data:emaData, allSignalData:allSignalData, stopLoss:stopLoss, takeProfit:takeProfit})

        // Plot Profit
        plotPath({svg:svg, data:emaData, xScale:xScale, yScale:yProfitScale, variable:'strat_gross_profit', variableLabel:'', 
            color:"#E2AB06", displayText:'', delayTime:0, speed:0, displayTextTime:0})

        // Plot trade signals, unfilled for losing trades
        plotWinningLosingTrades({svg:svg, data:emaData, xScale:xScale, yScale:yScale, allSignalAndExitData:allSignalAndExitData})

        // Tooltip showing strategy proft / returns
        var profitTooltipData = []
        emaData.forEach(function(d, index) { 
            profitTooltipData.push({
                'date': d['date'],
                'Profit ($)': d['strat_gross_profit'],
                'Return (%)': d['strat_gross_cum_ret']*100,
                'Trade Return (%)': d['trade_gross_cum_ret']*100
            })
        })  
        tooltipIndicator({svg:svg, data:profitTooltipData, xScale:xScale, yScale:yScale})

        // Tooltip showing trade returns
        annotateTradePerformance({svg:svg, data:emaData, xScale:xScale, yScale:yScale, displayTime:3000})
    }
}

export default EmaCrossover;