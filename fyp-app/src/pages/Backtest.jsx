import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import React, { useState, useEffect } from 'react';
import AnimationForm from '../components/AnimationForm';

function Backtest() {
    const [tutorialName, setTutorialName] = useState(null)
    const [data, setData] = useState(null)
    const [numAnimations, setNumAnimations] = useState(0)
    
    const [animation, setAnimation] = useState(null)

    const onSubmit = () => {
        console.log(tutorialName);
        console.log(data)
        console.log(animation)
    };

    // useEffect(() => {
    //     var animationFormHTML = ''
    //     for (let i = 0; i < numAnimations; i++) {
    //         animationFormHTML += `<AnimationForm setAnimation={setAnimation}></AnimationForm>`
    //     }
    //     const animationFormComponent = document.getElementById('animationForm')
    //     animationFormComponent.innerHTML = animationFormHTML
    // }, [numAnimations])

    var animationFormList = []
    for (let i = 0; i < numAnimations; i++) {
        animationFormList.push(<AnimationForm key={i} setAnimation={setAnimation}></AnimationForm>)
    }

    return (
        <div>
            <h2 style={{paddingLeft: '30px'}}>Backtesting</h2>

            <Form style={{padding: '10px 30px'}}>
                <Form.Group className="mb-3">
                    <Form.Label>Tutorial Name</Form.Label>
                    <Form.Control id='test' type='text' placeholder="Enter Tutorial Name" onChange={e => setTutorialName(e.target.value)}/>
                </Form.Group>

                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Data File</Form.Label>
                    <Form.Control type="file" accept='.txt' onChange={e => {
                            var fr=new FileReader();
                            fr.onload=function(){
                                setData(fr.result);
                            }
                            fr.readAsText(e.target.files[0]);
                        }}/>
                </Form.Group>

                <Button variant="primary" style={{marginBottom: '10px'}} onClick={e => {setNumAnimations(numAnimations+1); console.log(numAnimations)}}>
                    Add Animation
                </Button>

                <span id='animationForm'>
                    {animationFormList}
                </span>
                
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Check me out" />
                </Form.Group>
                <Button variant="primary" onClick={onSubmit}>
                    Submit
                </Button>
            </Form>
        </div>
    );

}
  
export default Backtest;