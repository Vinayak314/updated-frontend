const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://zecbay-backend.vercel.app';

/**
 * Fetch all products with the same name
 * @param {string} productName - The product name to search for
 * @returns {Promise<Array>} - Array of products with the same name
 */
export const getProductsByName = async (productName: string) => {
  try {
    const response = await fetch(`https://zecbay-backend.vercel.app/api/products/by-name/?product_name=${encodeURIComponent(productName)}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching products by name:', error);
    throw error;
  }
};

/**
 * Fetch a single product by ID
 * @param {string} id - The product ID
 * @returns {Promise<Object>} - The product data
 */
export const getProductById = async (id: string) => {
  try {
    const response = await fetch(`https://zecbay-backend.vercel.app/api/products/${id}/`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error;
  }
};