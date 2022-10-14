import { utcFormat, format, schemeSet1 } from 'd3';
import * as d3 from "d3";

const SMA = require('technicalindicators').SMA;

function SmaCrossover({data, xScale, yScale, smaCrossover}) {
    function annotateClosePrices(delayTime, displayTime) {
        const closePrices = svg.selectAll()
            .data(data).enter()
            .append("circle")
            .attr("r", 3.5)
            .attr("cx", function(d) { return xScale(d.date); })
            .attr("cy", function(d) { return yScale(d.close); })
            .style("opacity", 0);
        
        closePrices.transition()
            .delay(delayTime)
            .transition()
            .style("opacity", 1)
        
        closePrices.transition()
            .delay(displayTime)
            .transition()
            .style("opacity", 0);
        
        const text = svg.append("text")
            .text('Identify Close Prices')
            .attr("transform", "translate(20, 20)")
            .style("font-weight", "bold")
            .style("opacity", 0);
        
        text.transition()
            .delay(delayTime)
            .transition()
            .style("opacity", 1)
        
        text.transition()
            .delay(displayTime)
            .transition()
            .style("opacity", 0);
    }

    function plotSmaFn(smaWindow, color, delayTime, windowDifference) {
        var closePrices = data.map(d => d.close)
        var smaDates = data.map(d => d.date).slice(smaWindow-1)
        var smaValues = SMA.calculate({period: smaWindow, values: closePrices})
        var smaData = smaDates.map((x, i) => ({ date: x, sma: smaValues[i] }))
        var smaDataOutput = {}
        smaDates.forEach((date, idx) => smaDataOutput[date] = smaValues[idx])

        var smaPath = svg.append("path")
            .datum(smaData)
            .attr("fill", "none")
            .attr("stroke", color)
            .attr("stroke-width", 1)
            .attr("d", d3.line()
            .x(function(d) { return xScale(d.date) })
            .y(function(d) { return yScale(d.sma) }))
        try {
            const length = smaPath.node().getTotalLength()
            smaPath.attr("stroke-dasharray", length)
                .attr("stroke-dashoffset", length)
                .transition()
                .ease(d3.easeLinear)
                .attr("stroke-dashoffset", 0)
                .delay(delayTime + (windowDifference * 100))
                .duration(smaDates.length * 100)
        } catch {}
        
        // label
        svg.append("text")
            .attr("transform", "translate(" + (xScale(smaData.at(-1).date) + 5) + "," + yScale(smaData.at(-1).sma) + ")")
            .style("fill", color)
            .text(`SMA - ${smaWindow} day`)
            .style("font-weight", "bold")
            .style("opacity", 0)
            .transition()
            .delay(delayTime + (windowDifference * 100) + (smaDates.length * 100))
            .transition()
            .style("opacity", 1);

        return smaDataOutput
    }

    function annotateLongShortSignals(smaShort, smaLong, smaDelayTime, windowDifference) {
        var count = windowDifference
        var prevPosition = 0

        for (const [date, long] of Object.entries(smaLong)) {
            count += 1;
            var position = (smaShort[date] >= long) ? 1 : -1;
            var signal = ((position - prevPosition) === 2) ? 1 :
                ((position - prevPosition) === -2) ? -1 : 0;
            if (signal === -1) {
                var shortSignalData = [{
                    'date': Date.parse(date),
                    'sma': long,
                    'position': position,
                    'signal': signal
                }];

                const shortSignal = svg.selectAll()
                    .data(shortSignalData).enter()
                    .append("path")
                    .attr("class", "point")
                    .attr("d", d3.symbol().type(d3.symbolTriangle))
                    .attr("transform", function (d) { return "translate(" + xScale(d.date) + "," + yScale(d.sma) + ") rotate(180)"; })
                    .attr("fill", schemeSet1[0]);

                shortSignal.style("opacity", 0);
                shortSignal.transition()
                    .delay(smaDelayTime + (count * 100))
                    .transition()
                    .style("opacity", 1);

            } else if (signal === 1) {
                var longSignalData = [{
                    'date': Date.parse(date),
                    'sma': long,
                    'position': position,
                    'signal': signal
                }];

                const longSignal = svg.selectAll()
                    .data(longSignalData).enter()
                    .append("path")
                    .attr("class", "point")
                    .attr("d", d3.symbol().type(d3.symbolTriangle))
                    .attr("transform", function (d) { return "translate(" + xScale(d.date) + "," + yScale(d.sma) + ")"; })
                    .attr("fill", schemeSet1[2]);

                longSignal.style("opacity", 0);
                longSignal.transition()
                    .delay(smaDelayTime + (count * 100))
                    .transition()
                    .style("opacity", 1);
            }
            prevPosition = position;
        }
    }

    function smaCrossoverText(shortColor, longColor, delayTime) {
        const smaText = svg.append("svg:text");
        smaText.append("svg:tspan").text("Plot ");
        smaText.append("svg:tspan").style("fill", shortColor).text("Short Term SMA");
        smaText.append("svg:tspan").text(" & ");
        smaText.append("svg:tspan").style("fill", longColor).text("Long Term SMA");
        smaText
            .attr("transform", "translate(20, 20)")
            .style("font-weight", "bold")
            .style("opacity", 0);
        
        smaText.transition()
            .delay(delayTime)
            .transition()
            .style("opacity", 1)
        
        const longText = svg.append("svg:text");
        longText.append("svg:tspan").style("fill", schemeSet1[2]).text("Long");
        longText.append("svg:tspan").text(" when Short Term SMA");
        longText.append("svg:tspan").style("fill", schemeSet1[2]).text(" Crosses Above ");
        longText.append("svg:tspan").text("Long Term SMA");
        
        longText
            .attr("transform", "translate(20, 40)")
            .style("font-weight", "bold")
            .style("opacity", 0);
        
        longText.transition()
            .delay(delayTime+1500)
            .transition()
            .style("opacity", 1)
        
        const shortText = svg.append("svg:text");
        shortText.append("svg:tspan").style("fill", schemeSet1[0]).text("Short");
        shortText.append("svg:tspan").text(" when Short Term SMA");
        shortText.append("svg:tspan").style("fill", schemeSet1[0]).text(" Crosses Below ");
        shortText.append("svg:tspan").text("Long Term SMA");

        shortText
            .attr("transform", "translate(20, 60)")
            .style("font-weight", "bold")
            .style("opacity", 0);
        
        shortText.transition()
            .delay(delayTime+2500)
            .transition()
            .style("opacity", 1)
    }

    d3.select(".smacrossover").remove()

    const svg = d3.select('.candlestickchart')
        .append("g")
        .attr("class", "smacrossover")
    
    if (smaCrossover) {
        // Annotate Close Prices
        const closeDelayTime = 500
        const closeDisplayTime = 3000
        annotateClosePrices(closeDelayTime, closeDisplayTime)

        // Calculate SMA and Identify Crossovers
        const shortWindow  = 7
        const longWindow = 14
        const shortColor = 'darkblue'
        const longColor = 'brown'
        const windowDifference = longWindow - shortWindow
        const smaDelayTime = closeDelayTime + closeDisplayTime + 500
        smaCrossoverText(shortColor, longColor, smaDelayTime)
        const smaShort = plotSmaFn(shortWindow, shortColor, smaDelayTime, 0) 
        const smaLong = plotSmaFn(longWindow, longColor, smaDelayTime, windowDifference)
        annotateLongShortSignals(smaShort, smaLong, smaDelayTime, windowDifference);
    }
}

export default SmaCrossover;