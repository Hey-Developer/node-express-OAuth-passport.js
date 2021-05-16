const mongoose = require("mongoose");

//@ Constants Variables
const dbPass = process.env.DB_PASS;
const dbName = process.env.DB_NAME;

const connectionString = `mongodb+srv://cloves09:${dbPass}@node-oauth-passport.ijrob.mongodb.net/${dbName}?retryWrites=true&w=majority`;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

//@ Database class for connection
class Database {
  constructor() {
    this._connect();
  }

  _connect() {
    mongoose
      .connect(connectionString, options)
      .then(() => {
        console.log(`MongoDb Atlas Connection Establish Successfully`);
      })
      .catch((error) => {
        console.log(`MongoDb Atlas Connection Failed: ${error.message}`);
      });
  }
}

module.exports = new Database();
