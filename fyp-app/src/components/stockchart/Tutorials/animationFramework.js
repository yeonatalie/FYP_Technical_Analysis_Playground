import $ from 'jquery'; 
import * as d3 from "d3";
import { schemeSet1 } from 'd3';

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

export const annotateChart = ({svg, data, xScale, yScale, variable, displayText, delayTime, displayTime=null, displayTextTime}) => {
    const points = svg.selectAll()
        .data(data).enter()
        .append("circle")
        .attr("r", 3.5)
        .attr("cx", function(d) { return xScale(d.date); })
        .attr("cy", function(d) { return yScale(d[variable]); })
        .style("opacity", 0);
    
    points.transition()
        .delay(delayTime)
        .transition()
        .style("opacity", 1)
        
    if (displayTime !== null) {
        points.transition()
            .delay(displayTime)
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
            .attr("stroke-width", 3)
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

export const plotPath = ({svg, data, xScale, yScale, variable, variableLabel, color, animate=true, dashed=false, displayText, delayTime, displayTextTime}) => {
    var path = svg.append("path")
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
                .duration(data.length * 100) 
        })
    } else {
        path.transition()
            .delay(delayTime)
            .style("opacity", 1)
    }

    // label plot
    svg.append("text")
        .attr("transform", "translate(" + (xScale(data.at(-1).date) + 5) + "," + yScale(data.at(-1)[variable]) + ")")
        .style("fill", color)
        .text(variableLabel)
        .style("font-weight", "bold")
        .style("opacity", 0)
        .transition()
        .delay(delayTime + (data.length * 100))
        .transition()
        .style("opacity", 1);
    
    // text
    displayTextFn(svg, displayText, delayTime, displayTextTime)
}

export const crossoverSignal = ({svg, data, xScale, yScale, variable1, variable2, longSignal=true, crossAbove=true, delayTime, displayText, delayTextTime, displayTextTime}) => { 
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
                .delay(delayTime + (count * 100))
                .transition()
                .style("opacity", 1);
        }
        prevPosition = position;
    });

    // text
    displayTextFn(svg, displayText, delayTextTime, displayTextTime)
}