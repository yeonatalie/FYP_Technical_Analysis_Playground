import * as d3 from 'd3';

import { AxisBottom } from './Axis/AxisBottom';
import { AxisLeft } from './Axis/AxisLeft';
import { AxisRight } from './Axis/AxisRight';
import CandlestickMarks from './Marks/CandlestickMarks.jsx';
import SmaCrossover from './Tutorials/SmaCrossoverTutorial';
import EmaCrossover from './Tutorials/EmaCrossoverTutorial';
import RsiTutorial from './Tutorials/RsiTutorial';
import MacdTutorial from './Tutorials/MacdTutorial';
import BbandTutorial from './Tutorials/BollingerBandTutorial';
import PpTutorial from './Tutorials/PpTutorial'
import CustomTutorial from './Tutorials/CustomTutorial';
import CandlestickTooltip from './Marks/CandlestickTooltip';

const yAxisLabelOffset = 60;
const leftAxisTickFormat = d3.format('$~f');
const bottomAxisTickFormat = d3.utcFormat('%-m/%-d');

export const Main = ({
    data,
    specs: { width, height, margin },
    lightenCandlestick,
    tutorial,
    paramData,
    performance,
    stopLoss,
    takeProfit,
    customData
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
        .domain([d3.min(data, d => d.low), d3.max(data, d => d.high)])
        .rangeRound([innerHeight, 0])
        .nice();

    const yProfitScale = d3.scaleLinear()
        .domain([-60, 60]) // TO CHANGE
        .rangeRound([innerHeight, 0])
        .nice();

    const getOnlyMonday = d => d.getUTCDay() === 1;

    return (
        <>
            <g className='candlestickchart' style={{pointerEvents:"all"}} transform={`translate(${margin.left},${margin.top})`}>
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
                <AxisRight
                    yScale={performance ? yProfitScale : yPriceScale}
                    yLength={innerHeight}
                    xOffset={innerWidth + xScale.bandwidth() / 2}
                    tickFormat={leftAxisTickFormat}
                />
                <text
                    className='axis-label'
                    textAnchor='middle'
                    transform={`translate(${-yAxisLabelOffset},${innerHeight / 2}) rotate(-90)`}
                >
                    Price
                </text>
                <text
                    className='axis-label'
                    textAnchor='middle'
                    transform={`translate(${innerWidth + yAxisLabelOffset + 10},${innerHeight / 2}) rotate(-90)`}
                >
                    {performance ? 'Profit' : 'Price'}
                </text>
                <CandlestickMarks
                    class='candlestick'
                    data={data}
                    xScale={xScale}
                    yScale={yPriceScale}
                    lightenCandlestick={lightenCandlestick} // to lighten the candlestick when there is a tutorial
                />
                <SmaCrossover
                    class='smacrossover'
                    data={data}
                    xScale={xScale}
                    yScale={yPriceScale}
                    yProfitScale={yProfitScale}
                    tutorial={tutorial}
                    paramData={paramData}
                    performance={performance}
                    stopLoss={stopLoss}
                    takeProfit={takeProfit}
                />
                <EmaCrossover
                    class='emacrossover'
                    data={data}
                    xScale={xScale}
                    yScale={yPriceScale}
                    yProfitScale={yProfitScale}
                    tutorial={tutorial}
                    paramData={paramData}
                    performance={performance}
                    stopLoss={stopLoss}
                    takeProfit={takeProfit}
                />
                <RsiTutorial
                    class='rsi'
                    data={data}
                    xScale={xScale}
                    yScale={yPriceScale}
                    yProfitScale={yProfitScale}
                    tutorial={tutorial}
                    performance={performance}
                    stopLoss={stopLoss}
                    takeProfit={takeProfit}
                />
                <MacdTutorial
                    class='macd'
                    data={data}
                    xScale={xScale}
                    yScale={yPriceScale}
                    yProfitScale={yProfitScale}
                    tutorial={tutorial}
                    performance={performance}
                    stopLoss={stopLoss}
                    takeProfit={takeProfit}
                />
                <BbandTutorial
                    class='bband'
                    data={data}
                    xScale={xScale}
                    yScale={yPriceScale}
                    yProfitScale={yProfitScale}
                    tutorial={tutorial}
                    performance={performance}
                    stopLoss={stopLoss}
                    takeProfit={takeProfit}
                />
                <PpTutorial
                    class='pp'
                    data={data}
                    xScale={xScale}
                    yScale={yPriceScale}
                    yProfitScale={yProfitScale}
                    tutorial={tutorial}
                    performance={performance}
                    stopLoss={stopLoss}
                    takeProfit={takeProfit}
                />
                <CustomTutorial
                    class='custom'
                    data={data}
                    xScale={xScale}
                    yScale={yPriceScale}
                    yProfitScale={yProfitScale}
                    tutorial={tutorial}
                    performance={performance}
                    customData={customData}
                />
                <CandlestickTooltip
                    class='candlestickTooltip'
                    data={data}
                    xScale={xScale}
                    yScale={yPriceScale}
                />
            </g>
        </>
    )
}