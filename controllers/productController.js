import { redis } from '../lib/redis.js';
import Product from '../models/productModel.js';
import uploadImage from '../utils/uploadImage.js';
import cloudinary from '../lib/cloudinary.js';
import mongoose from 'mongoose';


export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products || []); // Ensure we always send an array
    } catch (error) {
        console.log(`Error: ${error}`);
        res.status(500).json({ message: "Server Error", error: error.message })
    }
};


// export const getFeaturedProducts = async (req, res) => {
//     try {
//         let featuredProducts = await redis.get("featured_products");
//         if (featuredProducts) {
//             return res.json(JSON.parse(featuredProducts));
//         }

//         featuredProducts = await Product.find({ isFeatured: true }).lean();
//         if (!featuredProducts || featuredProducts.length === 0) {
//             return res.status(404).json({ message: "No featured products found" });
//         }

//         // store in redis for future use
//         await redis.set("featured_products", JSON.stringify(featuredProducts), "EX", 3600); // Cache for 1 hour

//         res.json(featuredProducts);
//     } catch (error) {
//         console.log("Error in getFeaturedProducts controller", error.message);
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// }
export const getFeaturedProducts = async (req, res) => {
  let timeoutId;
  
  try {
      const timeoutPromise = new Promise((_, reject) => {
          timeoutId = setTimeout(() => {
              reject(new Error('Operation timed out'));
          }, 8000); // 8 second timeout
      });

      const getFeaturedProductsPromise = async () => {
          try {
              // Try Redis first, but with a short timeout
              const cachedData = await Promise.race([
                  redis.get("featured_products"),
                  new Promise((_, reject) => 
                      setTimeout(() => reject(new Error('Redis timeout')), 1000)
                  )
              ]);

              if (cachedData) {
                  return JSON.parse(cachedData);
              }
          } catch (redisError) {
              console.log('Redis error or timeout, falling back to database');
          }

          // Fallback to MongoDB
          const products = await Product.find({ isFeatured: true })
              .select('name price description image category isFeatured')
              .lean()
              .exec();

          if (!products || products.length === 0) {
              throw new Error('No featured products found');
          }

          // Try to cache in Redis but don't wait for it
          redis.set("featured_products", JSON.stringify(products), "EX", 3600)
              .catch(error => console.log('Redis caching failed:', error));

          return products;
      };

      const result = await Promise.race([
          getFeaturedProductsPromise(),
          timeoutPromise
      ]);

      clearTimeout(timeoutId);
      res.json(result);

  } catch (error) {
      clearTimeout(timeoutId);
      console.error('getFeaturedProducts error:', error);
      
      if (error.message === 'Operation timed out') {
          return res.status(504).json({ 
              message: 'Request timed out', 
              error: 'Operation took too long to complete' 
          });
      }
      
      if (error.message === 'No featured products found') {
          return res.status(404).json({ message: error.message });
      }

      res.status(500).json({ 
          message: 'Server error', 
          error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message 
      });
  }
};


export const createProduct = async (req, res) => {
    try {
      const { name, description, price, category, isFeatured } = req.body;
    //   const imageUrl = await uploadImage(req.file.path); // This assumes you are using multer for file uploads
    let imageUrl = '';

    if (req.file) {
      // If an image file is provided, upload it to Cloudinary
      imageUrl = await uploadImage(req.file.path);
    }
      const product = new Product({
        name,
        description,
        price,
        image: imageUrl,
        category,
        isFeatured
      });
  
      await product.save();
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };


export const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found " })
        }
        if (product.image) {
            const publicId = product.image.split('/').pop().split('.')[0];
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`);
                console.log("deleted image from cloud storage");
            } catch (error) {
                console.log("deleting image didn't go as planned", error)
            }
        }
        await Product.findByIdAndDelete(productId);

    } catch (error) {
        console.log("Error in deleteProduct controller", error.message);
        res.status(500).json({message: "Server Error", error: error.message});
    }
}


export const getRecommendedProducts = async (req, res) => {
	try {
		const products = await Product.aggregate([
			{
				$sample: { size: 4 },
			},
			{
				$project: {
					_id: 1,
					name: 1,
					description: 1,
					image: 1,
					price: 1,
				},
			},
		]);

		res.json(products);
	} catch (error) {
		console.log("Error in getRecommendedProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};


export const getProductsByCategory = async(req, res) => {
    const { category } = req.params;
    try {
        const products = await Product.find({ category });
        res.json(products);
    } catch (error) {
        console.log("Error in the getproductsbyid controller", error.message)
        res.status(500).json({message:"Server error", error: error.message});
    }
}



export const toggleFeatProd = async(req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (product) {
            product.isFeatured = !product.isFeatured;
            const updateProduct = await product.save();
            await updateFeaturedProductsCache();
			res.json(updatedProduct);
        } else {
			res.status(404).json({ message: "Product not found" });
		}

    } catch (error) {
        console.log("Error in toggleFeaturedProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
    }
};

async function updateFeaturedProductsCache() {
	try {
		const featuredProducts = await Product.find({ isFeatured: true }).lean();
		await redis.set("featured_products", JSON.stringify(featuredProducts));
	} catch (error) {
		console.log("error in update cache function");
	}
}


export const getProductById = async (req, res) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid product ID' });
      }
      const product = await Product.findById(id);
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      console.error('Error in getProductById controller', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };




export const updateProduct = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (product) {
        Object.assign(product, req.body);
        const updatedProduct = await product.save();
        res.json(updatedProduct);
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      res.status(400).json({ message: 'Invalid product data', error: error.message });
    }
  };


  export const getCategories = async (req, res) => {
    try {
      const categories = await Product.distinct('category');
      res.json(categories);
    } catch (error) {
      console.error('Error in getCategories controller', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };