const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

app.use(express.json())
app.use(morgan('tiny'));
app.use(cors())
app.use(express.static('dist'))
 
let persons = []

morgan.token('info', (req) => {
  if(req.method === 'POST') {
    const name = req.body.name || 'N/A';
    const number = req.body.number || 'N/A';
    return `name: ${name}, number: ${number}`;
  }
  return '';
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :info'));

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})
//get persons
app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

app.get('/info', async (request, response) => {
  try {
    const count = await Person.countDocuments({})
    const currentTime = new Date()

    response.send(`
      <h3>Phonebook has info for ${count} people</h3>
      <p>${currentTime}</p>
    `)
  } catch (error) {
    console.error('Failed to count persons:', error)
    response.status(500).send('Internal server error')
  }
})

//GET PERSON BY ID
app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person)
  })
})
//DELETE A NUMBER
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
 })



/*const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return maxId + 1
  }*/

  //Post a new number
  app.post('/api/persons', (request, response) => {
    const body = request.body 

    if (!body.name || !body.number) {
      return response.status(400).json({ error: 'name or number missing' })
    }
    

    const person = new Person({
      name: body.name,
      number: body.number
    })

    person.save().then((savedPerson) => {response.json(savedPerson)})

  });

  /*const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }*/

const PORT = process.env.PORT || 3002 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})