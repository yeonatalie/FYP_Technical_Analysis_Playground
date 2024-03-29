import * as d3 from "d3";
import { annotateChart, plotPath, crossoverSignal, tooltip, annotatePath, annotateSignal, plotWinningLosingTrades, annotateTradePerformance, returnsAndExitTrade } from './animationFramework';
import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';

const BBand = require('technicalindicators').BollingerBands;

function BbandTutorial({data, xScale, yScale, yProfitScale, tutorial, paramData, performance, stopLoss, takeProfit}) {
    const [show, setShow] = useState(true);
    const handleClose = () => setShow(false);

    useEffect(() => {
        setShow(performance);
    }, [performance])

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
            'date': parseInt(date),
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
        crossoverSignal({svg:svg, data:bbandTutData, xScale:xScale, yScale:yScale, variable1:'close', variable2:'lower', longSignal:true, crossAbove:false, delayTime:14000,
            displayText:'Long/Short when Prices Crosses Below/Above Lower/Upper Bollinger Band', delayTextTime:16000, displayTextTime:7000, allSignalData:allSignalData, performance:performance}) 
        // short signal when cross above upper
        crossoverSignal({svg:svg, data:bbandTutData, xScale:xScale, yScale:yScale, variable1:'close', variable2:'upper', longSignal:false, crossAbove:true, delayTime:14000,
            displayText:'Long/Short when Prices Crosses Below/Above Lower/Upper Bollinger Band', delayTextTime:16000, displayTextTime:7000, allSignalData:allSignalData, performance:performance}) 

        // Tooltip
        tooltip({svg:svg, data:bbandTutData, xScale:xScale, yScale:yScale})

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
            color:"#E2AB06", displayText:'Plot Trade Profits in Yellow', delayTime:0, speed:0, displayTextTime:10000})

        // Plot trade signals, unfilled for losing trades
        plotWinningLosingTrades({svg:svg, data:bbandTutData, xScale:xScale, yScale:yScale, allSignalAndExitData:allSignalAndExitData})

        // Tooltip showing strategy proft / returns
        var profitTooltipData = []
        bbandTutData.forEach(function(d, index) { 
            profitTooltipData.push({
                'date': d['date'],
                'Profit ($)': d['strat_gross_profit'],
                'Return (%)': d['strat_gross_cum_ret']*100,
                'Trade Return (%)': d['trade_gross_cum_ret']*100
            })
        })  
        tooltip({svg:svg, data:profitTooltipData, xScale:xScale, yScale:yScale})

        // Tooltip showing trade returns
        annotateTradePerformance({svg:svg, data:bbandTutData, xScale:xScale, yScale:yScale, displayTime:3000})

        // Pop-up showing trade summary
        var lastDay = bbandTutData.slice(-1)[0]
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

export default BbandTutorial;