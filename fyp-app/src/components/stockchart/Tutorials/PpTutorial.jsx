import * as d3 from "d3";
import { annotateChart, plotPath, crossoverSignal, tooltipIndicator, annotatePath, annotateSignal, plotWinningLosingTrades, annotateTradePerformance } from './animationFramework';
import { schemePastel1 } from 'd3';

function PpTutorial({data, xScale, yScale, yProfitScale, tutorial, performance}) {
    //////////////////////////////////////////////
    ////////////// DATA PREPARATION //////////////
    //////////////////////////////////////////////
    var prevHigh = data.at(0)['high']
    var prevLow = data.at(0)['low']
    var prevClose = data.at(0)['close']
    var prevTp = (prevHigh + prevLow + prevClose) / 3

    data = data.slice(1)
    data.forEach(function(d, index) {
        delete d.adjClose
        delete d.volume
        d['tp'] = (prevHigh + prevLow + prevClose) / 3
        d['r1'] = (prevTp * 2) - prevLow
        d['r2'] = prevTp + (prevHigh - prevLow)
        d['s1'] = (prevTp * 2) - prevHigh
        d['s2'] = prevTp - (prevHigh - prevLow)

        prevHigh = d['high']
        prevLow = d['low']
        prevClose = d['close']
        prevTp = d['tp']
    })

    var allSignalData = []

    //////////////////////////////////////////////
    ////////////// CHART PREPARATION /////////////
    //////////////////////////////////////////////

    // remove previous plot and append new plot
    d3.select(".pp").remove()
    const svg = d3.select('.candlestickchart')
        .append("g")
        .attr("class", "pp")

    //////////////////////////////////////////////
    ////////////////// ANIMATION /////////////////
    //////////////////////////////////////////////

    if (tutorial === "pp" && !performance) {
        // Annotate Close Prices
        annotateChart({svg:svg, data:data, xScale:xScale, yScale:yScale, variable:'close', 
            displayText:'Identify Close Prices', delayTime:500, displayTime:1500, displayTextTime:1000})
        // Annotate High Prices
        annotateChart({svg:svg, data:data, xScale:xScale, yScale:yScale, variable:'high', 
            color:'green', displayText:'Identify High Prices', delayTime:2500, displayTime:1500, displayTextTime:1000})
        // Annotate Low Prices
        annotateChart({svg:svg, data:data, xScale:xScale, yScale:yScale, variable:'low', 
            color:'red', displayText:'Identify Low Prices', delayTime:4500, displayTime:1500, displayTextTime:1000})

        // Annotate Typical Price
        annotateChart({svg:svg, data:data, xScale:xScale, yScale:yScale, variable:'tp', 
        color:'blue', displayText:'Calculate Typical Price', delayTime:6500, displayTime:2000, displayTextTime:1500})

        // Plot  Support and Resistance 
        plotPath({svg:svg, data:data, xScale:xScale, yScale:yScale, variable:'r1', variableLabel:'R1', 
            color:schemePastel1[0], displayText:'Plot Support and Resistance using Previous Day Data', speed:200, delayTime:9000, displayTextTime:3000})
        plotPath({svg:svg, data:data, xScale:xScale, yScale:yScale, variable:'s1', variableLabel:'S1', 
            color:schemePastel1[2], displayText:'Plot Support and Resistance using Previous Day Data', speed:200, delayTime:9000, displayTextTime:3000})
        plotPath({svg:svg, data:data, xScale:xScale, yScale:yScale, variable:'r2', variableLabel:'R2', 
            color:'red', displayText:'Plot Support and Resistance using Previous Day Data', speed:200, delayTime:9000, displayTextTime:3000})
        plotPath({svg:svg, data:data, xScale:xScale, yScale:yScale, variable:'s2', variableLabel:'S2', 
            color:'green', displayText:'Plot Support and Resistance using Previous Day Data', speed:200, delayTime:9000, displayTextTime:3000})
        
        // Plot Close Price
        plotPath({svg:svg, data:data, xScale:xScale, yScale:yScale, variable:'close', variableLabel:'Close', 
            color:'black', displayText:'Plot Support and Resistance using Previous Day Data', speed:200, delayTime:9000, displayTextTime:3000})
        
        // Annotate Buy Sell Points
        crossoverSignal({svg:svg, data:data, xScale:xScale, yScale:yScale, variable1:'close', variable2:'s2', longSignal:true, crossAbove:false, delayTime:9000,
            displayText:'Long / Short when Close Price Crosses Support / Resistance', speed:200, delayTextTime:15000, displayTextTime:7000, allSignalData:allSignalData, performance:performance}) // long signal
        crossoverSignal({svg:svg, data:data, xScale:xScale, yScale:yScale, variable1:'close', variable2:'r2', longSignal:false, crossAbove:true, delayTime:9000,
            displayText:'Long / Short when Close Price Crosses Support / Resistance', speed:200, delayTextTime:15000, displayTextTime:7000, allSignalData:allSignalData, performance:performance}) // short signal
        
        // Tooltip
        tooltipIndicator({svg:svg, data:data, xScale:xScale, yScale:yScale})

        // Annotate Path
        annotatePath({svg:svg, variable:'r2', displayTime:10000, displayText:"Resistance 2: Typical Price + (High Price - Low Price)"})
        annotatePath({svg:svg, variable:'s2', displayTime:10000, displayText:"Support 2: Typical Price - (High Price - Low Price)"})
        annotatePath({svg:svg, variable:'r1', displayTime:10000, displayText:"Resistance 1: (Typical Price X 2) - Low Price"})
        annotatePath({svg:svg, variable:'s1', displayTime:10000, displayText:"Support 1: (Typical Price X 2) - High Price"})

        // Annotate Signal
        annotateSignal({svg:svg, data:data, xScale:xScale, yScale:yScale, displayTime:3000})
    
    } else if (tutorial === "pp" && performance) {
        // Get trade signals
        crossoverSignal({svg:svg, data:data, xScale:xScale, yScale:yScale, variable1:'close', variable2:'s2', longSignal:true, crossAbove:false, delayTime:9000,
            displayText:'Long / Short when Close Price Crosses Support / Resistance', speed:200, delayTextTime:15000, displayTextTime:7000, allSignalData:allSignalData, performance:performance}) // long signal
        crossoverSignal({svg:svg, data:data, xScale:xScale, yScale:yScale, variable1:'close', variable2:'r2', longSignal:false, crossAbove:true, delayTime:9000,
            displayText:'Long / Short when Close Price Crosses Support / Resistance', speed:200, delayTextTime:15000, displayTextTime:7000, allSignalData:allSignalData, performance:performance}) // short signal

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
        data.at(0)['strat_gross_cum_log_ret'] = 0
        data.at(0)['strat_gross_profit'] = 0

        data.forEach(function(d, index) { 
            if (d['date'] === signal['date']) {
                d['position'] = signal['signal']
                prevPosition = d['position']
 
                signalIndex = Math.min(signalIndex + 1, allSignalData.length - 1)
                signal = allSignalData.at(signalIndex)
            } else {
                d['position'] = prevPosition
            }

            var prevDay = data[Math.max(index-1, 0)]
            d['stock_daily_dollar_return'] = d['close'] - prevDay['close']
            d['stock_daily_log_return'] = Math.log(d['close'] / prevDay['close'])

            d['strat_daily_dollar_return'] = d['stock_daily_dollar_return'] * prevDay['position']
            d['strat_gross_profit'] = prevDay['strat_gross_profit'] + d['strat_daily_dollar_return']

            d['strat_daily_log_return'] = d['stock_daily_log_return'] * prevDay['position']
            d['strat_gross_cum_log_ret'] = prevDay['strat_gross_cum_log_ret'] + d['strat_daily_log_return']
            d['strat_gross_cum_ret'] = Math.exp(d['strat_gross_cum_log_ret']) - 1
        })  


        // Plot Profit
        plotPath({svg:svg, data:data, xScale:xScale, yScale:yProfitScale, variable:'strat_gross_profit', variableLabel:'', 
            color:"#E2AB06", displayText:'', delayTime:0, speed:0, displayTextTime:0})

        // Plot trade signals, unfilled for losing trades
        plotWinningLosingTrades({svg:svg, data:data, xScale:xScale, yScale:yScale, allSignalData:allSignalData})

        // Tooltip showing strategy proft / returns
        var profitTooltipData = []
        data.forEach(function(d, index) { 
            profitTooltipData.push({
                'date': d['date'],
                'Profit ($)': d['strat_gross_profit'],
                'Return (%)': d['strat_gross_cum_ret']*100
            })
        })  
        tooltipIndicator({svg:svg, data:profitTooltipData, xScale:xScale, yScale:yScale})

        // Tooltip showing trade returns
        annotateTradePerformance({svg:svg, data:data, xScale:xScale, yScale:yScale, displayTime:3000})
    }
}

export default PpTutorial;