const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());\

app.use('/products', routes);

app.listen('3000', () => {
  console.log('listening on port 3000');
});
