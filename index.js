const express = require('express')

const app = express()
const PORT = 8001

let data = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (req, res) => {
  res.send(data)
})

app.get('/api/persons/:id', (req, res) => {
  const person = data.find(x => x.id === Number(req.params.id))
  if (!person) return res.status(404).end()
  res.send(person)
})

app.get('/info', (req, res) => {
  res.send(`Phonebook has information for ${data.length} people.<br/>${new Date()}`)
})

app.delete('/api/persons/:id', (req, res) => {
  data = data.filter(x => x.id !== Number(req.params.id))
  res.status(204).end()
})

app.listen(PORT, () => console.log(`Server listening at ${PORT}`))