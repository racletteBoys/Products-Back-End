// const routes = require('express').Router();
const product = require('./models/index');
const redis = require('redis');

const REDIS_PORT = 6379;
const client = redis.createClient(REDIS_PORT);

// function productCache(req, res, next) {
//   client.get('product', (err, data) => {
//     if (err) throw err;
//     if (data !== null) {
//       res.send(data);
//     } else next();
//   })
// }

function styleCache(req, res, next) {
  client.get('style', (err, data) => {
    if (err) throw err;
    if (data !== null) {
      res.send(data);
    } else next();
  })
}

// function relatedCache(req, res, next) {
//   client.get('related', (err, data) => {
//     if (err) throw err;
//     if (data !== null) {
//       res.send(data);
//     } else next();
//   })
// }

module.exports = function(routes, options, done) {
  
  routes.get('/suckit', (req, res) => {
    res.send('SUCK IT!');
  });
  
  routes.get('/list', async (req, res) => {
    const page = req.query.page || 1;
    const count = req.query.count || 5;
    const result = await product.getProductList(page, count);
    res.send(result);
  });
  
  routes.get('/:product_id', async (req, res) => {
    const result = await product.getProduct(req.params.product_id);
    res.send(result);
  });
  
  routes.get('/:product_id/styles', {onRequest: styleCache}, async (req, res) => {
    const result = await product.getStyles(req.params.product_id);
    client.setex('style', 60, JSON.stringify(result));
    res.send(result);
  });
  
  routes.get('/:product_id/related', async (req, res) => {
    const result = await product.getRelated(req.params.product_id);
    res.send(result);
  });
  
  routes.post('/', async (req, res) => {
    const result = await product.addProduct(req.body);
    res.send(result);
  });
  
  routes.patch('/:product_id', async (req, res) => {
    const result = await product.updateProduct(req.params.product_id, req.body);
    res.send(result);
  });
  
  routes.delete('/:product_id', async (req, res) => {
    const result = await product.removeProduct(req.params.product_id);
    res.send(result);
  });
  
  routes.post('/:product_id/styles', async (req, res) => {
    const result = await product.addStyle(req.params.product_id, req.body);
    res.send(result);
  });

  done();

};



