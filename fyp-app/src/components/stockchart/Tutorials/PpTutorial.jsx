import * as d3 from "d3";
import { annotateChart, plotPath, crossoverSignal, tooltipIndicator, annotatePath, annotateSignal, plotWinningLosingTrades, annotateTradePerformance, returnsAndExitTrade } from './animationFramework';
import { schemePastel1 } from 'd3';
import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';

function PpTutorial({data, xScale, yScale, yProfitScale, tutorial, performance, stopLoss, takeProfit}) {
    const [show, setShow] = useState(true);
    const handleClose = () => setShow(false);

    useEffect(() => {
        setShow(performance);
    }, [performance])

    //////////////////////////////////////////////
    ////////////// DATA PREPARATION //////////////
    //////////////////////////////////////////////
    var prevHigh = data.at(0)['high']
    var prevLow = data.at(0)['low']
    var prevClose = data.at(0)['close']
    var prevTp = (prevHigh + prevLow + prevClose) / 3

    var pp_data_ref = data.slice(1)
    var pp_data = []
    pp_data_ref.forEach(function(d, index) {
        pp_data.push({
            'date': parseInt(d.date),
            'open': d.open,
            'high': d.high,
            'low': d.low,
            'close': d.close,
            'tp': (prevHigh + prevLow + prevClose) / 3,
            'r1': (prevTp * 2) - prevLow,
            'r2': prevTp + (prevHigh - prevLow),
            's1': (prevTp * 2) - prevHigh,
            's2': prevTp - (prevHigh - prevLow)
        })
        prevTp = (prevHigh + prevLow + prevClose) / 3
        prevHigh = d.high
        prevLow = d.low
        prevClose = d.close
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
        annotateChart({svg:svg, data:pp_data, xScale:xScale, yScale:yScale, variable:'close', 
            displayText:'Identify Close Prices', delayTime:500, displayTime:1500, displayTextTime:1000})
        // Annotate High Prices
        annotateChart({svg:svg, data:pp_data, xScale:xScale, yScale:yScale, variable:'high', 
            color:'green', displayText:'Identify High Prices', delayTime:2500, displayTime:1500, displayTextTime:1000})
        // Annotate Low Prices
        annotateChart({svg:svg, data:pp_data, xScale:xScale, yScale:yScale, variable:'low', 
            color:'red', displayText:'Identify Low Prices', delayTime:4500, displayTime:1500, displayTextTime:1000})

        // Annotate Typical Price
        annotateChart({svg:svg, data:pp_data, xScale:xScale, yScale:yScale, variable:'tp', 
        color:'blue', displayText:'Calculate Typical Price', delayTime:6500, displayTime:2000, displayTextTime:1500})

        // Plot  Support and Resistance 
        plotPath({svg:svg, data:pp_data, xScale:xScale, yScale:yScale, variable:'r1', variableLabel:'R1', 
            color:schemePastel1[0], displayText:'Plot Support and Resistance using Previous Day Data', speed:200, delayTime:9000, displayTextTime:3000})
        plotPath({svg:svg, data:pp_data, xScale:xScale, yScale:yScale, variable:'s1', variableLabel:'S1', 
            color:schemePastel1[2], displayText:'Plot Support and Resistance using Previous Day Data', speed:200, delayTime:9000, displayTextTime:3000})
        plotPath({svg:svg, data:pp_data, xScale:xScale, yScale:yScale, variable:'r2', variableLabel:'R2', 
            color:'red', displayText:'Plot Support and Resistance using Previous Day Data', speed:200, delayTime:9000, displayTextTime:3000})
        plotPath({svg:svg, data:pp_data, xScale:xScale, yScale:yScale, variable:'s2', variableLabel:'S2', 
            color:'green', displayText:'Plot Support and Resistance using Previous Day Data', speed:200, delayTime:9000, displayTextTime:3000})
        
        // Plot Close Price
        plotPath({svg:svg, data:pp_data, xScale:xScale, yScale:yScale, variable:'close', variableLabel:'Close', 
            color:'black', displayText:'Plot Support and Resistance using Previous Day Data', speed:200, delayTime:9000, displayTextTime:3000})
        
        // Annotate Buy Sell Points
        crossoverSignal({svg:svg, data:pp_data, xScale:xScale, yScale:yScale, variable1:'close', variable2:'s2', longSignal:true, crossAbove:false, delayTime:9000,
            displayText:'Long / Short when Close Price Crosses Support / Resistance', delayTextTime:15000, displayTextTime:7000, allSignalData:allSignalData, performance:performance, speed:240}) // long signal
        crossoverSignal({svg:svg, data:pp_data, xScale:xScale, yScale:yScale, variable1:'close', variable2:'r2', longSignal:false, crossAbove:true, delayTime:9000,
            displayText:'Long / Short when Close Price Crosses Support / Resistance',delayTextTime:15000, displayTextTime:7000, allSignalData:allSignalData, performance:performance, speed:240}) // short signal
        
        // Tooltip
        tooltipIndicator({svg:svg, data:pp_data, xScale:xScale, yScale:yScale})

        // Annotate Path
        annotatePath({svg:svg, variable:'r2', displayTime:10000, displayText:"Resistance 2: Typical Price + (High Price - Low Price)"})
        annotatePath({svg:svg, variable:'s2', displayTime:10000, displayText:"Support 2: Typical Price - (High Price - Low Price)"})
        annotatePath({svg:svg, variable:'r1', displayTime:10000, displayText:"Resistance 1: (Typical Price X 2) - Low Price"})
        annotatePath({svg:svg, variable:'s1', displayTime:10000, displayText:"Support 1: (Typical Price X 2) - High Price"})

        // Annotate Signal
        annotateSignal({svg:svg, data:pp_data, xScale:xScale, yScale:yScale, displayTime:3000})
    
    } else if (tutorial === "pp" && performance) {
        // Get trade signals
        crossoverSignal({svg:svg, data:pp_data, xScale:xScale, yScale:yScale, variable1:'close', variable2:'s2', longSignal:true, crossAbove:false, delayTime:9000,
            displayText:'Long / Short when Close Price Crosses Support / Resistance', delayTextTime:15000, displayTextTime:7000, allSignalData:allSignalData, performance:performance}) // long signal
        crossoverSignal({svg:svg, data:pp_data, xScale:xScale, yScale:yScale, variable1:'close', variable2:'r2', longSignal:false, crossAbove:true, delayTime:9000,
            displayText:'Long / Short when Close Price Crosses Support / Resistance', delayTextTime:15000, displayTextTime:7000, allSignalData:allSignalData, performance:performance}) // short signal

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
        var allSignalAndExitData = returnsAndExitTrade({svg:svg, xScale:xScale, yScale:yScale, data:pp_data, allSignalData:allSignalData, stopLoss:stopLoss, takeProfit:takeProfit})

        // Plot Profit
        plotPath({svg:svg, data:pp_data, xScale:xScale, yScale:yProfitScale, variable:'strat_gross_profit', variableLabel:'', 
            color:"#E2AB06", displayText:'Plot Trade Profits in Yellow', delayTime:0, speed:0, displayTextTime:10000})

        // Plot trade signals, unfilled for losing trades
        plotWinningLosingTrades({svg:svg, data:pp_data, xScale:xScale, yScale:yScale, allSignalAndExitData:allSignalAndExitData})

        // Tooltip showing strategy proft / returns
        var profitTooltipData = []
        data.forEach(function(d, index) { 
            profitTooltipData.push({
                'date': d['date'],
                'Profit ($)': d['strat_gross_profit'],
                'Return (%)': d['strat_gross_cum_ret']*100,
                'Trade Return (%)': d['trade_gross_cum_ret']*100
            })
        })  
        tooltipIndicator({svg:svg, data:profitTooltipData, xScale:xScale, yScale:yScale})

        // Tooltip showing trade returns
        annotateTradePerformance({svg:svg, data:pp_data, xScale:xScale, yScale:yScale, displayTime:3000})

        // Pop-up showing trade summary
        var lastDay = pp_data.slice(-1)[0]
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

export default PpTutorial;