import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import React, { useState } from 'react';
import AnimationForm from '../components/AnimationForm';
import CustomisedTutorial from '../components/stockchart/Tutorials/CustomisedTutorial';

function Custom() {
    const [tutorialName, setTutorialName] = useState(null)
    const [data, setData] = useState(null)
    const [numAnimations, setNumAnimations] = useState(0)
    
    const [animation, setAnimation] = useState({'animationList': []})
    const [indicatorChart, setIndicatorChart] = useState(false)
    const [indicatorChartLabel, setIndicatorChartLabel] = useState("Indicator")
    const [indicatorChartLower, setIndicatorChartLower] = useState(0)
    const [indicatorChartUpper, setIndicatorChartUpper] = useState(0)

    const [annotateChartData, setAnnotateChartData] = useState({variable:"", indicatorChart:false})
    const [plotLineData1, setPlotLineData1] = useState({variable:"", indicatorChart:false})
    const [plotLineData2, setPlotLineData2] = useState({variable:"", indicatorChart:false})
    const [longSignalData, setLongSignalData] = useState({variable1:"", variable2:"", longSignal:true, crossAbove:'Cross Above', indicatorChart:false})
    const [shortSignalData, setShortSignalData] = useState({variable1:"", variable2:"", longSignal:false, crossAbove:'Cross Above', indicatorChart:false})
    const [annotateUpDownData, setAnnotateUpDownData] = useState({variable: "", indicatorChart:false})
    const [tooltipIndicatorData, setTooltipIndicatorData] = useState({tooltip:false, indicatorChart:false})
    const [annotatePathData1, setAnnotatePathData1] = useState({variable: "", indicatorChart:false})
    const [annotatePathData2, setAnnotatePathData2] = useState({variable: "", indicatorChart:false})
    const [annotateSignalData, setAnnotateSignalData] = useState({displayTime: "", indicatorChart:false})
    const [plotBarData, setPlotBarData] = useState({variable:"", indicatorChart:false})

    const [customData, setCustomData] = useState(null)

    const [performance, setPerformance] = useState(false)
    const [stopLoss, setStopLoss] = useState("Stop Loss (%)")
    const [takeProfit, setTakeProfit] = useState("Take Profit (%)")

    const onSubmit = () => {
        setCustomData({
            'tutorialName': tutorialName,
            'data': data,
            'annotate': annotateChartData,
            'plotLine1': plotLineData1,
            'plotLine2': plotLineData2,
            'longSignal': longSignalData,
            'shortSignal': shortSignalData,
            'annotateUpDown': annotateUpDownData,
            'tooltipIndicator': tooltipIndicatorData,
            'annotatePath1': annotatePathData1,
            'annotatePath2': annotatePathData2,
            'annotateSignal': annotateSignalData,
            'plotBar': plotBarData,
        })
    };

    var animationFormList = []
    for (let i = 0; i < numAnimations; i++) {
        animationFormList.push(<AnimationForm 
            key={i} animationList={animation.animationList.concat(null)} setAnimation={setAnimation} 
            annotateChartData={annotateChartData} setAnnotateChartData={setAnnotateChartData} 
            plotLineData1={plotLineData1} setPlotLineData1={setPlotLineData1} 
            plotLineData2={plotLineData2} setPlotLineData2={setPlotLineData2} 
            longSignalData={longSignalData} setLongSignalData={setLongSignalData}
            shortSignalData={shortSignalData} setShortSignalData={setShortSignalData}
            annotateUpDownData={annotateUpDownData} setAnnotateUpDownData={setAnnotateUpDownData}
            tooltipIndicatorData={tooltipIndicatorData} setTooltipIndicatorData={setTooltipIndicatorData}
            annotatePathData1={annotatePathData1} setAnnotatePathData1={setAnnotatePathData1}
            annotatePathData2={annotatePathData2} setAnnotatePathData2={setAnnotatePathData2}
            annotateSignalData={annotateSignalData} setAnnotateSignalData={setAnnotateSignalData}
            plotBarData={plotBarData} setPlotBarData={setPlotBarData}>
        </AnimationForm>)
    }

    var indicatorChartForm = null
    if (indicatorChart) {
        indicatorChartForm = <Form.Group className="mb-3">
            <Form.Control style={{marginBottom: "10px"}} type='text' placeholder="Label" onChange={e => setIndicatorChartLabel(e.target.value)}/>
            <Form.Control style={{marginBottom: "10px"}} type='text' placeholder="Lower bound" onChange={e => setIndicatorChartLower(parseInt(e.target.value))}/>
            <Form.Control type='text' placeholder="Upper bound" onChange={e => setIndicatorChartUpper(parseInt(e.target.value))}/>
        </Form.Group>
    }

    return (
        <div>
            <h2 style={{paddingLeft: '30px'}}>Create Tutorial</h2>

            <Form style={{padding: '10px 30px'}}>
                <Form.Group className="mb-3">
                    <Form.Label>Tutorial Name</Form.Label>
                    <Form.Control id='tutorialName' type='text' placeholder="Tutorial name" onChange={e => setTutorialName(e.target.value)}/>
                </Form.Group>

                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Data File</Form.Label>
                    <Form.Control type="file" accept='.csv' onChange={e => {
                            var fr=new FileReader();
                            fr.onload=function(){
                                setData(fr.result);
                            }
                            fr.readAsBinaryString(e.target.files[0]);
                        }}/>
                </Form.Group>

                <Form.Label>Indicator Chart</Form.Label>
                <Form.Group className="mb-3">
                    <Form.Check type="switch" label="Separate Indicator Chart" onChange={e => {setIndicatorChart(e.target.checked)}}/>
                </Form.Group>
                {indicatorChartForm}

                <span id='animationForm'>
                    {animationFormList}
                </span>

                {performance ?
                    <div>
                    <h6 style={{marginTop: '5px'}}>Exit Conditions</h6>
                    <Form.Group className="mb-3">
                        <Form.Label style={{marginBottom: '0px'}}>Stop Loss (%)</Form.Label>
                        <Form.Control id='stopLoss' placeholder={stopLoss} onChange={e => setStopLoss(e.target.value)}/>
                        <Form.Label style={{marginTop: '5px', marginBottom: '0px'}}>Take Profit (%)</Form.Label>
                        <Form.Control id='takeProfit' placeholder={takeProfit} onChange={e => setTakeProfit(e.target.value)}/>
                    </Form.Group>
                    </div> :
                    <div></div>
                }

                <div style={{marginTop:"20px", marginBottom:"70px"}}>
                    <Button variant="outline-secondary" style={{float:"left", width:"15%", marginRight:"20px"}} onClick={e => {setNumAnimations(numAnimations+1)}}>
                        Add Interactivity
                    </Button>
                    <Button variant="primary" style={{float:"left", width:"15%", marginRight:"20px"}} onClick={onSubmit}>
                        Generate Tutorial
                    </Button>                    
                    {(customData != null) ?
                        (customData['shortSignal'].variable1 !== "" && customData['longSignal'].variable1 !== "") ?
                            <Button variant="secondary" style={{float:"left", width:"15%", marginRight:"20px"}} onClick={e => {setPerformance(!performance)}}>
                                Performance
                            </Button> :
                            <div></div> 
                        : <div></div>
                    }
                </div>
            </Form>

            <CustomisedTutorial customData={customData} indicatorChartState={indicatorChart} indicatorChartLabel={indicatorChartLabel} 
            indicatorChartLower={indicatorChartLower} indicatorChartUpper={indicatorChartUpper} performance={performance} stopLoss={stopLoss} takeProfit={takeProfit}>
            </CustomisedTutorial>
        </div>
    );

}
  
export default Custom;