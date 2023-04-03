import { utcFormat, format, schemePastel1, style } from 'd3';
import * as d3 from "d3";

const formatDate = utcFormat('%B %-d, %Y');
const formatValue = format('.2f');
const formatString = format('.3s');

function CandlestickTooltip({data, xScale, yScale}) {

    d3.select(".tooltip").remove()
    const svg = d3.select('.candlestickchart')

    var tooltip = svg.append("foreignObject")
                    .attr("class", "tooltip")
                    .attr("width", 150)
                    .attr("height", 300)
                    .style("opacity", 0)
                    .style("pointer-events", "none")
                    .append("xhtml:div")
                    .attr("class", "tooltipText")
                    .attr("height", "100%")
                    .style("pointer-events", "none")
                    .style("font-size", "12px")
                    .style("padding", "5px")
                    .style("background-color", schemePastel1[8])
                    .style("border", "solid")
                    .style("border-width", "0.5px")
                    .style("border-radius", "5px")

    
    const mouseover = function(event, d) {
        const ele = d3.select(this)
        const x_pos = ele.attr("x") !== null ? ele.attr("x") : ele.attr("x1") // account for if no open close bar
        const y_pos = ele.attr("y") !== null ? ele.attr("y") : ele.attr("y1")

        d3.select('.tooltip')
            .transition()
            .duration(0) // cancel any pending transition
            .style("opacity", 1)
            .attr("x", x_pos)
            .attr("y", (y_pos-100))
        
        // to account for when tooltip is at the corner of page
        var translateX = 0
        var translateY = 0
        if (x_pos > 1000) {
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

}

export default CandlestickTooltip;
