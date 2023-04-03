import * as d3 from "d3";
import { annotateChart, plotPath, crossoverSignal, tooltip, annotatePath, annotateSignal, plotWinningLosingTrades, annotateTradePerformance, returnsAndExitTrade } from './animationFramework';
import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';

function EmaCrossover({data, xScale, yScale, yProfitScale, tutorial, paramData, performance, stopLoss, takeProfit}) {
    const [show, setShow] = useState(true);
    const handleClose = () => setShow(false);

    useEffect(() => {
        setShow(performance);
    }, [performance])

    //////////////////////////////////////////////
    ////////////// DATA PREPARATION //////////////
    //////////////////////////////////////////////
    var short = paramData['ema']['short']
    var long = paramData['ema']['long']

    // Calculate EMA values and format data into a list of dictionaries
    // [{date:, close:, smaShort, smaLong,}]
    var closeDates = data.map(d => d.date)
    var closePrices = data.map(d => d.close)
    var closeData = {}
    closeDates.map((x, i) => (closeData[x] = closePrices[i]))

    const EMA = require('technicalindicators').EMA;

    var emaShortDates = data.map(d => d.date).slice(short-1)
    var emaShortValues = EMA.calculate({period: short, values: closePrices}) //list of SMA values
    var emaShortData = {}
    emaShortDates.map((x, i) => (emaShortData[x] = emaShortValues[i]))

    var emaLongDates = data.map(d => d.date).slice(long-1)
    var emaLongValues = EMA.calculate({period: long, values: closePrices}) //list of SMA values
    var emaLongData = {}
    emaLongDates.map((x, i) => (emaLongData[x] = emaLongValues[i]))

    var emaData = []
    for (const [date, emaLong] of Object.entries(emaLongData)) {
        emaData.push({
            'date': parseInt(date),
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
        plotPath({svg:svg, data:emaData, xScale:xScale, yScale:yScale, variable:'emaShort', variableLabel:`${short} days`, 
            color:"darkblue", displayText:`Plot ${short} & ${long} day EMAs`, delayTime:10000, displayTextTime:10000})
        plotPath({svg:svg, data:emaData, xScale:xScale, yScale:yScale, variable:'emaLong', variableLabel:`${long} days`, 
            color:"brown", displayText:`Plot ${short} & ${long} day EMAs`, delayTime:10000, displayTextTime:10000})
        

        // EMA crossover
        crossoverSignal({svg:svg, data:emaData, xScale:xScale, yScale:yScale, variable1:'emaShort', variable2:'emaLong', delayTime:10000,
            displayText:'Long/Short when Short Term EMA Crosses Above/Below Long Term EMA', delayTextTime:22000, displayTextTime:20000, allSignalData:allSignalData, performance:performance}) // long signal
        crossoverSignal({svg:svg, data:emaData, xScale:xScale, yScale:yScale, variable1:'emaShort', variable2:'emaLong', longSignal:false, crossAbove:false, delayTime:10000,
            displayText:'Long/Short when Short Term EMA Crosses Above/Below Long Term EMA', delayTextTime:22000, displayTextTime:20000, allSignalData:allSignalData, performance:performance}) // short signal

        // Tooltip
        tooltip({svg:svg, data:emaData, xScale:xScale, yScale:yScale})

        // Annotate Path
        annotatePath({svg:svg, variable:'emaShort', displayTime:3000, displayText:`Exponential Moving Average of Close Prices the Last ${short} Days`})
        annotatePath({svg:svg, variable:'emaLong', displayTime:3000, displayText:`Exponential Moving Average of Close Prices the Last ${long} Days`})

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
            color:"#E2AB06", displayText:'Plot Trade Profits in Yellow', delayTime:0, speed:0, displayTextTime:10000})

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
        tooltip({svg:svg, data:profitTooltipData, xScale:xScale, yScale:yScale})

        // Tooltip showing trade returns
        annotateTradePerformance({svg:svg, data:emaData, xScale:xScale, yScale:yScale, displayTime:3000})

        // Pop-up showing trade summary
        var lastDay = emaData.slice(-1)[0]
        var strat_returns = (lastDay['strat_gross_cum_ret'] * 100).toFixed(2)
        var profit = lastDay['strat_gross_profit'].toFixed(2)
        var num_long_trades = allSignalData.filter(d => d.signal === 1).length
        var num_short_trades = allSignalData.filter(d => d.signal === -1).length
        var num_profit_trades = allSignalData.filter(d => d.profitable).length

        return (
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title style={{fontWeight: "bold"}}>Performance</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{fontSize: "18px"}}>
                    <span style={{fontWeight: "bold"}}>Number of Long Trades: </span>{num_long_trades}
                    <p style={{margin: "1px"}}></p>
                    <span style={{fontWeight: "bold"}}>Number of Short Trades: </span>{num_short_trades}
                    <hr class="solid"></hr>
                    <span style={{fontWeight: "bold"}}>Profit: </span>${profit}
                    <p style={{margin: "1px"}}></p>
                    <span style={{fontWeight: "bold"}}>Strategy Returns: </span>{strat_returns}%
                    <p style={{margin: "1px"}}></p>
                    <span style={{fontWeight: "bold"}}>Proportion of Profitable Trades: </span>{num_profit_trades}/{(num_long_trades+num_short_trades)}
                    <hr class="solid"></hr>
                    Consider adjusting <span style={{fontWeight: "bold"}}>trade parameters</span> or <span style={{fontWeight: "bold"}}>exit conditions</span> to improve the strategy's returns. 
                </Modal.Body>
            </Modal>
        )
    }
}

export default EmaCrossover;