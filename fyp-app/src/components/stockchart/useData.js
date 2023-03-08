import { useState, useEffect } from 'react';
import { csv } from 'd3';

export const useData = (stockData) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const row = d => {
            d.date = new Date(d.Date);
            d.volume = +d.Volume;
            d.open = +d.Open;
            d.close = +d.Close;
            d.high = +d.High;
            d.low = +d.Low;
            return d;
        }
        csv(stockData, row).then(setData);
    }, [stockData])

    return data;
}