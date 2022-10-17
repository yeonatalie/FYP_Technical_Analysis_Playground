import * as d3 from 'd3';

import { AxisBottom } from './Axis/AxisBottom';
import { AxisLeft } from './Axis/AxisLeft';
import RsiChartTutorial from './Tutorials/RsiChartTutorial';
import MacdChartTutorial from './Tutorials/MacdChartTutorial';

const yAxisLabelOffset = 60;
const leftAxisTickFormat = d3.format('~f');
const bottomAxisTickFormat = d3.utcFormat('%-m/%-d');

export const Indicator = ({
    data,
    specs: { width, height, margin },
    indicatorChartLabel, indicatorRange,
    rsiTutorial, macdTutorial
}) => {
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleBand()
        .domain(d3.utcDay
            .range(data[0].date, +data[data.length - 1].date + 1)
            .filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6))
        .range([0, innerWidth])
        .padding(0.2);

    const yPriceScale = d3.scaleLinear()
        .domain(indicatorRange)
        .rangeRound([innerHeight, 0])
        .nice();

    const getOnlyMonday = d => d.getUTCDay() === 1;

    return (
        <g>
            <g className='indicatorchart' transform={`translate(${margin.left},${margin.top})`}>
                <AxisBottom
                    xScale={xScale}
                    xLength={innerWidth}
                    filterCondition={getOnlyMonday}
                    yOffset={innerHeight}
                    bandwidthOffset={xScale.bandwidth() / 2}
                    axisLine={true}
                    tickFormat={bottomAxisTickFormat}
                />
                <AxisLeft
                    yScale={yPriceScale}
                    yLength={innerHeight}
                    xOffset={-xScale.bandwidth() / 2}
                    tickFormat={leftAxisTickFormat}
                />
                <text
                    className='axis-label'
                    textAnchor='middle'
                    transform={`translate(${-yAxisLabelOffset},${innerHeight / 2}) rotate(-90)`}
                >
                    {indicatorChartLabel}
                </text>
                <RsiChartTutorial
                    class='rsiChart'
                    data={data}
                    xScale={xScale}
                    yScale={yPriceScale}
                    rsiTutorial={rsiTutorial}
                />
                <MacdChartTutorial
                    class='macdChart'
                    data={data}
                    xScale={xScale}
                    yScale={yPriceScale}
                    macdTutorial={macdTutorial}
                />
            </g>
        </g>
    )
}