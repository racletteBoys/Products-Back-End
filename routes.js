const routes = require('express').Router();
const product = require('./models/index');

routes.get('/list', () => {});

routes.get('/:product_id', () => {});

routes.get('/:product_id/styles', () => {});

routes.get('/:product_id/related', () => {});

module.exports = routes;
