import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Function to upload image
async function uploadImage(imagePath) {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: 'toob_products',
    });
    console.log(`Image uploaded successfully: ${imagePath}`);
    console.log('Image URL:', result.secure_url);
    return result.secure_url;
  } catch (error) {
    console.error(`Error uploading image ${imagePath} to Cloudinary:`, error);
  }
}

// Get the directory name of the current module
const __dirname = dirname(fileURLToPath(import.meta.url));

// Check if a file path or pattern is provided
const imagePathPattern = process.argv[2];
if (!imagePathPattern) {
  console.error('Please provide an image path or pattern');
  process.exit(1);
}

// Resolve the full path
const fullPattern = resolve(__dirname, imagePathPattern);

// Use glob to get all matching files
try {
  const files = await glob(fullPattern);

  if (files.length === 0) {
    console.error('No files found matching the pattern');
    process.exit(1);
  }

  // Upload each file
  for (const file of files) {
    await uploadImage(file);
  }
} catch (err) {
  console.error('Error finding files:', err);
  process.exit(1);
}