import { StockChart } from '../components/stockchart/StockChart'
import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import ToggleButton from 'react-bootstrap/ToggleButton';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useNavigate} from 'react-router-dom';
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import { List } from 'react-bootstrap-icons';
import Form from 'react-bootstrap/Form';
import SidePanelCustomForm from '../components/SidePanelCustomForm';
import * as daily from '../stock-data/new/daily/';
// import * as hourly from '../stock-data/new/hourly/';

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

    const [stock, setStock] = useState('AAPL')
    const [stockData, setStockData] = useState(daily.AAPL)

    const [tutorial, setTutorial] = useState(null)
    const [lightenCandlestick, setLightenCandlestick] = useState(false)
    const [indicatorChart, setIndicatorChart] = useState(false)
    const [performance, setPerformance] = useState(false)

    const [stopLoss, setStopLoss] = useState("Stop Loss (%)")
    const [takeProfit, setTakeProfit] = useState("Take Profit (%)")

    // default parameters for tutorial
    const [paramData, setParamData] = useState({
      sma: {short:7, long:14},
      ema: {short:7, long:14},
      rsi: {period:14, overbought:70, oversold:30},
      macd: {short:12, long:26, signal:9},
      bband: {period:7, stdDev:2}
    })

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
          <h2 style={{float: 'left', width: '80%', paddingLeft: '30px'}}>{tutorialHeader}</h2>
          <Dropdown style={{float: 'left', marginLeft:'75px'}}>
            <Dropdown.Toggle style={{backgroundColor:'#F9F9F9', color: 'black', fontWeight: 'bold', height:'40px', width: '90px'}} variant="secondary">
              {stock}
            </Dropdown.Toggle>
            <Dropdown.Menu style={{minWidth: '90px'}}>
              <Dropdown.Item  onClick={() => {setStock('AAPL'); setStockData(daily.AAPL)}}>AAPL</Dropdown.Item>
              <Dropdown.Item  onClick={() => {setStock('MSFT'); setStockData(daily.MSFT)}}>MSFT</Dropdown.Item>
              <Dropdown.Item  onClick={() => {setStock('AMZN'); setStockData(daily.AMZN)}}>AMZN</Dropdown.Item>
              <Dropdown.Item  onClick={() => {setStock('NVDA'); setStockData(daily.NVDA)}}>NVDA</Dropdown.Item>
              <Dropdown.Item  onClick={() => {setStock('TSLA'); setStockData(daily.TSLA)}}>TSLA</Dropdown.Item>
              <Dropdown.Item  onClick={() => {setStock('GOOGL'); setStockData(daily.GOOGL)}}>GOOGL</Dropdown.Item>
              <Dropdown.Item  onClick={() => {setStock('GOOG'); setStockData(daily.GOOG)}}>GOOG</Dropdown.Item>
              <Dropdown.Item  onClick={() => {setStock('BRK-B'); setStockData(daily.BRKB)}}>BRK-B</Dropdown.Item>
              <Dropdown.Item  onClick={() => {setStock('JNJ'); setStockData(daily.JNJ)}}>JNJ</Dropdown.Item>
              <Dropdown.Item  onClick={() => {setStock('XOM'); setStockData(daily.XOM)}}>XOM</Dropdown.Item>
              <Dropdown.Item  onClick={() => {setStock('JPM'); setStockData(daily.JPM)}}>JPM</Dropdown.Item>
              <Dropdown.Item  onClick={() => {setStock('META'); setStockData(daily.META)}}>META</Dropdown.Item>
              <Dropdown.Item  onClick={() => {setStock('V'); setStockData(daily.V)}}>V</Dropdown.Item>
              <Dropdown.Item  onClick={() => {setStock('PG'); setStockData(daily.PG)}}>PG</Dropdown.Item>
              <Dropdown.Item  onClick={() => {setStock('MA'); setStockData(daily.MA)}}>MA</Dropdown.Item>
              <Dropdown.Item  onClick={() => {setStock('HD'); setStockData(daily.HD)}}>HD</Dropdown.Item>
              <Dropdown.Item  onClick={() => {setStock('CVX'); setStockData(daily.CVX)}}>CVX</Dropdown.Item>
              <Dropdown.Item  onClick={() => {setStock('ABBV'); setStockData(daily.ABBV)}}>ABBV</Dropdown.Item>
              <Dropdown.Item  onClick={() => {setStock('MRK'); setStockData(daily.MRK)}}>MRK</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Button style={{float: 'right', marginRight: '30px', marginLeft: '0px', backgroundColor:'#F9F9F9', color: 'black', height:'40px'}} variant="secondary" onClick={() => setPane({ isPaneOpen: true })}>
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
            <Dropdown.Toggle style={{padding: '5px 10px', marginBottom: '10px', textAlign: 'left', backgroundColor:'#F9F9F9', color: 'black', width: "100%"}} variant="secondary">
              {tutorialHeader === "Candlestick Chart" ? "Technical Indicator" : tutorialHeader.replace(" Trade Performance", "")}
            </Dropdown.Toggle>
            <Dropdown.Menu style={{width: "100%"}}>
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

          <SidePanelCustomForm tutorial={tutorial} paramData={paramData} setParamData={setParamData}></SidePanelCustomForm>

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
          
          {tutorialHeader === "Candlestick Chart" ? 
            <div></div> :
            <ToggleButton style={{width: '100%', fontWeight: 'bold'}} type="checkbox" variant="outline-primary" onClick={() => {setPerformance(!performance)}} checked={!performance} > 
              Peformance
            </ToggleButton>
          }

        </SlidingPane>

        <div style={{overflowY: 'scroll', height: '80vh', clear: 'left', display:'block'}}>
          <StockChart specs={chartSpecs} indicatorChart={indicatorChart} indicatorChartLabel={indicatorChartLabel} indicatorRange={indicatorRange} lightenCandlestick={lightenCandlestick} 
          stockData={stockData} tutorial={tutorial} paramData={paramData} performance={performance} stopLoss={stopLoss} takeProfit={takeProfit}/>
        </div>
      </div>
    );
}
  
export default Tutorial;