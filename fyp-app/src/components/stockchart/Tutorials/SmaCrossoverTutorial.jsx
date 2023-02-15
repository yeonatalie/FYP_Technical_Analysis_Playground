import * as d3 from "d3";
import { annotateChart, plotPath, crossoverSignal, tooltipIndicator, annotatePath, annotateSignal, plotWinningLosingTrades, annotateTradePerformance} from './animationFramework';
import { utcFormat } from 'd3';
const formatDate = utcFormat('%B %-d, %Y');
const SMA = require('technicalindicators').SMA;

function SmaCrossover({data, xScale, yScale, yProfitScale, tutorial, performance, stopLoss, takeProfit}) {
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
    if (tutorial === "sma" && !performance) {
        // Annotate Close Prices
        annotateChart({svg:svg, data:data, xScale:xScale, yScale:yScale, variable:'close', 
            displayText:'Identify Close Prices', delayTime:500, displayTime:3000, displayTextTime:3000})
        
        // Plot SMAs
        plotPath({svg:svg, data:smaData, xScale:xScale, yScale:yScale, variable:'smaShort', variableLabel:'7 days', 
            color:"darkblue", displayText:'Plot 7 & 14 day SMAs', delayTime:4000, displayTextTime:2000})
        plotPath({svg:svg, data:smaData, xScale:xScale, yScale:yScale, variable:'smaLong', variableLabel:'14 days', 
            color:"brown", displayText:'Plot 7 & 14 day SMAs', delayTime:4000, displayTextTime:2000})

        // SMA crossover
        crossoverSignal({svg:svg, data:smaData, xScale:xScale, yScale:yScale, variable1:'smaShort', variable2:'smaLong', delayTime:4000,
            displayText:'Long/Short when Short Term SMA Crosses Above/Below Long Term SMA', delayTextTime:7000, displayTextTime:2000, allSignalData:allSignalData, performance:performance}) // long signal
        crossoverSignal({svg:svg, data:smaData, xScale:xScale, yScale:yScale, variable1:'smaShort', variable2:'smaLong', longSignal:false, crossAbove:false, delayTime:4000,
            displayText:'Long/Short when Short Term SMA Crosses Above/Below Long Term SMA', delayTextTime:7000, displayTextTime:2000, allSignalData:allSignalData, performance:performance}) // short signal
        
        // Tooltip
        tooltipIndicator({svg:svg, data:smaData, xScale:xScale, yScale:yScale})

        // Annotate Path
        annotatePath({svg:svg, variable:'smaShort', displayTime:3000, displayText:'Simple Moving Average of Close Prices the Last 7 Days'})
        annotatePath({svg:svg, variable:'smaLong', displayTime:3000, displayText:'Simple Moving Average of Close Prices the Last 14 Days'})

        // Annotate Signal
        annotateSignal({svg:svg, data:smaData, xScale:xScale, yScale:yScale, displayTime:3000})

    
    ////////////////////////
    // TRADE PERFORMANCES //
    ////////////////////////

    } else if (tutorial === "sma" && performance) {
        // Get signal data from SMA crossover
        crossoverSignal({svg:svg, data:smaData, xScale:xScale, yScale:yScale, variable1:'smaShort', variable2:'smaLong', delayTime:4000,
            displayText:'Long/Short when Short Term SMA Crosses Above/Below Long Term SMA', delayTextTime:7000, displayTextTime:2000, allSignalData:allSignalData, performance:performance}) // long signal
        crossoverSignal({svg:svg, data:smaData, xScale:xScale, yScale:yScale, variable1:'smaShort', variable2:'smaLong', longSignal:false, crossAbove:false, delayTime:4000,
            displayText:'Long/Short when Short Term SMA Crosses Above/Below Long Term SMA', delayTextTime:7000, displayTextTime:2000, allSignalData:allSignalData, performance:performance}) // short signal
        
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
        smaData.at(0)['strat_gross_cum_log_ret'] = 0
        smaData.at(0)['strat_gross_profit'] = 0

        // Stop loss
        stopLoss = -parseFloat(stopLoss)/100
        takeProfit = parseFloat(takeProfit)/100
        var allExitData = []

        console.log(stopLoss)
        console.log(takeProfit)

        smaData.forEach(function(d, index) { 
            var prevDay = smaData[Math.max(index-1, 0)]

            // calculate position
            if (d['date'] === signal['date']) {
                d['signal'] = signal['signal']
                d['position'] = signal['signal']
                prevPosition = d['position']
 
                signalIndex = Math.min(signalIndex + 1, allSignalData.length - 1)
                signal = allSignalData.at(signalIndex)
            } else {
                d['signal'] = 0
                d['position'] = prevPosition
            }

            d['stock_daily_dollar_return'] = d['close'] - prevDay['close']
            d['stock_daily_log_return'] = Math.log(d['close'] / prevDay['close'])

            d['strat_daily_dollar_return'] = d['stock_daily_dollar_return'] * prevDay['position']
            d['strat_gross_profit'] = prevDay['strat_gross_profit'] + d['strat_daily_dollar_return']

            d['strat_daily_log_return'] = d['stock_daily_log_return'] * prevDay['position']
            d['strat_gross_cum_log_ret'] = prevDay['strat_gross_cum_log_ret'] + d['strat_daily_log_return']
            d['strat_gross_cum_ret'] = Math.exp(d['strat_gross_cum_log_ret']) - 1

            // calculate trade gross return for purpose of stop loss / take profit
            if (prevDay['signal'] === 0) {
                d['trade_gross_cum_log_ret'] = prevDay['trade_gross_cum_log_ret'] + d['strat_daily_log_return']
            } else {
                d['trade_gross_cum_log_ret'] = d['strat_daily_log_return'] // reset when trade signal present
            }
            d['trade_gross_cum_ret'] = Math.exp(d['trade_gross_cum_log_ret']) - 1

            // check for stop loss or take profit (based on trade, not entire strategy)
            if (d['trade_gross_cum_ret'] < stopLoss || d['trade_gross_cum_ret'] > takeProfit) {
                if (d['position'] !== 0 && d['signal'] === 0) {
                    d['signal'] = -(prevDay['position'] / 2)
                    d['position'] = 0
                    prevPosition = d['position']
    
                    allExitData.push({
                        'date': d.date,
                        'dateFormatted': formatDate(d.date),
                        'signal': d.signal,
                        'close': d['close'],
                    })
                }
            }
        })  

        var allSignalAndExitData = [...allSignalData, ...allExitData]
        // sort all signal and exit signals by trade date
        allSignalAndExitData.sort(function(a, b) {
            if (a.date < b.date) return -1;
            if (a.date > b.date) return 1;
            return 0;
        })

        console.log(smaData)
        console.log(allExitData)
        console.log(allSignalAndExitData)

        svg.selectAll()
            .data(allExitData).enter()
            .append("path")
            .attr("d", d3.symbol().type(d3.symbolCross).size(120))
            .attr("transform", function (d) { return "translate(" + xScale(d.date) + "," + yScale(d.close) + ") rotate(45)";
            })
            .attr("fill", "black");
        

        // Plot Profit
        plotPath({svg:svg, data:smaData, xScale:xScale, yScale:yProfitScale, variable:'strat_gross_profit', variableLabel:'', 
            color:"#E2AB06", displayText:'', delayTime:0, speed:0, displayTextTime:0})

        // Plot trade signals, unfilled for losing trades
        plotWinningLosingTrades({svg:svg, data:smaData, xScale:xScale, yScale:yScale, allSignalAndExitData:allSignalAndExitData})

        // Tooltip showing strategy proft / returns
        var profitTooltipData = []
        smaData.forEach(function(d, index) { 
            profitTooltipData.push({
                'date': d['date'],
                'Profit ($)': d['strat_gross_profit'],
                'Return (%)': d['strat_gross_cum_ret']*100,
                'Trade Return (%)': d['trade_gross_cum_ret']*100
            })
        })  
        tooltipIndicator({svg:svg, data:profitTooltipData, xScale:xScale, yScale:yScale})

        // Tooltip showing trade returns
        annotateTradePerformance({svg:svg, data:smaData, xScale:xScale, yScale:yScale, displayTime:3000})
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