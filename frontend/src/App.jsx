import { useState, useEffect} from 'react'
import { postRequest, getRequests, analyze, removeRequest }  from './services/requests'
import './App.css'
import Display from './Components/Display'

function App() {
  const [ currSymbols, setCurrSymbols ] = useState([['','', 'ex) bitcoin', 'ex) 0.2']])
  const [ currDays, setCurrDays ] = useState('')
  const [ requests, setRequests ] = useState([])
  const [ currScreen, setCurrScreen ] = useState(1)
  const [ analysis, setAnalysis ] = useState([])
  

    const updateHistory = async () => {
    const res = await getRequests()
    setRequests(res)
  }
  const exampleSymbols = [
    "bitcoin",
    "ethereum",
    "tether",
    "dogecoin",
    "chainlink",
    "polkadot",
    "uniswap",
    "stellar",
    "litecoin",
    "binancecoin",
    "cardano",
    "tron",
    "avalanche",
    "dai"
  ]

  useEffect(() => {
    async function updateAtStart(){
      await updateHistory()
    }
    updateAtStart()
}, [])

  const handleInput = (e, add) => {
    e.preventDefault()
    if(add){
      const randomCoin = exampleSymbols[Math.floor(Math.random() * exampleSymbols.length)]
      const randomAmt = (Math.random() * 5).toFixed(3)
      setCurrSymbols([...currSymbols, ['', '', `ex) ${randomCoin}`, `ex) ${randomAmt}`]])
    } else{
      setCurrSymbols(currSymbols.slice(0, -1))
    }
  }

  const changeSymb = (e, ind) => {
    let newSymbs = [...currSymbols]
    newSymbs[ind][0] = e.target.value
    setCurrSymbols(newSymbs)
  }

  const changeOwned = (e, ind) => {
    let newSymbs = [...currSymbols]
    newSymbs[ind][1] = e.target.value
    setCurrSymbols(newSymbs)
  }

  const updateDays = (e) => {
    setCurrDays(e.target.value)
  }
  
  const handleAnalyze = async (e) => {
    e.preventDefault()
    if(currSymbols.length == 0 || currDays == ''){
      console.log('Empty query')
      return
    }
    const postRes = await postRequest(currDays, currSymbols)
    if(postRes == null){
      console.log('Not a symbol')
      return
    } 
    await updateHistory()
    updateDisplay(postRes.requestId)
  }

  const updateDisplay = async (id) => {
    console.log(id)
    const resAnalysis = await analyze(id)
    setAnalysis(resAnalysis)
    setCurrScreen(2)
  }

  const requestTooltip = (req) => {
    const coinsText = req.coins
      .map((coin) => `${coin.symbol}: ${coin.amt}`)
      .join(', ')
    return `Days: ${req.days}\nCoins: ${coinsText}`
  }

  const removeReq = async (reqId) => {
    await removeRequest(reqId)
    await updateHistory()
  }

  const renderHistory = () => {
    return (
      <section className="history-card">
      <h2 className="section-title">History</h2>
      {
        requests.map(req => (
          <span className="history-item" key={req.request_id}>
            <span className="history-actions">
              <button
                className="history-button"
                title={requestTooltip(req)}
                onClick={() => updateDisplay(req.request_id)}
              >
                request {req.request_id}
              </button>
              <button
                className="history-remove-button"
                title={`Remove request ${req.request_id}`}
                aria-label={`Remove request ${req.request_id}`}
                onClick={() => removeReq(req.request_id)}
              >
                ✖
              </button>
            </span>
            <span className="history-tooltip">{requestTooltip(req)}</span>
          </span>
        ))
      }
      </section>
    )
  }

  const handleHome = (e) => {
    e.preventDefault()
    setCurrSymbols([['','', 'ex) bitcoin', 'ex) 0.2']])
    setCurrDays('')
    setCurrScreen(1)
  }

  if (currScreen == 1){
    return (
        <main className="app-shell">
        <h1 className="app-title"> Crypto Portfolio Risk Dashboard </h1>
        <section className="panel-card">
          <h2 className="section-title"> Enter Coin Symbol & Amount Held </h2>
        {
              currSymbols.map((input, ind) => {
                  return(
                      <div className="input-row" key={ind}>
                        <input className="input-field" placeholder={currSymbols[ind][2]} type="text" value={currSymbols[ind][0]} onChange={(e) => changeSymb(e, ind)}/>
                        <input className="input-field" placeholder={currSymbols[ind][3]} type="number" min="0" step="any" value={currSymbols[ind][1]} onChange={(e) => changeOwned(e, ind)}/>
                      </div>
                  )
              })
          }
        <div className="button-row">
        <form onSubmit={(e) => handleInput(e, true)}>
          <button className="button-secondary" type="submit">Add Entry</button>
        </form>
        <form onSubmit={(e) => handleInput(e, false)}>
          <button className="button-secondary" type="submit">Remove Entry</button>
        </form>
        </div>
        </section>
        <section className="panel-card">
          <h2 className="section-title"> How Many Days To Analyze </h2>
          <input className="input-field days-input" type="number" min="1" value={ currDays } onChange={updateDays}/>
          <div className="analyze-row">
            <button className="button-primary" onClick={handleAnalyze} >Analyze</button>
          </div>
        </section>
        {renderHistory()}
        </main>
    )}
  else{
    return (
      <main className="app-shell">
      <div className="results-grid">
        { analysis.map(coin => <Display key={coin.symbol} coin={coin}/>) }
      </div>
      <div className="new-query-row">
      <form onSubmit={handleHome} >
        <button className="button-primary" type="submit">New Query</button>
      </form>
      </div>
      {renderHistory()}
      </main>
    )
  }

}

export default App
