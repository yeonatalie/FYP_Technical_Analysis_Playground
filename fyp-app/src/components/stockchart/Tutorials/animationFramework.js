import $ from 'jquery'; 
import * as d3 from "d3";
import { utcFormat, format, schemeSet1, schemePastel1} from 'd3';

const formatDate = utcFormat('%B %-d, %Y');
const formatValue = format('.2f');

// data is a list of dictionaries

function displayTextFn(svg, displayText, delayTime, displayTime) {
    const text = svg.append("text")
        .text(displayText)
        .attr("transform", "translate(20, 20)")
        .style("font-weight", "bold")
        .style("opacity", 0);
    
    text.transition()
        .delay(delayTime)
        .transition()
        .style("opacity", 1)
        .transition()
        .delay(displayTime)
        .transition()
        .style("opacity", 0);
}

export const annotateChart = ({svg, data, xScale, yScale, variable, color="black", displayText, delayTime, displayTime=null, displayTextTime}) => {
    const points = svg.selectAll()
        .data(data).enter()
        .append("circle")
        .attr("r", 2.5)
        .attr("cx", function(d) { return xScale(d.date); })
        .attr("cy", function(d) { return yScale(d[variable]); })
        .attr("fill", color)
        .style("opacity", 0);
    
    points.transition()
        .delay(delayTime)
        .transition()
        .style("opacity", 1)
        
    if (displayTime !== null) {
        points.transition()
            .delay(delayTime + displayTime)
            .transition()
            .style("opacity", 0); 
    }

    displayTextFn(svg, displayText, delayTime, displayTextTime)
}

export const annotateUpDown = ({svg, data, xScale, yScale, variable, displayText, delayTime, delayTextTime, displayTextTime}) => {
    var count = 0
    var prev_d = data.at(0)
    data.slice(1).forEach(function(d, index) {
        count+=1
        var color = (d[variable] > prev_d[variable]) ? schemeSet1[2] : (d[variable] < prev_d[variable]) ? schemeSet1[0] : schemeSet1[8]
        var plot_data = [prev_d, d]
        var up_down = svg.append("path")
            .datum(plot_data)
            .attr("fill", "none")
            .attr("stroke", color)
            .attr("stroke-width", 2)
            .attr("d", d3.line()
            .x(function(d) { return xScale(d.date) })
            .y(function(d) { return yScale(d[variable]) }))
        
        up_down.style("opacity", 0);
        up_down.transition()
            .delay(delayTime + (count * 50))
            .transition()
            .style("opacity", 1);
            
        prev_d = d
    })

    displayTextFn(svg, displayText, delayTextTime, displayTextTime)
}

export const plotPath = ({svg, data, xScale, yScale, variable, variableLabel, color, animate=true, dashed=false, displayText, speed=100, delayTime, displayTextTime}) => {
    var path = svg.append("path")
        .attr("class", "path")
        .attr("id", variable+"-path")
        .datum(data)
        .style("opacity", 0)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
        .x(function(d) { return xScale(d.date) })
        .y(function(d) { return yScale(d[variable]) }))

    if (dashed) {
        path.style("stroke-dasharray", ("10,3"))
    }

    if (animate) {
        $.get(path).done(function () {
            const length = path.node().getTotalLength()
            path.attr("stroke-dasharray", length)
                .attr("stroke-dashoffset", length)
                .transition()
                .delay(delayTime)
                .style("opacity", 1)
                .transition()
                .ease(d3.easeLinear)
                .attr("stroke-dashoffset", 0)
                .duration(data.length * speed) 
        })
    } else {
        path.transition()
            .delay(delayTime)
            .style("opacity", 1)
    }

    // label plot
    const label = svg.append("text").text(variableLabel).style("opacity", 0)
    $.get(label).done(function () {
        const textLength = label.node().getComputedTextLength()    
        label.attr("transform", "translate(" + (xScale(data.at(-1).date) - textLength - 10) + "," + yScale(data.at(-1)[variable]) + ")")
            .attr("class", "pathlabel")
            .attr("id", variable+"-pathlabel")
            .style("fill", color)
            .style("font-weight", "bold")
            .transition()
            .delay(delayTime + (data.length * speed))
            .transition()
            .style("opacity", 1);
    })
    
    // text
    displayTextFn(svg, displayText, delayTime, displayTextTime)
}

export const plotBar = ({svg, data, xScale, yScale, variable, speed=100, delayTime}) => {
    var count = 0
    data.forEach(function(d, index) {
        count+=1
        var color = (d[variable]>0) ? schemeSet1[2] : (d[variable]<0) ? schemeSet1[0] : schemeSet1[8]
        var bar = svg.append("rect")
            .attr("x", xScale(d.date))
            .attr("y", yScale(d[variable]))
            .attr("width", xScale.bandwidth())
            .attr("height", Math.abs(yScale(d[variable]) - yScale(0)))
            .attr("fill", color)
        
        bar.style("opacity", 0);
        bar.transition()
            .delay(delayTime + (count * speed))
            .transition()
            .style("opacity", 0.3);
    })
}

export function crossoverSignal({svg, data, xScale, yScale, variable1, variable2, longSignal=true, crossAbove=true, delayTime, displayText, speed=100, delayTextTime, displayTextTime, allSignalData, performance}) { 
    // calculate and plot crossover
    var count = 0
    var prevPosition = 1
    
    data.forEach(function(d, index) {
        count += 1;
        var position;
        if (crossAbove) { // variable1 cross above variable2
            position = (d[variable1] >= d[variable2]) ? 1 : 0;
        } else {
            position = (d[variable1] <= d[variable2]) ? 1 : 0;
        }
        var signal = ((position - prevPosition) === 1) ? 1 : 0;

        if (signal === 1) {
            var signalData = [{
                'date': d.date,
                'yPoint': d[variable1],
                'position': position,
                'signal': signal
            }];

            allSignalData.push({
                'date': d.date,
                'dateFormatted': formatDate(d.date),
                'signal': longSignal ? 1 : -1,
                'close': d['close'],
                'yPoint': d[variable1],
            })

            const signalAnnotation = svg.selectAll()
                .data(signalData).enter()
                .append("path")
                .attr("class", "signal")
                .attr("id", "long_signal_"+longSignal)
                .attr("d", d3.symbol().type(d3.symbolTriangle))
                .attr("transform", function (d) { return longSignal ?
                    "translate(" + xScale(d.date) + "," + yScale(d.yPoint) + ")" :
                    "translate(" + xScale(d.date) + "," + yScale(d.yPoint) + ") rotate(180)";})
                .attr("fill", longSignal ? schemeSet1[2] : schemeSet1[0]);

            signalAnnotation.style("opacity", 0);

            if (!performance) {
                signalAnnotation.transition()
                    .delay(delayTime + (count * speed))
                    .transition()
                    .style("opacity", 1);
            } else {
                signalAnnotation.style("opacity", 1);
            }
        }
        prevPosition = position;
    });

    // text
    if (!performance) {
        displayTextFn(svg, displayText, delayTextTime, displayTextTime)
    }
    
    return allSignalData
}

export const tooltipIndicator = ({svg, data, xScale, yScale, indicatorChart=false}) => {
    if (!indicatorChart) {
        d3.selectAll('.tooltip').remove() // Hide candlestick's tooltip. Only 1 tooltip shown at once
    }

    var tooltipIndicatorLine = svg.append('line').attr('class', 'tooltipIndicatorLine').attr("stroke", "none")

    var tooltipIndicator = svg.append("foreignObject")
        .attr("class", "tooltipIndicator")
        .attr("width", 160)
        .attr("height", 300)
        .style("opacity", 0)
        .style("pointer-events", "none")
        .append("xhtml:div")
        .attr("class", "tooltipIndicatorText")
        .attr("height", "100%")
        .style("pointer-events", "none")
        .style("font-size", "12px")
        .style("padding", "5px")
        .style("background-color", schemePastel1[8])
        .style("border", "solid")
        .style("border-width", "0.5px")
        .style("border-radius", "5px")

    const mouseover = function(event) {
        var coords = d3.pointer(event);
        const x_pos = coords[0]
        const y_pos = coords[1]

        // map x position to date
        var eachBand = xScale.step();
        var indexTooltip = Math.round((x_pos / eachBand));
        var dateTooltip = xScale.domain()[indexTooltip];
        var dateTooltipParsed = Date.parse(dateTooltip);

        var fulldataTooltip = {}
        data.map((dict, i) => (fulldataTooltip[dict.date] = dict))

        var dataTooltip = fulldataTooltip[dateTooltipParsed]
        if (dataTooltip == null) {
            dataTooltip = fulldataTooltip[dateTooltip]
        }
        if (dataTooltip != null) { // data present
            // Line across the chart
            d3.selectAll('.tooltipIndicatorLine')
                .attr("stroke", "none")

            tooltipIndicatorLine
                .attr('stroke', 'black')
                .attr('x1', xScale(dateTooltipParsed))
                .attr('x2', xScale(dateTooltipParsed))
                .attr('y1', indicatorChart ? 140: 353)
                .attr('y2', 30);

            // Tooltip
            var text = `<u><b>${formatDate(dateTooltip)}</b></u>`

            for (const [key, value] of Object.entries(dataTooltip)) {
                if (key !== 'date') {
                    text += `<br /><b>${key}:</b> ${formatValue(value)}`
                }
            }

            // to account for when tooltip is at the corner of page
            var translateX = x_pos+10
            var translateY = y_pos-80
            if (x_pos > 950) {
                translateX += 950 - x_pos 
            }
            if (y_pos < 80) {
                translateY += 80 - y_pos
            }

            d3.select('.tooltipIndicator')
                .transition()
                .duration(0) // cancel any pending transition
                .style("opacity", 1)
                .attr("transform", "translate(" + translateX + "," + translateY + ")")

            tooltipIndicator.html(text)
        }
    }

    const mouseout = function(event) {
        d3.selectAll('.tooltipIndicatorLine')
            .attr("stroke", "none")
        d3.select('.tooltipIndicator')
            .transition()
            .delay(100)
            .style("opacity", 0)
    }

    svg
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
}

export const annotatePath = ({svg, variable, displayTime, displayText}) => {
    const pathClicked = d3.select(`#${variable}-path`)
    pathClicked.on('click',function(){ 
        svg.selectAll('.path') // make other paths translucent
            .style("opacity", 0.3)
            .transition()
            .delay(displayTime)
            .transition()
            .style("opacity", 1)
        svg.selectAll('.pathlabel') 
            .style("opacity", 0.3)
            .transition()
            .delay(displayTime)
            .transition()
            .style("opacity", 1)

        pathClicked // bold path
            .style("opacity", 1)
            .attr("stroke-width", 3)
            .transition()
            .delay(displayTime)
            .transition()
            .attr("stroke-width", 1)
        d3.select(`#${variable}-pathlabel`)
            .style("opacity", 1)

        displayTextFn(svg, displayText, 0, displayTime)
    })
}

export const annotateSignal = ({svg, data, xScale, yScale, displayTime}) => {
    var tooltipSignal = svg.append("foreignObject")
            .attr("class", "tooltipSignal")
            .attr("width", 170)
            .attr("height", 68)
            .style("opacity", 0)
            .style("pointer-events", "none")
            .style("background-color", "#F9F9F9")
            .append("xhtml:div")
            .attr("class", "tooltipSignalText")
            .attr("height", "100%")
            .style("pointer-events", "none")
            .style("font-size", "12px")
            .style("padding", "5px")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
        

    const signalClicked = d3.selectAll('.signal')
    signalClicked.on('click',function(event, d){
        const signalDate = new Date(d.date)
        // long or short
        const id = d3.select(this).attr("id")
        var signalText = ""
        if (id === "long_signal_true") {
            signalText = "Long"
            tooltipSignal.style("border-color", "green")
        } else {
            signalText = "Short"
            tooltipSignal.style("border-color", "darkred")
        }

        // find close price
        var dataDict = {}
        data.map((dict, i) => (dataDict[dict.date] = dict))
        var signalClose = null

        try {
            signalClose  = dataDict[d.date].close
        } catch {
            signalClose = dataDict[signalDate].close
        }

        // tooltip position
        var x_pos = xScale(d.date) + 10
        var y_pos = yScale(d.yPoint) - 50
        // to account for when tooltip is at the corner of page
        if (x_pos > 1000) {
            x_pos -= x_pos - 1000
        }

        // tooltip text
        var text = `<u><b>${signalText}</b></u></br>`
        text += `<b>Date: </b>${formatDate(signalDate)}</br>`
        text += `<b>Close Price: </b>$${formatValue(signalClose)}`

        // display tooltip
        d3.select('.tooltipSignal')
            .attr("x", x_pos)
            .attr("y", y_pos)
            .transition()
            .duration(0) // cancel any pending transition
            .style("opacity", 1)
            .transition()
            .delay(displayTime)
            .style("opacity", 0)
        
        tooltipSignal.html(text)
    })
}

///////////////////////
// Trade Performance //
///////////////////////

export const plotWinningLosingTrades = ({svg, data, xScale, yScale, allSignalAndExitData}) => {
    // calculate trade returns
    allSignalAndExitData.forEach(function(d, index) {
        if (index + 1 < allSignalAndExitData.length) {
            var nextData = allSignalAndExitData.at(index + 1);
        } else {
            nextData = {
                'date': data.at(-1).date,
                'dateFormatted': formatDate(data.at(-1).date),
                'signal': 0,
                'close': data.at(-1)['close'],
                'yPoint': data.at(-1)['smaShort']
            }
        }
        allSignalAndExitData.at(index)['dollar_return'] = d['signal'] * (nextData['close'] - d['close'])
        allSignalAndExitData.at(index)['profitable'] = allSignalAndExitData.at(index)['dollar_return'] > 0
        allSignalAndExitData.at(index)['percentage_return'] = allSignalAndExitData.at(index)['dollar_return'] / d['close'] * 100
    })

    // Plot winning / losing trades using close prices
    allSignalAndExitData.forEach(function(d, index) {    
        svg.selectAll()
            .data([d,]).enter()
            .append("path")
            .attr("d", (d.signal === 1 || d.signal === -1) ? d3.symbol().type(d3.symbolTriangle) : null)
            .attr("class", "performanceSignal")
            .attr("transform", function (d) { return d['signal'] === 1 ?
                "translate(" + xScale(d.date) + "," + yScale(d.close) + ")" :
                "translate(" + xScale(d.date) + "," + yScale(d.close) + ") rotate(180)";})
            .attr("stroke", d['signal'] === 1 ? schemeSet1[2] : schemeSet1[0])
            .style("stroke-width", "1.5px")
            .attr("fill", d['profitable'] ? (d['signal'] === 1 ? schemeSet1[2] : schemeSet1[0]) : "none") // filled if trade was profitable
    })
}

export const annotateTradePerformance = ({svg, xScale, yScale, displayTime}) => {
    var tooltipTradePerformance = svg.append("foreignObject")
        .attr("class", "tooltipTradePerformance")
        .attr("width", 185)
        .attr("height", 88)
        .style("opacity", 0)
        .style("pointer-events", "none")
        .style("background-color", "#F9F9F9")
        .append("xhtml:div")
        .attr("class", "tooltipSignalText")
        .attr("height", "100%")
        .style("pointer-events", "none")
        .style("font-size", "12px")
        .style("padding", "5px")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
    
    const tradeClicked = d3.selectAll('.performanceSignal')
    tradeClicked.on('click',function(event, d){
        // tooltip position
        var x_pos = xScale(d.date) + 10
        var y_pos = yScale(d.close) - 50
        // to account for when tooltip is at the corner of page
        if (x_pos > 950) {
            x_pos -= x_pos - 950
        }

        // tooltip text
        var tradeType = d['signal'] === 1 ? "Long" : "Short"
        var tradeProfitable
        if (d['profitable']) {
            tradeProfitable = `<span style="color: green">[GAIN]</span>`
        } else {
            tradeProfitable = `<span style="color: red">[LOSS]</span>`
        }
        
        var text = `<u><b>${tradeType} Trade ${tradeProfitable}</b></u></br>`
        text += `<b>Date: </b>${d.dateFormatted}</br>`
        text += `<b>Dollar Return: </b>${formatValue(d.dollar_return)}</br>`
        text += `<b>Percentage Return: </b>${formatValue(d.percentage_return)}%`

        // display tooltip
        d3.select('.tooltipTradePerformance')
            .attr("x", x_pos)
            .attr("y", y_pos)
            .transition()
            .duration(0) // cancel any pending transition
            .style("opacity", 1)
            .transition()
            .delay(displayTime)
            .style("opacity", 0)
        
        tooltipTradePerformance.html(text)
    })
}

export const returnsAndExitTrade = ({svg, xScale, yScale, data, allSignalData, stopLoss, takeProfit}) => {
    var allExitData = []

    // Calculate trade returns
    var signalIndex = 0
    var signal = allSignalData.at(signalIndex)
    var prevPosition = 0
    data.at(0)['strat_gross_cum_log_ret'] = 0
    data.at(0)['strat_gross_profit'] = 0

    data.forEach(function(d, index) { 
        var prevDay = data[Math.max(index-1, 0)]

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

    svg.selectAll()
        .data(allExitData).enter()
        .append("path")
        .attr("d", d3.symbol().type(d3.symbolCross).size(120))
        .attr("transform", function (d) { return "translate(" + xScale(d.date) + "," + yScale(d.close) + ") rotate(45)";
        })
        .attr("fill", "black");
    
    return allSignalAndExitData
}
