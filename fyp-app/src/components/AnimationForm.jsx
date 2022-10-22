import React, { useState, useEffect, useRef } from "react";
import Form from 'react-bootstrap/Form';

const AnimationForm = ({setAnimation}) => {
    const childAnimationRef = useRef();
    const [childAnimationState, setChildAnimationState] = useState(0);

    useEffect(() => {
        setAnimation(childAnimationState);
    }, [setAnimation, childAnimationState]);

    const [annotateChart, setAnnotateChart] = useState({
        'variable': "",
        'color': "",
        'displayText': "",
        'delayTime': "",
        'displayTime': "",
        'displayTextTime': ""
    })

    var animationForm = null
    if (childAnimationState === "Annotate Points") {
        animationForm =  <div id='annotateChart'>
                <Form.Group className="mb-3">
                    <Form.Control id='test' type='text' placeholder="Variable Name" onChange={e => setAnnotateChart({...annotateChart, 'variable': e.target.value})}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control id='test' type='text' placeholder="Color" onChange={e => setAnnotateChart({...annotateChart, 'color': e.target.value})}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control id='test' type='text' placeholder="Display Text" onChange={e => setAnnotateChart({...annotateChart, 'displayText': e.target.value})}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control id='test' type='text' placeholder="Delay Time" onChange={e => setAnnotateChart({...annotateChart, 'delayTime': e.target.value})}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control id='test' type='text' placeholder="Display Animation Time" onChange={e => setAnnotateChart({...annotateChart, 'displayTime': e.target.value})}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control id='test' type='text' placeholder="Display Text Time" onChange={e => {setAnnotateChart({...annotateChart, 'displayTextTime':e.target.value}); console.log(annotateChart)}}/>
                </Form.Group>
        </div>
    }

    return (
        <>
            <Form.Group className="mb-3">
                <Form.Label>Animation / Plot Type</Form.Label>
                <Form.Select value={childAnimationState} ref={childAnimationRef} onChange={e => setChildAnimationState(e.target.value)} style={{marginBottom: '15px'}}>
                    <option>Select</option>
                    <option>Annotate Points</option>
                    <option>Plot Line Graph</option>
                </Form.Select>
                {animationForm}
            </Form.Group>


        </>
    );
};
  
export default AnimationForm;

// annotateChart = ({svg, data, xScale, yScale, variable, color="black", displayText, delayTime, displayTime=null, displayTextTime})