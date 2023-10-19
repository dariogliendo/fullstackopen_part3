const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./models/person')

require('dotenv').config()
const PORT = process.env.PORT || 3001
const MONGODB_URI = process.env.MONGODB_URI

morgan.token('body', (req) => {
  if (req.method === 'POST') return JSON.stringify(req.body)
  return ''
})


const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (req, res) => {
  const filter = req.query || {}
  Person.find(filter)
    .then(persons => {
      res.status(200).send(persons)
    })
    .catch(error => {
      res.status(500).json({ error: error })
    })
})

app.get('/api/persons/:id', (req, res) => {
  if (!req.params.id) return res.status(500).json({ error: "Must provide a valid ID to use this endpoint" })
  Person.findById(req.params.id)
    .then(person => {
      if (!person) return res.status(404).end()
      res.status(200).send(person)
    })
    .catch(error => {
      res.status(500).json({ error: error })
    })
})

app.get('/info', (req, res) => {
  Person.count()
    .then(count => {
      res.send(`Phonebook has information for ${count} people.<br/>${new Date()}`)
    })
    .catch(error => {
      res.status(500).json({
        message: 'Failed to get phonebook information',
        error: error
      })
    })
})

app.post('/api/persons', (req, res) => {
  if (!req.body || !req.body.name || !req.body.number) return res.status(500).json({ error: 'Request requirements not met' })
  const newPerson = new Person({
    name: req.body.name,
    number: req.body.number
  })

  newPerson.save()
    .then(result => {
      res.status(200).send(result)
    })
    .catch(error => {
      res.status(500).json({
        message: 'Failed to create a new phonebook entry',
        error: error
      })
    })
})

app.delete('/api/persons/:id', (req, res) => {
  if (!req.params.id) return res.status(500).json({error: "Must provide a valid ID to use this endpoint"})
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => {
      res.status(500).json({error: error})
    })
})

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Mongo connected to ' + MONGODB_URI)
  }).catch(() => {
    console.log('Failed to connect to database')
  })

app.listen(PORT, () => console.log(`Server listening at ${PORT}`))