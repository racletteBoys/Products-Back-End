const db = require('../database');

const getProduct = id => {
  db.query('SELECT * FROM products WHERE id = $1', [id]).then(({ rows }) => {
    const product = rows[0];
    db.query('SELECT * FROM features WHERE product_id = $1', [id]).then(
      ({ rows }) => {
        product.features = rows;
        return product;
      }
    );
  });
};

const getStyles = async productId => {
  const styles = (await db.query('SELECT * FROM styles WHERE product_id = $1', [
    productId,
  ])).rows;
  for (const style of styles) {
    style.photos = (await db.query('SELECT * FROM photos WHERE style_id = $1', [
      style.id,
    ])).rows;
  }
  return styles;
};

const getRelated = async productId => {
  const related = (await db.query(
    'SELECT * FROM related WHERE current_product_id = $1',
    [productId]
  )).rows;
  console.log('related: ', related);
  //   const relatedIds = [];
  //   for (const record of related) {
  //     relatedIds.push(record.related_product_id);
  //   }
};
getRelated(4);
