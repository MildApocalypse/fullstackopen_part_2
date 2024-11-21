import { useState, useEffect } from 'react'

import phonebook from '../services/phonebook'


//================COMPONENTS==================//

const Notification = ({message, type}) => {
  if(message === null){
    return null
  }
  
  return (
    <div className={type}>
      {message}
    </div>
  )
}

const Person = ({person, handleDelete}) => {
  console.log(`rendering person ${person.id}`);
  
  return(
    <li>
      {person.name} {person.number} 
      <button onClick={handleDelete}>delete</button>
    </li>
  )
}

const InputField = ({label, value, handler}) =>{
  return(
    <>
      {label}<input value={value} onChange={handler}/>
    </>
  )
}

const AddForm = ({newName, newNumber, handleNameInput, handleNumberInput, submitPerson}) => {
  return(
    <form>
      <div>
        <InputField label='name: ' value={newName} handler={handleNameInput}/>
      <br/>
        <InputField label='number: ' value={newNumber} handler={handleNumberInput}/>
      </div>
      <div>
        <button type="submit" onClick={submitPerson}>add</button>
      </div>
    </form>
  )
}

//================FUNCTIONS==================//

const nameExists = (persons, newName) => {
  return persons.find(person => { return person.name === newName})
}

const filterPeople = (persons, filterValue) => {
  const val = filterValue.toLowerCase()
  const filtered = persons.filter((person)=>person.name.toLowerCase().search(val) >= 0)
  return filtered
}

const addPerson = (persons, newPerson, setPersons) => {
  phonebook    
    .create(newPerson)    
    .then(response => {      
      setPersons(persons.concat(response.data))
    })
}

const updatePerson = (id, newPerson, setPersons, setNote, setNotifType) => {
  phonebook
    .update(id, newPerson)
    .then( () => {
      setNotifType('notif')
      notify(`${newPerson.name} was successfully updated.`, 5000, setNote)

      phonebook
      .getAll()
      .then(response => {setPersons(response.data)})
    })
    .catch(error => {
      setNotifType('error')
      notify(`${newPerson.name} no longer exists in database.`, 5000, setNote)

      phonebook
      .getAll()
      .then(response => {setPersons(response.data)})
    })
}

const resetFields = (setters) => {
  setters.forEach(setter => {
    setter('')
  })
}

const notify = (message, time, setNote) => {
  setNote(message)
  setTimeout(() => {
    setNote(null)
  }, time)

}

const App = () => {
  console.log("Starting app component")
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterValue, setFilter] = useState('')
  const [notification, setNote] = useState(null)
  const [notifType, setNotifType] = useState('notif')

  useEffect(() => {
    phonebook
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const handleNameInput = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberInput = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilterInput = (event) => {
    setFilter(event.target.value)
  }
  const handleDelete = (person) =>{
    if(window.confirm(`Delete ${person.name}?`)){
      phonebook
        .remove(person.id)
        .then(() => {
          phonebook
            .getAll()
            .then(response => {
              setPersons(response.data)
            })
        })
    }
  }

  const submitPerson = (event) =>{
    event.preventDefault()    
    const newPerson = {name: newName, number: newNumber}

    const p = nameExists(persons, newName)

    if(!p){
      addPerson(persons, newPerson, setPersons)
      resetFields([setNewName,setNewNumber,setFilter])
      setNotifType('notif')
      notify(`${newPerson.name} was successfully added to phonebook.`, 5000, setNote)
    }
    else{
      if(window.confirm(`${newName} is already added to phonebook. would you like to update their phone number?`)){
        updatePerson(p.id, newPerson, setPersons, setNote, setNotifType)
        resetFields([setNewName,setNewNumber,setFilter])
      }
    }
  }

  const personsDisplay = (filterValue === '')? persons : filterPeople(persons, filterValue)

  return (
    <div>
      <h2>Phonebook</h2>
        <div>
          <InputField label='filter: ' value={filterValue} handler={handleFilterInput}/>
        </div>
      <h2>Add New Person</h2>
        <AddForm newName={newName} newNumber={newNumber} handleNameInput={handleNameInput} 
        handleNumberInput={handleNumberInput} submitPerson={submitPerson}/>
      <h2>Numbers</h2>
      <Notification message={notification} type={notifType}/>
      <ul>
        {personsDisplay.map((person) =>
        <Person key={person.name} person={person} handleDelete={()=>handleDelete(person)}/>)}
      </ul>
    </div>
  )
}

export default App