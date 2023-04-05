import { schemeSet1 } from 'd3';
import * as d3 from "d3";


function CandlestickMarks({data, xScale, yScale, lightenCandlestick}) {
    // Functions for Tutorial Chart
        
    d3.select(".candlestick").remove()

    const svg = d3.select('.candlestickchart')
        .append("g")
        .attr("class", "candlestick")
    
    // low high line
    svg.selectAll()
        .data(data).enter()
        .append("line")
        .attr("class", "candlestickmark")
        .attr("stroke-width", 1)
        .attr("stroke", "black")
        .attr("x1", function(d) { return xScale(d.date); })
        .attr("x2", function(d) { return xScale(d.date); })
        .attr("y1", function(d) { return yScale(d.low); })
        .attr("y2", function(d) { return yScale(d.high); })

    // open close bar
   svg.selectAll()
        .data(data).enter()
        .append("rect")
        .attr("class", "candlestickmark")
        .attr("width", xScale.bandwidth())
        .attr("fill", function(d) {return d.open > d.close ? schemeSet1[0] 
                                        : d.close > d.open ? schemeSet1[2]
                                        : schemeSet1[8]})
        .attr("x", function(d) { return xScale(d.date) - (xScale.bandwidth()/2); })
        .attr("y", function(d) { return yScale(Math.max(d.open, d.close)); })
        .attr("height", function(d) { return Math.abs(yScale(d.close) - yScale(d.open)); })
    
    if (lightenCandlestick) {
        d3.selectAll(".candlestickmark")
            .style("opacity", "0.3")
    }

}

export default CandlestickMarks;