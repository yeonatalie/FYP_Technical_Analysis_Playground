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
                <Form.Control id='smaShort' placeholder={params['sma']['short']} onChange={e => setParams({...params, 'sma':{...params['sma'], 'short':parseInt(e.target.value)}})}/>

                <Form.Label style={{marginBottom: '0px'}}>Long Term SMA (days)</Form.Label>
                <Form.Control id='smaLong' placeholder={params['sma']['long']} onChange={e => setParams({...params, 'sma':{...params['sma'], 'long':parseInt(e.target.value)}})}/>
            </Form.Group>
        </>
    }


    return (
        form
    );
};
  
export default SidePanelCustomForm;