const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

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

//get persons by id
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
  .then((person) => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch((error) => next(error))
})

//PUT update a persons number by id

app.put('/api/persons/:id', (request, response, next) => {
  const {name, number} = request.body;

  const updatePerson = {
    name, 
    number 
  };
  Person.findByIdAndUpdate(
    request.params.id,
    updatePerson, 
    {new: true, runValidators: true, context: 'query'}

  )
  .then(updated => {
    if (updated) {
      response.json(updated)
    } else {
      response.json(404).end();
    }
  })
  .catch(error => next(error))
});

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

//DELETE A NUMBER
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end()
    })
    .catch((error) => next(error))
 })

 const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};


/*const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return maxId + 1
  }*/

  //Post a new number
  app.post('/api/persons', (request, response, next) => {
    const body = request.body 

    const person = new Person ({
      name: body.name,
      number: body.number
    }) 

    person.save().then((savedPerson) => {response.json(savedPerson)})
    .catch(error => next(error))
  });

  app.use(unknownEndpoint);
  app.use(errorHandler)


const PORT = process.env.PORT || 3002 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})