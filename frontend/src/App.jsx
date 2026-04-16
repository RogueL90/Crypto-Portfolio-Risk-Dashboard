import { useState, useEffect } from 'react'
import { postRequest, getRequests, analyze}  from './services/requests'
import './App.css'
import Display from './Components/Display'

function App() {
  const [ currSymbols, setCurrSymbols ] = useState([['','']])
  const [ currDays, setCurrDays ] = useState('')
  const [ requests, setRequests ] = useState([])
  const [ currScreen, setCurrScreen ] = useState(1)
  const [ analysis, setAnalysis ] = useState([])

  useEffect(() => {
    async function getReqAtStart(){
    const res = await getRequests()
    console.log(res)
    setRequests(res)
    }
    getReqAtStart()
}, [])

  const handleInput = (e, add) => {
    e.preventDefault()
    if(add){
      setCurrSymbols([...currSymbols, ['','']])
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
    if(currSymbols == '' || currDays == ''){
      console.log('Empty query')
      return
    }
    const postRes = await postRequest(currDays, currSymbols)
    if(postRes == null){
      console.log('Not a symbol')
      return
    } 

    const req = postRes
    const resAnalysis = await analyze(req.requestId)
    setAnalysis(resAnalysis)
    console.log(resAnalysis)
    setCurrScreen(2)
  }

  const handleHome = (e) => {
    e.preventDefault()
    setCurrScreen(1)
  }

  if (currScreen == 1){
    return (
        <>
        <h1> Crypto Portfolio Risk Dashboard </h1>
        <div>
          <h2> Enter Coin ID & Amount Held </h2>
        {
              currSymbols.map((input, ind) => {
                  return(
                      <div key={ind}>
                        <input placeholder='ex) bitcoin' type="text" value={currSymbols[ind][0]} onChange={(e) => changeSymb(e, ind)}/>
                        <input placeholder='ex) 0.2' type="number" min="0" step="any" value={currSymbols[ind][1]} onChange={(e) => changeOwned(e, ind)}/>
                      </div>
                  )
              })
          }
        <form onSubmit={(e) => handleInput(e, true)}>
          <button type="submit">Add Entry</button>
        </form>
        <form onSubmit={(e) => handleInput(e, false)}>
          <button type="submit">Remove Entry</button>
        </form>
        </div>
        <div>
          <h2> How Many Days To Analyze </h2>
          <input type="number" min="1" value={ currDays } onChange={updateDays}/>
        </div>
        <div>
        <button onClick={handleAnalyze} >Analyze</button>
        </div>
        </>
    )}
  else{
    return (
      <>
      <div>
        { analysis.map(coin => <Display key={coin.symbol} coin={coin}/>) }
      </div>
      <div>
      <form onSubmit={handleHome} >
        <button type="submit">New Query</button>
      </form>
      </div>
      </>
    )
  }

}

export default App
