// const mongoose = require('mongoose');
// const { MONGO_USER, MONGO_PASS, DB_String } = require('../config');
// const authOptions = { username: MONGO_USER, password: MONGO_PASS };
// const options = { useNewUrlParser: true, useUnifiedTopology: true, auth: authOptions };

// // Connecting to MongoDB using mongoose
// // MONGO_USER and MONGO_PASS are the credentials for MongoDB
// // DB_String is the MongoDB connection string
// // The options object contains the configuration for the connection
// // requestLogger is a custom middleware for logging HTTP requests
// // express is a web application framework for Node.js
// // mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js
// // logger is a HTTP request logger middleware for node.js
// // cors is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.

// mongoose.connect(DB_String, options);
// const conn = mongoose.connection;
// conn.once('connected', function () {
//   console.log(`Database::: Connected ${this.name}`);
// });

// conn.once('disconnected', function () {
//   console.log(`Database::: Disconnected ${this.name}`);
// });

// conn.on('error', (error) => {
//   console.log(`Database::: Error:::${JSON.stringify(error)}`);
// });

// process.on('SIGINT', async () => {
//   await conn.close();
//   console.log('MongoDB connection closed');
//   process.exit(0);
// });

// module.exports = conn;
