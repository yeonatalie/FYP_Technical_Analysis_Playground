import { useState, useEffect } from 'react';
import ReactTooltip from 'react-tooltip';

import '../../styles/stockchart.css';
import { useData } from './useData';
import { Main } from './Main'
import { Brush } from './Brush'
import { Indicator } from './Indicator';

export const StockChart = ({
    specs: {
        totalWidth,
        totalHeight,
        indicatorHeight,
        mainChartRatio,
        indicatorSpecs,
        brushSpecs,
        mainChartSpecs
    }, indicatorChart, indicatorChartLabel, indicatorRange, lightenCandlestick, tutorial, performance, customData
}) => {
    const data = useData();
    const [brushExtent, setBrushExtent] = useState();

    useEffect(() => {
        ReactTooltip.rebuild();
    });

    if (!data) {
        return <pre style={{margin: "30px"}}>Loading...</pre>;
    }

    mainChartSpecs = {
        ...mainChartSpecs,
        width: totalWidth,
        height: totalHeight * mainChartRatio
    }

    indicatorSpecs = {
        ...indicatorSpecs,
        width: totalWidth,
        height: indicatorHeight
    }

    brushSpecs = {
        ...brushSpecs,
        width: totalWidth,
        height: totalHeight * (1 - mainChartRatio)
    }

    const initialBrushExtent = [
        data[data.length - brushSpecs.brushSize].date,
        data[data.length - 1].date
    ];

    const slicedData = brushExtent ?
        data.filter(d => (d.date > brushExtent[0]) && (d.date < brushExtent[1])) :
        data.filter(d => (d.date > initialBrushExtent[0]) && (d.date < initialBrushExtent[1]));

    if (indicatorChart) {
        return (
            <>
                <svg width={totalWidth} height={totalHeight + indicatorHeight}>
                    <Main
                        data={slicedData}
                        specs={mainChartSpecs}
                        lightenCandlestick={lightenCandlestick}
                        tutorial={tutorial}
                        performance={performance}
                        customData={customData}
                    />
                    <g transform={`translate(0,${totalHeight * mainChartRatio})`}>
                        <Indicator
                            data={slicedData}
                            specs={indicatorSpecs}
                            indicatorChartLabel={indicatorChartLabel}
                            indicatorRange={indicatorRange}
                            tutorial={tutorial}
                            performance={performance}
                            customData={customData}
                        />
                    </g>
                    <g transform={`translate(0,${(totalHeight * mainChartRatio) + indicatorHeight})`}>
                        <Brush
                            data={data}
                            specs={brushSpecs}
                            initialBrushExtent={initialBrushExtent}
                            setBrushExtent={setBrushExtent}
                        />
                    </g>
                </svg>
                <ReactTooltip id='mark-tooltip' place='right' effect='solid' html={true} />
            </>
        )
    } else {
        return (
            <>
                <svg width={totalWidth} height={totalHeight}>
                    <Main
                        data={slicedData}
                        specs={mainChartSpecs}
                        lightenCandlestick={lightenCandlestick}
                        tutorial={tutorial}
                        performance={performance}
                        customData={customData}
                    />
                    <g transform={`translate(0,${totalHeight * mainChartRatio})`}>
                        <Brush
                            data={data}
                            specs={brushSpecs}
                            initialBrushExtent={initialBrushExtent}
                            setBrushExtent={setBrushExtent}
                        />
                    </g>
                </svg>
                <ReactTooltip id='mark-tooltip' place='right' effect='solid' html={true} />
            </>
        )
    }
}