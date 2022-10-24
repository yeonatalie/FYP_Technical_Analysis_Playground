import React, { useState, useEffect, useRef } from "react";
import Form from 'react-bootstrap/Form';

const AnimationForm = ({animationList, setAnimation, annotateChartData, setAnnotateChartData, plotLineData1, setPlotLineData1, 
plotLineData2, setPlotLineData2, longSignalData, setLongSignalData, shortSignalData, setShortSignalData}) => {
    
    const childAnimationRef = useRef();
    const [childAnimationState, setChildAnimationState] = useState({'animationList': animationList});

    useEffect(() => {
        setAnimation(childAnimationState);
    }, [setAnimation, childAnimationState]);

    const [annotateChart, setAnnotateChart] = useState(annotateChartData)
    useEffect(() => {
        setAnnotateChartData(annotateChart);
    }, [setAnnotateChartData, annotateChart])

    const [plotLine1, setPlotLine1] = useState(plotLineData1)
    useEffect(() => {
        setPlotLineData1(plotLine1);
    }, [setPlotLineData1, plotLine1])

    console.log(plotLine1)

    const [plotLine2, setPlotLine2] = useState(plotLineData2)
    useEffect(() => {
        setPlotLineData2(plotLine2);
    }, [setPlotLineData2, plotLine2])

    const [longSignal, setLongSignal] = useState(longSignalData)
    useEffect(() => {
        setLongSignalData(longSignal);
    }, [setLongSignalData, longSignal])

    const [shortSignal, setShortSignal] = useState(shortSignalData)
    useEffect(() => {
        setShortSignalData(shortSignal);
    }, [setShortSignalData, shortSignal])

    var animationForm = null
    if (childAnimationState.animationList.at(-1) === "Annotate Points") {
        animationForm =  <div id='annotateChart'>
                <Form.Group className="mb-3">
                    <Form.Control type='text' placeholder="Variable Name" onChange={e => setAnnotateChart({...annotateChart, 'variable': e.target.value})}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control type='text' placeholder="Color" onChange={e => setAnnotateChart({...annotateChart, 'color': e.target.value})}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control type='text' placeholder="Display Text" onChange={e => setAnnotateChart({...annotateChart, 'displayText': e.target.value})}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control type='text' placeholder="Delay Time" onChange={e => setAnnotateChart({...annotateChart, 'delayTime': e.target.value})}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control type='text' placeholder="Display Animation Time" onChange={e => setAnnotateChart({...annotateChart, 'displayTime': e.target.value})}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control type='text' placeholder="Display Text Time" onChange={e => {setAnnotateChart({...annotateChart, 'displayTextTime':e.target.value})}}/>
                </Form.Group>
        </div>
    } 
    
    if (childAnimationState.animationList.at(-1) === "Plot 1st Line Graph") {
        animationForm =  <div id='plotLine1'>
                <Form.Group className="mb-3">
                    <Form.Control type='text' placeholder="Variable Name" onChange={e => setPlotLine1({...plotLine1, 'variable': e.target.value})}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control type='text' placeholder="Plot Label" onChange={e => setPlotLine1({...plotLine1, 'variableLabel': e.target.value})}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control type='text' placeholder="Color" onChange={e => setPlotLine1({...plotLine1, 'color': e.target.value})}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control type='text' placeholder="Display Text" onChange={e => setPlotLine1({...plotLine1, 'displayText': e.target.value})}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control type='text' placeholder="Delay Time" onChange={e => setPlotLine1({...plotLine1, 'delayTime': e.target.value})}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control type='text' placeholder="Display Text Time" onChange={e => {setPlotLine1({...plotLine1, 'displayTextTime':e.target.value})}}/>
                </Form.Group>
        </div>
    } 

    if (childAnimationState.animationList.at(-1) === "Plot 2nd Line Graph") {
        animationForm =  <div id='plotLine2'>
                <Form.Group className="mb-3">
                    <Form.Control type='text' placeholder="Variable Name" onChange={e => setPlotLine2({...plotLine2, 'variable': e.target.value})}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control type='text' placeholder="Plot Label" onChange={e => setPlotLine2({...plotLine2, 'variableLabel': e.target.value})}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control type='text' placeholder="Color" onChange={e => setPlotLine2({...plotLine2, 'color': e.target.value})}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control type='text' placeholder="Display Text" onChange={e => setPlotLine2({...plotLine2, 'displayText': e.target.value})}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control type='text' placeholder="Delay Time" onChange={e => setPlotLine2({...plotLine2, 'delayTime': e.target.value})}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control type='text' placeholder="Display Text Time" onChange={e => {setPlotLine2({...plotLine2, 'displayTextTime':e.target.value})}}/>
                </Form.Group>
        </div>
    } 

    if (childAnimationState.animationList.at(-1) === "Long Signal") {
        animationForm =  <div id='longSignal'>
                <Form.Group className="mb-3">
                    <Form.Control type='text' placeholder="Variable 1" onChange={e => setLongSignal({...longSignal, 'variable1': e.target.value})}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control type='text' placeholder="Variable 2" onChange={e => setLongSignal({...longSignal, 'variable2': e.target.value})}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Select onChange={e => setLongSignal({...longSignal, 'crossAbove': e.target.value})}>
                        <option>Cross Above</option>
                        <option>Cross Below</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control type='text' placeholder="Delay Time" onChange={e => setLongSignal({...longSignal, 'delayTime': e.target.value})}/>
                </Form.Group>                
                <Form.Group className="mb-3">
                    <Form.Control type='text' placeholder="Display Text" onChange={e => setLongSignal({...longSignal, 'displayText': e.target.value})}/>
                </Form.Group>                
                <Form.Group className="mb-3">
                    <Form.Control type='text' placeholder="Delay Text Time" onChange={e => setLongSignal({...longSignal, 'delayTextTime': e.target.value})}/>
                </Form.Group>                
                <Form.Group className="mb-3">
                    <Form.Control type='text' placeholder="Display Text Time" onChange={e => setLongSignal({...longSignal, 'displayTextTime': e.target.value})}/>
                </Form.Group>
        </div>
    } 

    if (childAnimationState.animationList.at(-1) === "Short Signal") {
        animationForm =  <div id='shortSignal'>
                <Form.Group className="mb-3">
                    <Form.Control type='text' placeholder="Variable 1" onChange={e => setShortSignal({...shortSignal, 'variable1': e.target.value})}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control type='text' placeholder="Variable 2" onChange={e => setShortSignal({...shortSignal, 'variable2': e.target.value})}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Select onChange={e => setShortSignal({...shortSignal, 'crossAbove': e.target.value})}>
                        <option>Cross Above</option>
                        <option>Cross Below</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control type='text' placeholder="Delay Time" onChange={e => setShortSignal({...shortSignal, 'delayTime': e.target.value})}/>
                </Form.Group>                
                <Form.Group className="mb-3">
                    <Form.Control type='text' placeholder="Display Text" onChange={e => setShortSignal({...shortSignal, 'displayText': e.target.value})}/>
                </Form.Group>                
                <Form.Group className="mb-3">
                    <Form.Control type='text' placeholder="Delay Text Time" onChange={e => setShortSignal({...shortSignal, 'delayTextTime': e.target.value})}/>
                </Form.Group>                
                <Form.Group className="mb-3">
                    <Form.Control type='text' placeholder="Display Text Time" onChange={e => setShortSignal({...shortSignal, 'displayTextTime': e.target.value})}/>
                </Form.Group>
        </div>
    } 
    return (
        <>
            <Form.Group className="mb-3">
                <Form.Label>Animation / Plot Type</Form.Label>
                <Form.Select ref={childAnimationRef} onChange={e => setChildAnimationState({'animationList': childAnimationState.animationList.concat(e.target.value)})} style={{marginBottom: '15px'}}>
                    <option>Select</option>
                    <option>Annotate Points</option>
                    <option>Plot 1st Line Graph</option>
                    <option>Plot 2nd Line Graph</option>
                    <option>Long Signal</option>
                    <option>Short Signal</option>
                </Form.Select>
                {animationForm}
            </Form.Group>
        </>
    );
};
  
export default AnimationForm;

// crossoverSignal = ({svg, data, xScale, yScale, variable1, variable2, longSignal=true, crossAbove=true, delayTime, displayText, speed=100, delayTextTime, displayTextTime})