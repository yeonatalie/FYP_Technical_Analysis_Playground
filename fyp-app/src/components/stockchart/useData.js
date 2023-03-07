import { useState, useEffect } from 'react';
import { csv } from 'd3';
import AAPL from '../../stock-data/new/daily/AAPL.csv';


csv(AAPL, function(data) { console.log(data); });

const csvUrl = 'https://gist.githubusercontent.com/alvin-yang68/825378ee22558f0ced78a2ca74c931a7/raw/AAPLStockHistory.csv'

export const useData = () => {
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
        csv(AAPL, row).then(setData);
    }, [])

    return data;
}