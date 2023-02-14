import { StockChart } from '../components/stockchart/StockChart'
import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useNavigate} from 'react-router-dom';
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import { List } from 'react-bootstrap-icons';

function Tutorial() {
    const chartSpecs = {
        totalWidth: 1250,
        totalHeight: 550,
        indicatorHeight: 200,
        mainChartRatio: 0.75,
        mainChartSpecs: {
          margin: { top: 20, right: 70, bottom: 40, left: 100 }
        },
        indicatorSpecs: {
          margin: { top: 20, right: 70, bottom: 40, left: 100 },
        },
        brushSpecs: {
          brushSize: 130,
          margin: { top: 20, right: 70, bottom: 40, left: 100 },
          yAxisNumTicks: 5
        }
    }

    const [pane, setPane] = useState({
      isPaneOpen: false,
    });

    const [tutorial, setTutorial] = useState(null)
    const [lightenCandlestick, setLightenCandlestick] = useState(false)
    const [indicatorChart, setIndicatorChart] = useState(false)
    const [performance, setPerformance] = useState(false)

    var tutorialHeader = "Candlestick Chart"
    var indicatorChartLabel = "Indicator"
    var indicatorRange = [0, 0]
    
    if (tutorial === 'sma') {
      tutorialHeader = "SMA Crossover"

    } else if (tutorial === 'ema') {
      tutorialHeader = "EMA Crossover"

    } else if (tutorial === 'rsi') {
      tutorialHeader = "RSI"
      indicatorChartLabel = "RSI"
      indicatorRange = [0, 100]

    } else if (tutorial === 'macd') {
      tutorialHeader = "MACD"
      indicatorChartLabel = "MACD"
      indicatorRange = [-5, 5]

    } else if (tutorial === 'bband') {
      tutorialHeader = "Bollinger Bands"

    } else if (tutorial === 'pp') {
      tutorialHeader = "Pivot Points"
    } else if (tutorial === 'custom') {
      tutorialHeader = "Custom Tutorial"
    }

    if (performance) {
      tutorialHeader += " Trade Performance"
    }

    const navigate = useNavigate();
    const navigateCustom = () => {
      // 👇️ navigate to /
      navigate('/custom-tutorial');
    };

    return (
      <div>
        <div>
          <h2 style={{float: 'left', width: '70%', paddingLeft: '30px'}}>{tutorialHeader}</h2>
          <Button style={{float: 'right', marginRight: '30px', backgroundColor:'#F9F9F9', color: 'black'}} variant="secondary" onClick={() => setPane({ isPaneOpen: true })}>
            <List size={25}/> 
          </Button>
        </div>

        <SlidingPane
          isOpen={pane.isPaneOpen}
          title="Tutorial"
          width="25%"
          onRequestClose={() => setPane({ isPaneOpen: false })}
          style={{position: "absolute"}}
        >
          <h5>Tutorial</h5>
          <Dropdown>
            <Dropdown.Toggle style={{padding: '5px 20px', backgroundColor:'#F9F9F9', color: 'black', width: "100%"}} variant="secondary">
              {tutorialHeader === "Candlestick Chart" ? "Technical Indicator" : tutorialHeader.replace(" Trade Performance", "")}
            </Dropdown.Toggle>
            <Dropdown.Menu >
              <Dropdown.Header>Trend Indicators</Dropdown.Header>
              <Dropdown.Item onClick={() => {setTutorial("sma"); setLightenCandlestick(true); setIndicatorChart(false)}}>SMA Crossover</Dropdown.Item>
              <Dropdown.Item onClick={() => {setTutorial("ema"); setLightenCandlestick(true); setIndicatorChart(false)}}>EMA Crossover</Dropdown.Item>
              <Dropdown.Header>Momentum Indicators</Dropdown.Header>
              <Dropdown.Item onClick={() => {setTutorial("rsi"); setLightenCandlestick(true); setIndicatorChart(true)}}>RSI</Dropdown.Item>
              <Dropdown.Item onClick={() => {setTutorial("macd"); setLightenCandlestick(true); setIndicatorChart(true)}}>MACD</Dropdown.Item>
              <Dropdown.Header>Volatility Indicators</Dropdown.Header>
              <Dropdown.Item onClick={() => {setTutorial("bband"); setLightenCandlestick(true); setIndicatorChart(false)}}>Bollinger Band</Dropdown.Item>
              <Dropdown.Header>Support/Resistance</Dropdown.Header>
              <Dropdown.Item onClick={() => {setTutorial("pp"); setLightenCandlestick(true); setIndicatorChart(false)}}>Pivot Points</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={navigateCustom}>Create Tutorial</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item style={{color: "#6C757D"}} onClick={() => {setTutorial(null); setLightenCandlestick(false); setIndicatorChart(false)}}>Candlestick Chart</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          {tutorialHeader === "Candlestick Chart" ? 
            <div></div> :
            <Button style={{width: '100%', color: 'white', fontWeight: 'bold', marginTop: '10px'}} variant="primary" onClick={() => {setPerformance(!performance)}}> 
              Peformance
            </Button>
          }

        </SlidingPane>

        <div style={{overflowY: 'scroll', height: '80vh', clear: 'left', display:'block'}}>
          <StockChart specs={chartSpecs} indicatorChart={indicatorChart} indicatorChartLabel={indicatorChartLabel} 
            indicatorRange={indicatorRange} lightenCandlestick={lightenCandlestick} tutorial={tutorial} performance={performance} />
        </div>
      </div>
    );
}
  
export default Tutorial;