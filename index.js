const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(express.json())
app.use(morgan('tiny'));
app.use(cors())
 


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

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
    const numOfPeople = persons.length;
    const currentTime = new Date();

    console.log(numOfPeople)
    console.log(currentTime)

    response.send(`
        <h3>Phonebook has info for ${numOfPeople} people</h3>
        <p>${currentTime}</p>
    `);
});

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if(person) {
        response.json(person)
    } else {
        console.log('x')
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id 
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})


const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return maxId + 1
  }

  app.post('/api/persons', (request, response) => {
    const body = request.body 

    if (!body.name || !body.number) {
        return response.status(400).json({ error: "name or number is missing" });
    }

    const nameExists = persons.some(person => person.name === body.name);
    if (nameExists) {
        return response.status(400).json({ error: "name must be unique" });
    }
    
    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    };

    persons = persons.concat(person)

    response.json(person);

  });

const PORT = 3001 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})