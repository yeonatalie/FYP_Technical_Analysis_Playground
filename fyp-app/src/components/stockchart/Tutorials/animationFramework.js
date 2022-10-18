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
        .datum(data)
        .style("opacity", 0)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 1)
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
    const textLength = label.node().getComputedTextLength()    
    label.attr("transform", "translate(" + (xScale(data.at(-1).date) - textLength - 10) + "," + yScale(data.at(-1)[variable]) + ")")
        .style("fill", color)
        .style("font-weight", "bold")
        .transition()
        .delay(delayTime + (data.length * speed))
        .transition()
        .style("opacity", 1);
    
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

export const crossoverSignal = ({svg, data, xScale, yScale, variable1, variable2, longSignal=true, crossAbove=true, delayTime, displayText, speed=100, delayTextTime, displayTextTime}) => { 
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

            const signalAnnotation = svg.selectAll()
                .data(signalData).enter()
                .append("path")
                .attr("class", "point")
                .attr("d", d3.symbol().type(d3.symbolTriangle))
                .attr("transform", function (d) { return longSignal ?
                    "translate(" + xScale(d.date) + "," + yScale(d.yPoint) + ")" :
                    "translate(" + xScale(d.date) + "," + yScale(d.yPoint) + ") rotate(180)";})
                .attr("fill", longSignal ? schemeSet1[2] : schemeSet1[0]);

            signalAnnotation.style("opacity", 0);
            signalAnnotation.transition()
                .delay(delayTime + (count * speed))
                .transition()
                .style("opacity", 1);
        }
        prevPosition = position;
    });

    // text
    displayTextFn(svg, displayText, delayTextTime, displayTextTime)
}

export const tooltipIndicator = ({svg, data, xScale, yScale}) => {
    var tooltipIndicator = svg.append("foreignObject")
        .attr("class", "tooltipIndicator")
        .attr("width", 125)
        .attr("height", 200)
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

        const dataTooltip = fulldataTooltip[dateTooltipParsed]
        if (dataTooltip != null) { // data present
            var text = `<b>${formatDate(dateTooltip)}</b>`
            for (const [key, value] of Object.entries(dataTooltip)) {
                if (key !== 'date') {
                    text += `<br /> ${key}: ${formatValue(value)}`
                }
            }

            d3.select('.tooltip').style("opacity", 0) // Hide candlestick's tooltip. Only 1 tooltip shown at once

            d3.select('.tooltipIndicator')
                .style("opacity", 1)
                .attr("transform", "translate(" + (x_pos+10) + "," + (y_pos-80) + ")")
            d3.select('.tooltipIndicatorText').attr("height", 200)

            tooltipIndicator.html(text)

            // Line across the chart
            d3.selectAll('.tooltipIndicatorLine')
                .attr("stroke", "none")
            const tooltipIndicatorLine = svg.append('line').attr('class', 'tooltipIndicatorLine');

            tooltipIndicatorLine
                .attr('stroke', 'black')
                .attr('x1', xScale(dateTooltipParsed))
                .attr('x2', xScale(dateTooltipParsed))
                .attr('y1', 315)
                .attr('y2', 30);
        }
    }

    const mouseout = function(event) {
        d3.select('.tooltipIndicator')
            .style("opacity", 0)
        d3.selectAll('.tooltipIndicatorLine')
            .attr("stroke", "none")
    }

    d3.selectAll(".smacrossover")
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
    }