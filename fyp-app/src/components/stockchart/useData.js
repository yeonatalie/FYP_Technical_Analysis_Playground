import { useState, useEffect } from 'react';
import { csv } from 'd3';

export const useData = (stockData) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const row = d => {
            d.date = new Date(d.date);
            d.volume = +d.volume;
            d.open = +d.open;
            d.close = +d.close;
            d.high = +d.high;
            d.low = +d.low;

            // ensure that values for custom input data are converted to float
            for (const [key, value] of Object.entries(d)) {
                d[key] = +value;
            }
            return d;
        }
        csv(stockData, row).then(setData);
    }, [stockData])

    return data;
}