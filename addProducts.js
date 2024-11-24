import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/productModel.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const products = [

  {
    name: 'Timeless Brown Shirt',
    description: 'A versatile brown shirt that combines comfort with elegance.',
    price: 899.99,
    image: 'https://drive.google.com/file/d/1Xjz4j0UeRFx-cr6G9zxMYrorK4UWG1-w/view?usp=sharing',
    category: 'Tops',
    isFeatured: true
  },

  {
    name: 'BG Kimono',
    description: 'Light Kimono for your evenings..',
    price: 899.99,
    image: 'https://res.cloudinary.com/dle0ftvo2/image/upload/v1728878515/toob_products/qxnvjsirhnkjs21dfzwy.png',
    category: 'Tops',
    isFeatured: true
  },


];

const addProducts = async () => {
  try {
    await Product.insertMany(products);
    console.log('Products added successfully');
  } catch (error) {
    console.error('Error adding products:', error);
  } finally {
    mongoose.disconnect();
  }
};

addProducts();