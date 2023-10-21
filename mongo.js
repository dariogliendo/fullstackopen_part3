const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://darioliendo:${password}@cluster0.7ki54sj.mongodb.net/?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length < 4) {
  Person.find({})
    .then((phonebook) => {
      console.log('Phonebook:');
      phonebook.forEach((person) => {
        console.log(`${person.name} - ${person.number}`);
      });
      mongoose.connection.close();
    }).catch((err) => {
      console.error(err);
      mongoose.connection.close();
    });
} else {
  if (!process.argv[3] || !process.argv[4]) {
    console.log('Insufficient data to create new person');
    mongoose.connection.close();
  }
  const newPerson = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  newPerson.save()
    .then((person) => {
      console.log(`New person ${person.name} has been created.`);
      mongoose.connection.close();
    }).catch((err) => {
      console.error(err);
      mongoose.connection.close();
    });
}
