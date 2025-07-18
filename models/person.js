require('dotenv').config()
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const url = process.env.url
console.log('connecting to', url)

mongoose
  .connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const phoneNumberValidator = (value) => {
  // Must match: 2 or 3 digits + hyphen + at least 5 digits
  return /^\d{2,3}-\d+$/.test(value)
}

const PersonSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: {
      validator: phoneNumberValidator,
      message: (props) =>
        `${props.value} is not a valid phone number! Must be in format NN-NNNNNN or NNN-NNNNNN`
    }
  }
})

PersonSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', PersonSchema)
