const productModel = require('../models/Product');
exports.validateCart = async (cart) => {
  const productsAfterOrder = [];
  let isCartValid = true;
  let outStockProduct = '';
  for (const product of cart.products) {
    const productById = await productModel.findById(product.idProduct);
    if (Number(productById.count) >= Number(product.count)) {
      productsAfterOrder.push({
        productId: product.idProduct,
        count: Number(productById.count) - Number(product.count),
      });
    } else {
      isCartValid = false;
      outStockProduct = product.nameProduct;
    }
  }
  return [isCartValid, productsAfterOrder, outStockProduct];
};
