const mongoose = require('mongoose')

if (process.argv.length < 5) {
    console.log('Usage: node script.js <password> <name> <number>')
    process.exit(1)
  }

const password = process.argv[2]

const name = process.argv[3]

const number = process.argv[4]

const url = `mongodb+srv://vladizmanq:${password}@cluster0.u9rlp7f.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  })

  const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(result => {
    console.log(`added '${name}', phonenumber '${number}' to the phonebook`)
    mongoose.connection.close()
  })

/*Note.find({}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })*/