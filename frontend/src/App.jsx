import { useState, useEffect } from 'react'
import { postRequest, getRequests }  from './services/requests'
import './App.css'

function App() {
  const [ currSymbols, setCurrSymbols ] = useState([['','']])
  const [ currDays, setCurrDays ] = useState('')
  const [ requests, setRequests ] = useState([])

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
    const postRes = await postRequest(currDays, currSymbols)
    const req = JSON.parse(postRes)
    console.log(req)
  }

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
  )
}

export default App
