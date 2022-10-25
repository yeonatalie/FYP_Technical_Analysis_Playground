import React, { useState, useEffect, useRef } from "react";
import Form from 'react-bootstrap/Form';

const AnimationForm = ({animationList, setAnimation, annotateChartData, setAnnotateChartData, plotLineData1, setPlotLineData1, 
plotLineData2, setPlotLineData2, longSignalData, setLongSignalData, shortSignalData, setShortSignalData, annotateUpDownData,
setAnnotateUpDownData, tooltipIndicatorData, setTooltipIndicatorData, annotatePathData1, setAnnotatePathData1, annotatePathData2, 
setAnnotatePathData2, annotateSignalData, setAnnotateSignalData, plotBarData, setPlotBarData}) => {
    
    const childAnimationRef = useRef();
    const [childAnimationState, setChildAnimationState] = useState({'animationList': animationList});
    useEffect(() => {
        setAnimation(childAnimationState);
    }, [setAnimation, childAnimationState]);

    /////////////////////////////////////////

    const [annotateChart, setAnnotateChart] = useState(annotateChartData)
    useEffect(() => {
        setAnnotateChartData(annotateChart);
    }, [setAnnotateChartData, annotateChart])

    const [plotLine1, setPlotLine1] = useState(plotLineData1)
    useEffect(() => {
        setPlotLineData1(plotLine1);
    }, [setPlotLineData1, plotLine1])

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

    const [annotateUpDown, setAnnotateUpDown] = useState(annotateUpDownData)
    useEffect(() => {
        setAnnotateUpDownData(annotateUpDown);
    }, [setAnnotateUpDownData, annotateUpDown])

    const [tooltipIndicator, setTooltipIndicator] = useState(tooltipIndicatorData)
    useEffect(() => {
        setTooltipIndicatorData(tooltipIndicator);
    }, [setTooltipIndicatorData, tooltipIndicator])

    const [annotatePath1, setAnnotatePath1] = useState(annotatePathData1)
    useEffect(() => {
        setAnnotatePathData1(annotatePath1);
    }, [setAnnotatePathData1, annotatePath1])

    const [annotatePath2, setAnnotatePath2] = useState(annotatePathData2)
    useEffect(() => {
        setAnnotatePathData2(annotatePath2);
    }, [setAnnotatePathData2, annotatePath2])

    const [annotateSignal, setAnnotateSignal] = useState(annotateSignalData)
    useEffect(() => {
        setAnnotateSignalData(annotateSignal);
    }, [setAnnotateSignalData, annotateSignal])

    const [plotBar, setPlotBar] = useState(plotBarData)
    useEffect(() => {
        setPlotBarData(plotBar);
    }, [setPlotBarData, plotBar])

    /////////////////////////////////////////


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
                <Form.Control id='plot1Var' type='text' placeholder="Variable Name" onChange={e => setPlotLine1({...plotLine1, 'variable': e.target.value})}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Control id='plot1Varlabel' type='text' placeholder="Plot Label" onChange={e => setPlotLine1({...plotLine1, 'variableLabel': e.target.value})}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Control id='plot1Color' type='text' placeholder="Color" onChange={e => setPlotLine1({...plotLine1, 'color': e.target.value})}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Control id='plot1Text' type='text' placeholder="Display Text" onChange={e => setPlotLine1({...plotLine1, 'displayText': e.target.value})}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Control id='plot1Delaytime' type='text' placeholder="Delay Time" onChange={e => setPlotLine1({...plotLine1, 'delayTime': e.target.value})}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Control id='plot1Displaytexttime' type='text' placeholder="Display Text Time" onChange={e => {setPlotLine1({...plotLine1, 'displayTextTime':e.target.value})}}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Display on Separate Indicator Chart" onChange={e => {setPlotLine1({...plotLine1, 'indicatorChart':e.target.checked})}}/>
            </Form.Group>
        </div>
    } 

    if (childAnimationState.animationList.at(-1) === "Plot 2nd Line Graph") {
        animationForm =  <div id='plotLine2'>
            <Form.Group className="mb-3">
                <Form.Control id='plot2Var' type='text' placeholder="Variable Name" onChange={e => setPlotLine2({...plotLine2, 'variable': e.target.value})}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Control id='plot2Varlabel' type='text' placeholder="Plot Label" onChange={e => setPlotLine2({...plotLine2, 'variableLabel': e.target.value})}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Control id='plot2Color' type='text' placeholder="Color" onChange={e => setPlotLine2({...plotLine2, 'color': e.target.value})}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Control id='plot2Text' type='text' placeholder="Display Text" onChange={e => setPlotLine2({...plotLine2, 'displayText': e.target.value})}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Control id='plot2Delaytime' type='text' placeholder="Delay Time" onChange={e => setPlotLine2({...plotLine2, 'delayTime': e.target.value})}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Control id='plot2Displaytexttime' type='text' placeholder="Display Text Time" onChange={e => {setPlotLine2({...plotLine2, 'displayTextTime':e.target.value})}}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Display on Separate Indicator Chart" onChange={e => {setPlotLine2({...plotLine2, 'indicatorChart':e.target.checked})}}/>
            </Form.Group>
        </div>
    } 

    if (childAnimationState.animationList.at(-1) === "Long Signal") {
        animationForm =  <div id='longSignal'>
            <Form.Group className="mb-3">
                <Form.Control id='longVar1' type='text' placeholder="Variable 1" onChange={e => setLongSignal({...longSignal, 'variable1': e.target.value})}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Control id='longVar2' type='text' placeholder="Variable 2" onChange={e => setLongSignal({...longSignal, 'variable2': e.target.value})}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Select onChange={e => setLongSignal({...longSignal, 'crossAbove': e.target.value})}>
                    <option>Cross Above</option>
                    <option>Cross Below</option>
                </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Control id='longDelaytime' type='text' placeholder="Delay Time" onChange={e => setLongSignal({...longSignal, 'delayTime': e.target.value})}/>
            </Form.Group>                
            <Form.Group className="mb-3">
                <Form.Control id='longDisplayText' type='text' placeholder="Display Text" onChange={e => setLongSignal({...longSignal, 'displayText': e.target.value})}/>
            </Form.Group>                
            <Form.Group className="mb-3">
                <Form.Control id='longDelayTextTime' type='text' placeholder="Delay Text Time" onChange={e => setLongSignal({...longSignal, 'delayTextTime': e.target.value})}/>
            </Form.Group>                
            <Form.Group className="mb-3">
                <Form.Control id='longDisplayTextTime' type='text' placeholder="Display Text Time" onChange={e => setLongSignal({...longSignal, 'displayTextTime': e.target.value})}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Display on Separate Indicator Chart" onChange={e => {setLongSignal({...longSignal, 'indicatorChart':e.target.checked})}}/>
            </Form.Group>
        </div>
    } 

    if (childAnimationState.animationList.at(-1) === "Short Signal") {
        animationForm =  <div id='shortSignal'>
            <Form.Group className="mb-3">
                <Form.Control id='shortVar1' type='text' placeholder="Variable 1" onChange={e => setShortSignal({...shortSignal, 'variable1': e.target.value})}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Control id='shortVar2' type='text' placeholder="Variable 2" onChange={e => setShortSignal({...shortSignal, 'variable2': e.target.value})}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Select onChange={e => setShortSignal({...shortSignal, 'crossAbove': e.target.value})}>
                    <option>Cross Above</option>
                    <option>Cross Below</option>
                </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Control id='shortDelaytime' type='text' placeholder="Delay Time" onChange={e => setShortSignal({...shortSignal, 'delayTime': e.target.value})}/>
            </Form.Group>                
            <Form.Group className="mb-3">
                <Form.Control id='shortDisplayText' type='text' placeholder="Display Text" onChange={e => setShortSignal({...shortSignal, 'displayText': e.target.value})}/>
            </Form.Group>                
            <Form.Group className="mb-3">
                <Form.Control id='shortDelayTextTime' type='text' placeholder="Delay Text Time" onChange={e => setShortSignal({...shortSignal, 'delayTextTime': e.target.value})}/>
            </Form.Group>                
            <Form.Group className="mb-3">
                <Form.Control id='shortDisplayTextTime' type='text' placeholder="Display Text Time" onChange={e => setShortSignal({...shortSignal, 'displayTextTime': e.target.value})}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Display on Separate Indicator Chart" onChange={e => {setShortSignal({...shortSignal, 'indicatorChart':e.target.checked})}}/>
            </Form.Group>
        </div>
    } 

    if (childAnimationState.animationList.at(-1) === "Annotate Up Down Movements") {
        animationForm =  <div id='annotateUpDown'>
            <Form.Group className="mb-3">
                <Form.Control type='text' placeholder="Variable Name" onChange={e => setAnnotateUpDown({...annotateUpDown, 'variable': e.target.value})}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Control type='text' placeholder="Display Text" onChange={e => setAnnotateUpDown({...annotateUpDown, 'displayText': e.target.value})}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Control type='text' placeholder="Delay Time" onChange={e => setAnnotateUpDown({...annotateUpDown, 'delayTime': e.target.value})}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Control type='text' placeholder="Delay Text Time" onChange={e => setAnnotateUpDown({...annotateUpDown, 'delayTextTime': e.target.value})}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Control type='text' placeholder="Display Text Time" onChange={e => {setAnnotateUpDown({...annotateUpDown, 'displayTextTime':e.target.value})}}/>
            </Form.Group>
        </div>
    } 

    if (childAnimationState.animationList.at(-1) === "Annotate 1st Line Graph") {
        animationForm =  <div id='annotatePath1'>
            <Form.Group className="mb-3">
                <Form.Control type='text' placeholder="Variable Name" onChange={e => setAnnotatePath1({...annotatePath1, 'variable': e.target.value})}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Control type='text' placeholder="Display Text" onChange={e => setAnnotatePath1({...annotatePath1, 'displayText': e.target.value})}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Control type='text' placeholder="Display Time" onChange={e => {setAnnotatePath1({...annotatePath1, 'displayTime':e.target.value})}}/>
            </Form.Group>
        </div>
    } 

    if (childAnimationState.animationList.at(-1) === "Annotate 2nd Line Graph") {
        animationForm =  <div id='annotatePath2'>
            <Form.Group className="mb-3">
                <Form.Control type='text' placeholder="Variable Name" onChange={e => setAnnotatePath2({...annotatePath2, 'variable': e.target.value})}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Control type='text' placeholder="Display Text" onChange={e => setAnnotatePath2({...annotatePath2, 'displayText': e.target.value})}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Control type='text' placeholder="Display Time" onChange={e => {setAnnotatePath2({...annotatePath2, 'displayTime':e.target.value})}}/>
            </Form.Group>
        </div>
    } 

    if (childAnimationState.animationList.at(-1) === "Annotate Signals") {
        animationForm =  <div id='annotateSignal'>
            <Form.Group className="mb-3">
                <Form.Control type='text' placeholder="Display Time" onChange={e => {setAnnotateSignal({...annotateSignal, 'displayTime':e.target.value})}}/>
            </Form.Group>
        </div>
    } 
    
    if (childAnimationState.animationList.at(-1) === "Plot Bar Graph") {
        animationForm =  <div id='plotBar'>
            <Form.Group className="mb-3">
                <Form.Control type='text' placeholder="Variable Name" onChange={e => setPlotBar({...plotBar, 'variable': e.target.value})}/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Control type='text' placeholder="Delay Time" onChange={e => setPlotBar({...plotBar, 'delayTime': e.target.value})}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Display on Separate Indicator Chart" onChange={e => {setPlotBar({...plotBar, 'indicatorChart':e.target.checked})}}/>
            </Form.Group>
        </div>
    } 

    //////////////////////////////////////////

    return (
        <>
            <Form.Group className="mb-3">
                <Form.Label>Animation / Plot / Tooltip</Form.Label>
                <Form.Select ref={childAnimationRef} onChange={e => {
                    setChildAnimationState({'animationList': childAnimationState.animationList.concat(e.target.value)}); 
                    (e.target.value === 'Tooltip for Indicators') && setTooltipIndicator(true)}
                } style={{marginBottom: '15px'}}>

                    <option>Select</option>
                    <option>Annotate Points</option>
                    <option>Annotate Up Down Movements</option>
                    <option>Plot 1st Line Graph</option>
                    <option>Annotate 1st Line Graph</option>
                    <option>Plot 2nd Line Graph</option>
                    <option>Annotate 2nd Line Graph</option>
                    <option>Long Signal</option>
                    <option>Short Signal</option>
                    <option>Annotate Signals</option>
                    <option>Tooltip for Indicators</option>
                    <option>Plot Bar Graph</option>

                </Form.Select>
                {animationForm}
            </Form.Group>
        </>
    );
};
  
export default AnimationForm;