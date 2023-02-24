import React, { useState, useEffect, useRef } from "react";
import Form from 'react-bootstrap/Form';

const SidePanelCustomForm = ({tutorial, paramData, setParamData}) => {
    var form = null
    
    // SMA
    const [params, setParams] = useState(paramData)
    useEffect(() => {
        setParamData(params);
    }, [setParamData, params])

    if (tutorial === 'sma') {
        form = <>
            <Form.Group className="mb-3">
                <Form.Label style={{marginBottom: '0px'}}>Short Term SMA (days)</Form.Label>
                <Form.Control id='smaShort' placeholder={params['sma']['short']} onChange={e => setParams({...params, 'sma':{...params['sma'], 'short':parseInt(e.target.value) || params['sma']['short']}})}/>

                <Form.Label style={{marginBottom: '0px'}}>Long Term SMA (days)</Form.Label>
                <Form.Control id='smaLong' placeholder={params['sma']['long']} onChange={e => setParams({...params, 'sma':{...params['sma'], 'long':parseInt(e.target.value) || params['sma']['long']}})}/>
            </Form.Group>
        </>
    } else if (tutorial === 'ema') {
        form = <>
            <Form.Group className="mb-3">
                <Form.Label style={{marginBottom: '0px'}}>Short Term EMA (days)</Form.Label>
                <Form.Control id='emaShort' placeholder={params['ema']['short']} onChange={e => setParams({...params, 'ema':{...params['ema'], 'short':parseInt(e.target.value) || params['ema']['short']}})}/>

                <Form.Label style={{marginBottom: '0px'}}>Long Term EMA (days)</Form.Label>
                <Form.Control id='emaLong' placeholder={params['ema']['long']} onChange={e => setParams({...params, 'ema':{...params['ema'], 'long':parseInt(e.target.value) || params['ema']['long']}})}/>
            </Form.Group>
        </>
    } else if (tutorial === 'rsi') {
        form = <>
            <Form.Group className="mb-3">
                <Form.Label style={{marginBottom: '0px'}}>RSI Period (days)</Form.Label>
                <Form.Control id='rsiPeriod' placeholder={params['rsi']['period']} onChange={e => setParams({...params, 'rsi':{...params['rsi'], 'period':parseInt(e.target.value) || params['rsi']['period']}})}/>

                <Form.Label style={{marginBottom: '0px'}}>RSI Overbought Filter Level</Form.Label>
                <Form.Control id='rsiOverbought' placeholder={params['rsi']['overbought']} onChange={e => setParams({...params, 'rsi':{...params['rsi'], 'overbought':parseInt(e.target.value) || params['rsi']['overbought']}})}/>

                <Form.Label style={{marginBottom: '0px'}}>RSI Oversold Filter Level</Form.Label>
                <Form.Control id='rsiOversold' placeholder={params['rsi']['oversold']} onChange={e => setParams({...params, 'rsi':{...params['rsi'], 'oversold':parseInt(e.target.value) || params['rsi']['oversold']}})}/>
            </Form.Group>
        </>
    } else if (tutorial === 'macd') {
        form = <>
            <Form.Group className="mb-3">
                <Form.Label style={{marginBottom: '0px'}}>Short Term SMA (days)</Form.Label>
                <Form.Control id='macdFast' placeholder={params['macd']['short']} onChange={e => setParams({...params, 'macd':{...params['macd'], 'short':parseInt(e.target.value) || params['macd']['short']}})}/>

                <Form.Label style={{marginBottom: '0px'}}>Long Term SMA (days)</Form.Label>
                <Form.Control id='macdSlow' placeholder={params['macd']['long']} onChange={e => setParams({...params, 'macd':{...params['macd'], 'long':parseInt(e.target.value) || params['macd']['long']}})}/>

                <Form.Label style={{marginBottom: '0px'}}>Period for Signal Line (days)</Form.Label>
                <Form.Control id='macdSignal' placeholder={params['macd']['signal']} onChange={e => setParams({...params, 'macd':{...params['macd'], 'signal':parseInt(e.target.value) || params['macd']['signal']}})}/>
            </Form.Group>
        </>
    }


    return (
        form
    );
};
  
export default SidePanelCustomForm;