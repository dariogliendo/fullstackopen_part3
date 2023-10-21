const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
  },
  number: Number,
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
