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

app.get('/api/persons', (req, res, next) => {
  const filter = req.query || {}
  Person.find(filter)
    .then(persons => {
      res.status(200).send(persons)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (!person) return res.status(404).end()
      res.status(200).send(person)
    })
    .catch(error => next(error))
})

app.get('/info', (req, res, next) => {
  Person.count()
    .then(count => {
      res.send(`Phonebook has information for ${count} people.<br/>${new Date()}`)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  if (!req.body || !req.body.name || !req.body.number) next(new Error('Request requirements not met'))
  const newPerson = new Person({
    name: req.body.name,
    number: req.body.number
  })

  newPerson.save()
    .then(result => {
      res.status(200).send(result)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  if (!req.body.name && !req.body.number) return next(new Error("No data to update has been provided"))
  const person = {
    name: req.body.name,
    number: req.body.number
  }
  Person.findByIdAndUpdate(req.params.id, person, {new: true, runValidators: true})
    .then(person => {
      res.send(person)
    }).catch(error => next(error))
})

app.use((error, req, res, next) => {
  console.log(error)
  if (error.name === 'CastError' || error.name === 'ValidationError') {
    return res.status(400).json({ error: error })
  }
  if (error instanceof Error) {
    return res.status(400).json({error: {message: error.message}})
  }

  next(error)
})

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Mongo connected to ' + MONGODB_URI)
  }).catch(() => {
    console.log('Failed to connect to database')
  })

app.listen(PORT, () => console.log(`Server listening at ${PORT}`))