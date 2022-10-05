import { utcFormat, format, schemeSet1 } from 'd3';
import * as d3 from "d3";

const formatDate = utcFormat('%B %-d, %Y');
const formatValue = format('.2f');
const formatString = format('.3s');

const SMA = require('technicalindicators').SMA;

function CandlestickMarks({data, xScale, yScale, annotateOHLC}) {
    
    // Functions for Tutorial Chart
    function annotateOHLCFn() {
        // Annotate Open
        if(annotateOHLC['open']) {
            svg.selectAll()
                .data(data).enter()
                .append("circle")
                .attr("r", 3)
                .attr("cx", function(d) { return xScale(d.date); })
                .attr("cy", function(d) { return yScale(d.open); });
        }
        // Annotate High
        if(annotateOHLC['high']) {
            svg.selectAll()
                .data(data).enter()
                .append("circle")
                .attr("r", 3)
                .attr("cx", function(d) { return xScale(d.date); })
                .attr("cy", function(d) { return yScale(d.high); });
        }

        // Annotate Low
        if(annotateOHLC['low']) {
            svg.selectAll()
                .data(data).enter()
                .append("circle")
                .attr("r", 3)
                .attr("cx", function(d) { return xScale(d.date); })
                .attr("cy", function(d) { return yScale(d.low); });
        }

        // Annotate Close
        if(annotateOHLC['close']) {
            svg.selectAll()
                .data(data).enter()
                .append("circle")
                .attr("r", 3.5)
                .attr("cx", function(d) { return xScale(d.date); })
                .attr("cy", function(d) { return yScale(d.close); });
        }
    }
    function plotSmaFn(smaWindow, color) {
        var closePrices = data.map(d => d.close)
        var smaDates = data.map(d => d.date).slice(smaWindow-1)
        var smaValues = SMA.calculate({period: smaWindow, values: closePrices})
        var smaData = smaDates.map((x, i) => ({ date: x, sma: smaValues[i] }))

        svg.append("path")
            .datum(smaData)
            .attr("fill", "none")
            .attr("stroke", color)
            .attr("stroke-width", 1)
            .attr("d", d3.line()
            .x(function(d) { return xScale(d.date) })
            .y(function(d) { return yScale(d.sma) }))
        
        // label
        svg.append("text")
            .attr("transform", "translate(" + (xScale(smaData.at(-1).date) + 5) + "," + yScale(smaData.at(-1).sma) + ")")
            .style("fill", color)
            .text(`SMA - ${smaWindow} day`);
        
        return smaData
    }

    d3.select(".candlestick").remove()

    const svg = d3.select('.candlestickchart')
        .append("g")
        .attr("class", "candlestick")
    
    // low high line
    svg.selectAll()
        .data(data).enter()
        .append("line")
        .attr("stroke-width", 1)
        .attr("stroke", "black")
        .attr("x1", function(d) { return xScale(d.date); })
        .attr("x2", function(d) { return xScale(d.date); })
        .attr("y1", function(d) { return yScale(d.low); })
        .attr("y2", function(d) { return yScale(d.high); });

    // open close bar
    svg.selectAll()
        .data(data).enter()
        .append("line")
        .attr("stroke-width", xScale.bandwidth())
        .attr("stroke", function(d) {return d.open > d.close ? schemeSet1[0] 
                                        : d.close > d.open ? schemeSet1[2]
                                        : schemeSet1[8]})
        .attr("x1", function(d) { return xScale(d.date); })
        .attr("x2", function(d) { return xScale(d.date); })
        .attr("y1", function(d) { return yScale(d.open); })
        .attr("y2", function(d) { return yScale(d.close); });
    
    annotateOHLCFn()
    const sma_short = plotSmaFn(7, 'blue') // input SMA lookback window
    const sma_long = plotSmaFn(14, 'brown') // input SMA lookback window
}

export default CandlestickMarks;