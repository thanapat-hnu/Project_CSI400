import Product from './Product.js';
import ProductVariant from './ProductVariant.js';
import ProductImage from './ProductImage.js';
import Category from './Category.js';

// ─────────────── Associations ───────────────

// Category ↔ Product
Category.hasMany(Product, { as: 'products', foreignKey: 'category_id' });
Product.belongsTo(Category, { as: 'category', foreignKey: 'category_id' });

// Product ↔ Variant
Product.hasMany(ProductVariant, { as: 'variants', foreignKey: 'product_id' });
ProductVariant.belongsTo(Product, { as: 'product', foreignKey: 'product_id' });

// Product ↔ Image
Product.hasMany(ProductImage, { as: 'images', foreignKey: 'product_id' });
ProductImage.belongsTo(Product, { as: 'product', foreignKey: 'product_id' });

export { Product, ProductVariant, ProductImage, Category };
