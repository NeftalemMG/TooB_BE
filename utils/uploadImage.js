import cloudinary from '../config/cloudinaryConfig.js';

const uploadImage = async (imagePath) => {
  try {
    // const result = await cloudinary.uploader.upload(imagePath);
    const result = await cloudinary.uploader.upload(imagePath, {
        folder: 'toob_products', 
      });
  
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
};

export default uploadImage;