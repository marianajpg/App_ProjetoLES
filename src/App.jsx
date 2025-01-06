//Junção de todos os componentes

import './App.css'

import {state, useState} from 'react'
import Input from './components/Input'


export default function App() {
  const [valueName, setValueName] = useState("")
  const [valueSurname, setValueSurname] = useState("")

  function handleNameChange(event){
    setValueName(event.target.value)
  }
  return (
    <>
      <Input
        type="text"
        value={valueName}
        onChange= {handleNameChange}
      />
      <Input
        type="text"
        value={valueSurname}
        onChange= {(event) => setValueSurname(event.target.value)}
      />

      <h1>{valueName} {valueSurname}</h1>
    </>
  )
}
