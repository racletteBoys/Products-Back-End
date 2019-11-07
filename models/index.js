const db = require('../database');

const getProductList = async (page, count) => {
  const idEnd = page * count;
  const idBegin = idEnd - count + 1;
  const result = (await db.query(
    'SELECT * FROM products WHERE id BETWEEN $1 and $2',
    [idBegin, idEnd]
  )).rows;
  return result;
};

const getProduct = id =>
  db.query('SELECT * FROM products WHERE id = $1', [id]).then(({ rows }) => {
    const product = rows[0];
    return db
      .query('SELECT * FROM features WHERE product_id = $1', [id])
      .then(({ rows }) => {
        product.features = rows;
        return product;
      });
  });

const getStyles = async productId => {
  const styles = (await db.query('SELECT * FROM styles WHERE product_id = $1', [
    productId,
  ])).rows;
  for (const style of styles) {
    style.photos = (await db.query('SELECT url, thumbnail_url FROM photos WHERE style_id = $1', [
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
  const relatedIds = [];
  for (const record of related) {
    relatedIds.push(record.related_product_id);
  }
  return relatedIds;
};

const addProduct = product => {
  const values = [
    product.name,
    product.slogan,
    product.description,
    product.category,
    product.default_price,
  ];
  return db.query(
    'INSERT INTO products(id, name, slogan, description, category, default_price) VALUES(DEFAULT, $1, $2, $3, $4, $5)',
    values
  );
};

const updateProduct = (productId, product) =>
  db.query(
    'UPDATE products SET name = COALESCE($1, name), slogan = COALESCE($2, slogan), description = COALESCE($3, description), category = COALESCE($4, category), default_price = COALESCE($5, default_price) WHERE id = $6',
    [
      product.name,
      product.slogan,
      product.description,
      product.category,
      product.default_price,
      productId,
    ]
  );

const removeProduct = productId =>
  db.query('DELETE FROM products WHERE id = $1', [productId]);

const addStyle = (productId, style) => {
  const values = [
    productId,
    style.style_name,
    style.sale_price,
    style.original_price,
    style.is_default,
  ];
  return db.query(
    'INSERT INTO styles(product_id, style_name, sale_price, original_price, is_default) VALUES($1, $2, $3, $4, $5)',
    values
  );
};

module.exports = {
  getProductList,
  getProduct,
  getStyles,
  getRelated,
  addProduct,
  updateProduct,
  removeProduct,
  addStyle,
};
