import { utcFormat, format, schemeSet1, style } from 'd3';
import * as d3 from "d3";

const formatDate = utcFormat('%B %-d, %Y');
const formatValue = format('.2f');
const formatString = format('.3s');

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
    
    // var tooltip = svg.append("text")
    //             // .attr("transform", "translate(0, 0)")
    //             .text("TESTING")
    //             .style("opacity", 0.1)

    var tooltip = svg.append("foreignObject")
                    .attr("class", "tooltip")
                    .attr("width", 125)
                    .attr("height", 110)
                    .style("opacity", 0)
                    .style("pointer-events", "none")
                    .append("xhtml:div")
                    .style("pointer-events", "none")
                    .style("font-size", "12px")
                    .style("padding", "5px")
                    .style("background-color", "white")
                    .style("border", "solid")
                    .style("border-width", "0.5px")
                    .style("border-radius", "5px")

    
    const mouseover = function(event, d) {
        const ele = d3.select(this)
        const x_pos = ele.attr("x") !== null ? ele.attr("x") : ele.attr("x1") // account for if no open close bar
        const y_pos = ele.attr("y") !== null ? ele.attr("y") : ele.attr("y1")
        console.log(y_pos)

        d3.select('.tooltip')
            .transition()
            .duration(0) // cancel any pending transition
            .style("opacity", 1)
            .attr("x", x_pos)
            .attr("y", (y_pos-100))
        
        // to account for when tooltip is at the corner of page
        var translateX = 0
        var translateY = 0
        if (x_pos > 1050) {
            translateX = 1140 - x_pos -125
        }
        if (y_pos < 80) {
            translateY = 80 - y_pos
        }
        d3.select('.tooltip').attr("transform", "translate(" + translateX + "," + translateY + ")")

        const text =                     
            `<b>${formatDate(d.date)}</b><br />` +
            `Open: $${formatValue(d.open)}<br />` +
            `Close: $${formatValue(d.close)}<br />` +
            `Low: $${formatValue(d.low)}<br />` +
            `High: $${formatValue(d.high)}<br />` 

        tooltip.html(text)
    }

    const mousemove = function(event) {
        const ele = d3.select(this)
        const x_pos = ele.attr("x") !== null ? ele.attr("x") : ele.attr("x1")
        const y_pos = ele.attr("y") !== null ? ele.attr("y") : ele.attr("y1")

        d3.select('.tooltip')
            .transition()
            .duration(0) // cancel any pending transition
            .style("opacity", 1)
            .attr("x", x_pos)
            .attr("y", (y_pos-100))
        
    }

    const mouseout = function(event) {
        d3.select('.tooltip')
            .transition()
            .delay(100)
            .style("opacity", 0)
    }

    d3.selectAll(".candlestickmark")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseout", mouseout);
    
    if (lightenCandlestick) {
        d3.selectAll(".candlestickmark")
            .style("opacity", "0.3")
    }

}

export default CandlestickMarks;

// function annotateOHLCFn() {
//     // Annotate Open
//     if(annotateOHLC['open']) {
//         svg.selectAll()
//             .data(data).enter()
//             .append("circle")
//             .attr("r", 3)
//             .attr("cx", function(d) { return xScale(d.date); })
//             .attr("cy", function(d) { return yScale(d.open); });
//     }
//     // Annotate High
//     if(annotateOHLC['high']) {
//         svg.selectAll()
//             .data(data).enter()
//             .append("circle")
//             .attr("r", 3)
//             .attr("cx", function(d) { return xScale(d.date); })
//             .attr("cy", function(d) { return yScale(d.high); });
//     }

//     // Annotate Low
//     if(annotateOHLC['low']) {
//         svg.selectAll()
//             .data(data).enter()
//             .append("circle")
//             .attr("r", 3)
//             .attr("cx", function(d) { return xScale(d.date); })
//             .attr("cy", function(d) { return yScale(d.low); });
//     }

//     // Annotate Close
//     if(annotateOHLC['close']) {
//         svg.selectAll()
//             .data(data).enter()
//             .append("circle")
//             .attr("r", 3.5)
//             .attr("cx", function(d) { return xScale(d.date); })
//             .attr("cy", function(d) { return yScale(d.close); });
//     }
// }