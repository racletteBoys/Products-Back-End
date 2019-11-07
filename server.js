require('newrelic');
const fastify = require('fastify');
// const express = require('express');
const bodyParser = require('body-parser');
// const routes = require('./routes');

const app = fastify();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.register(require('./routes'), { prefix: '/products' });

const start = async () => {
  await app.listen(3000);
  console.log('listening on port 3000');
}

start();

