

import './App.css'

import queries from './lib-isql/examples/query.ts'
import Table from './components/Table/Table.tsx'
import { useState } from 'react'

function App() {

  const [crnt, setCrnt] = useState(0)

  const name = Object.keys(queries)[crnt]
  const code = queries[name]


  const nextQuery = () =>{
    let next = crnt + 1
    next = next > Object.keys(queries).length-1 ? 0 : next
    setCrnt(next)
  }

  const prevQuery = () =>{
    let prev = crnt - 1
    prev = prev < 0 ? Object.keys(queries).length-1 : prev
    setCrnt(prev)
  }
  
  const style = {
    padding:"5px 25px",
    marginRight:"10px",
    fontSize:"1.25rem"
  }

  console.clear()
  console.log("name: ",name)
  console.log("code: ",code)

  return (
    <>
      <button style={{...style}} onClick={prevQuery}>Previous</button>
      <button style={{...style}} onClick={nextQuery}>Next</button>
      <br/>
      <br/>
      <br/>
      <div style={{fontSize:"1.5rem"}}>{crnt+1} / {Object.keys(queries).length} </div>
      <br/>
      <Table qry={code} name={name} />
      <br/>
    </>
  )
}

export default App
