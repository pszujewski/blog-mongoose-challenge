const express = require('express');
const morgan = require('morgan'); 
const mongoose = require('mongoose');
require('dotenv').config();

const {blogPostRouter} = require('./blogPostRouter');

mongoose.Promise = global.Promise;

const app = express();

app.use(morgan('common'));
app.use('/posts', blogPostRouter);


let server;
function runServer() {
  const DATABASE_URL = process.env.DATABASE_URL;
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    mongoose.connect(DATABASE_URL, error => {
      if(error) {
        return reject(error);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`)
        resolve();
      }).on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}


function closeServer() {
  return new Promise((resolve, reject) => {
    console.log('Closing server');
    server.close(err => {
      if (err) {
        reject(err);
        // so we don't also call `resolve()`
        return;
      }
      resolve();
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};
