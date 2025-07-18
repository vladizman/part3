require('dotenv').config()
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Usage: node script.js <password> <name> <number>')
  process.exit(1)
}

// Password from CLI argument (unused, but kept for context)
//const password = process.argv[2]

mongoose.set('strictQuery', false)
mongoose.connect(process.env.url)

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    required: true
  }
})

const Person = mongoose.model('Person', personSchema)

// Example: Add person (commented out)
/*
const name = process.argv[3]
const number = process.argv[4]

const person = new Person({
  name: name,
  number: number
})

person.save().then(() => {
  console.log(`added '${name}', phone number '${number}' to the phonebook`)
  mongoose.connection.close()
})
*/

Person.find({}).then((result) => {
  result.forEach((person) => {
    console.log(person)
  })
  mongoose.connection.close()
})
