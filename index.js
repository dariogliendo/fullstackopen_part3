const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

morgan.token('body', (req) => {
  if (req.method === 'POST') return JSON.stringify(req.body)
  return ''
})

const app = express()
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
const PORT = process.env.PORT || 3001

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

app.post('/api/persons', (req, res) => {
  if (!req.body.name || !req.body.number) return res.status(400).json({error: "Request requirements not met"})
  if (data.some(x => x.name === req.body.name)) return res.status(400).json({error: 'Name must be unique'})
  const newPerson = {
    name: req.body.name,
    number: req.body.number,
    id: Math.floor(Math.random() * 100000000)
  }
  data.push(newPerson)
  res.status(200).send(newPerson)
})

app.delete('/api/persons/:id', (req, res) => {
  data = data.filter(x => x.id !== Number(req.params.id))
  res.status(204).end()
})

app.listen(PORT, () => console.log(`Server listening at ${PORT}`))