const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
  },
  number: {
    type: String,
    minLength: 8,
    validate: [
      {
        validator: (value) => {
          const parts = value.split('-');
          return parts.length === 2;
        },
        message: 'Invalid format for phone number. Separate number parts using "-"',
      },
      {
        validator: (value) => {
          const parts = value.split('-');
          return parts[0].length >= 2 && parts[0].length <= 3;
        },
        message: (v) => `${v.value} is not a valid phone number`,
      },
    ],
  },
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    const returned = returnedObject;
    returned.id = document._id.toString();
    delete returned._id;
    delete returned.__v;
  },
});

module.exports = mongoose.model('Person', personSchema);
