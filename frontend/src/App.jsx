import { useState } from 'react'
import './App.css'

function App() {
  const [ currSymbols, setCurrSymbols ] = useState([['','']])
  const [ currDays, setCurrDays ] = useState('')

  const addInput = (e) => {
    e.preventDefault()
    setCurrSymbols([...currSymbols, ['','']])
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
  
  const handleAnalyze = (e) => {
    e.preventDefault()
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
      <form onSubmit={addInput}>
        <button type="submit">Add Entry</button>
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
