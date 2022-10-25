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

    const [annotateChartData, setAnnotateChartData] = useState({variable:""})
    const [plotLineData1, setPlotLineData1] = useState({variable:""})
    const [plotLineData2, setPlotLineData2] = useState({variable:""})
    const [longSignalData, setLongSignalData] = useState({variable1:"", variable2:"", longSignal:true, crossAbove:'Cross Above'})
    const [shortSignalData, setShortSignalData] = useState({variable1:"", variable2:"", longSignal:false, crossAbove:'Cross Above'})
    const [annotateUpDownData, setAnnotateUpDownData] = useState({variable: ""})
    const [tooltipIndicatorData, setTooltipIndicatorData] = useState(false)
    const [annotatePathData1, setAnnotatePathData1] = useState({variable: ""})
    const [annotatePathData2, setAnnotatePathData2] = useState({variable: ""})
    const [annotateSignalData, setAnnotateSignalData] = useState({displayTime: ""})

    const [customData, setCustomData] = useState(null)

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
            annotateSignalData={annotateSignalData} setAnnotateSignalData={setAnnotateSignalData}>
        </AnimationForm>)
    }
    return (
        <div>
            <h2 style={{paddingLeft: '30px'}}>Customise Tutorial</h2>

            <Form style={{padding: '10px 30px'}}>
                <Form.Group className="mb-3">
                    <Form.Label>Tutorial Name</Form.Label>
                    <Form.Control id='tutorialName' type='text' placeholder="Enter Tutorial Name" onChange={e => setTutorialName(e.target.value)}/>
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

                <span id='animationForm'>
                    {animationFormList}
                </span>

                <div style={{marginBottom:"70px"}}>
                    <Button variant="outline-secondary" style={{float:"left", width:"15%", marginRight:"20px"}} onClick={e => {setNumAnimations(numAnimations+1)}}>
                        Add Animation
                    </Button>
                    <Button variant="primary" style={{float:"left", width:"15%", marginRight:"20px"}} onClick={onSubmit}>
                        Generate Tutorial
                    </Button>
                </div>
            </Form>

            <CustomisedTutorial customData={customData}></CustomisedTutorial>
        </div>
    );

}
  
export default Custom;