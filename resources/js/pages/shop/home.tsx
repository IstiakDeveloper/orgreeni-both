import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import ShopLayout from '@/layouts/ShopLayout';
import { ChevronRight, Smartphone } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

interface ProductImage {
  id: number;
  image: string;
  is_primary: boolean;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  special_price: number | null;
  unit: string;
  stock: number;
  sku: string;
  description: string | null;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  images: ProductImage[];
}

interface Category {
  id: number;
  name: string;
  slug: string;
  image: string | null;
}

interface Banner {
  id: number;
  title: string;
  image: string;
  link: string | null;
}

interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product: Product;
}

interface HomeProps {
  categories: Category[];
  featuredProducts: Product[];
  banners: Banner[];
  newArrivals: Product[];
  storeSettings: {
    store_name: string;
    currency_symbol: string;
  };
}

const Home: React.FC<HomeProps> = ({ categories, featuredProducts, banners, newArrivals, storeSettings }) => {
  // Access appSettings and cartItemsCount from shared props
  const { appSettings, cartItemsCount, flash } = usePage().props as any;

  // Use appSettings if available, otherwise fallback to storeSettings prop
  const settings = appSettings || storeSettings;

  const [cartItems, setCartItems] = useState<{[key: number]: number}>({});
  const [isLoading, setIsLoading] = useState<{[key: number]: boolean}>({});
  const [cartCount, setCartCount] = useState(cartItemsCount || 0);

  // Fetch cart data on component mount
  useEffect(() => {
    fetchCartData();
  }, []);

  const fetchCartData = async () => {
    try {
      // Fetch cart count to ensure we have the latest
      const countResponse = await axios.get('/cart/count');
      setCartCount(countResponse.data.count);

      // Fetch cart details to get product quantities
      const response = await axios.get('/cart');

      if (response.data && response.data.cart && response.data.cart.items) {
        // Convert cart items to our local state format
        const cartItemsMap = response.data.cart.items.reduce((acc: {[key: number]: number}, item: CartItem) => {
          acc[item.product_id] = item.quantity;
          return acc;
        }, {});

        setCartItems(cartItemsMap);
      }
    } catch (error) {
      console.error('Error fetching cart data:', error);
    }
  };

  const addToCart = async (productId: number) => {
    // Set loading state for this product
    setIsLoading(prev => ({ ...prev, [productId]: true }));

    try {
      // Call the cart add endpoint
      const response = await axios.post('/cart/add', {
        product_id: productId,
        quantity: 1
      });

      // Update local cart count
      setCartCount(response.data.cart_count);

      // Update local cart items
      setCartItems(prev => ({
        ...prev,
        [productId]: (prev[productId] || 0) + 1
      }));

      // Optional: Show a success message
      if (flash) {
        flash.success = response.data.message;
      }
    } catch (error: any) {
      console.error('Error adding to cart:', error);

      // Show error message if available
      if (error.response && error.response.data && error.response.data.message) {
        if (flash) {
          flash.error = error.response.data.message;
        } else {
          alert(error.response.data.message);
        }
      }
    } finally {
      // Clear loading state
      setIsLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  const removeFromCart = async (productId: number) => {
    // Set loading state for this product
    setIsLoading(prev => ({ ...prev, [productId]: true }));

    try {
      // First, we need to find the cart item ID for this product
      const cartResponse = await axios.get('/cart');

      if (cartResponse.data && cartResponse.data.cart && cartResponse.data.cart.items) {
        const cartItem = cartResponse.data.cart.items.find(
          (item: CartItem) => item.product_id === productId
        );

        if (cartItem) {
          if (cartItems[productId] > 1) {
            // Update quantity if more than one
            await axios.patch(`/cart/update/${cartItem.id}`, {
              quantity: cartItems[productId] - 1
            });

            // Update local state
            setCartItems(prev => ({
              ...prev,
              [productId]: prev[productId] - 1
            }));
          } else {
            // Remove item if only one
            const removeResponse = await axios.delete(`/cart/remove/${cartItem.id}`);

            // Update local state
            setCartItems(prev => {
              const newItems = { ...prev };
              delete newItems[productId];
              return newItems;
            });

            // Update cart count
            setCartCount(removeResponse.data.cart_count);
          }
        }
      }
    } catch (error: any) {
      console.error('Error removing from cart:', error);

      // Show error message if available
      if (error.response && error.response.data && error.response.data.message) {
        if (flash) {
          flash.error = error.response.data.message;
        } else {
          alert(error.response.data.message);
        }
      }
    } finally {
      // Clear loading state
      setIsLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  const getCartQuantity = (productId: number) => {
    return cartItems[productId] || 0;
  };

  const isProductLoading = (productId: number) => {
    return isLoading[productId] || false;
  };

  return (
    <ShopLayout>
      <Head title={`${settings.store_name} - Fresh Groceries Delivered`} />

      <div
        className="max-w-7xl mx-auto px-4 py-6"
        style={{ fontFamily: "'Segoe UI', Helvetica, 'Droid Sans', Arial, 'lucida grande', tahoma, verdana, arial, sans-serif" }}
      >
        {/* Banner Slider with Fixed Height */}
        {banners.length > 0 && (
          <div className="mb-8">
            <div className="rounded-lg overflow-hidden shadow-md">
              <img
                src={`/storage/${banners[0].image}`}
                alt={banners[0].title}
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
          </div>
        )}

        {/* Chaldal Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm flex items-center">
            <div className="w-12 h-12 flex-shrink-0 mr-3">
              <img src="/assets/products-icon.png" alt="Products" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-lg font-bold text-green-500">+15000 products</span>
              <span className="text-gray-700"> to shop from</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm flex items-center">
            <div className="w-12 h-12 flex-shrink-0 mr-3">
              <img src="/assets/payment-icon.png" alt="Payment" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-gray-700">Pay </span>
              <span className="text-lg font-bold text-green-500">after</span>
              <span className="text-gray-700"> receiving products</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm flex items-center">
            <div className="w-12 h-12 flex-shrink-0 mr-3">
              <img src="/assets/delivery-icon.png" alt="Delivery" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-gray-700">Get your delivery within </span>
              <span className="text-lg font-bold text-green-500">1 hour</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm flex items-center">
            <div className="w-12 h-12 flex-shrink-0 mr-3">
              <img src="/assets/offers-icon.png" alt="Offers" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-gray-700">Get offers that </span>
              <span className="text-lg font-bold text-green-500">Save Money</span>
            </div>
          </div>
        </div>

        {/* Popular Categories */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Popular Categories</h2>
            <Link href="/categories" className="text-green-600 hover:text-green-700 flex items-center text-sm font-medium">
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow"
              >
                <div className="aspect-square p-4">
                  <img
                    src={category.image ? `/storage/${category.image}` : '/assets/category-placeholder.png'}
                    alt={category.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-3 text-center border-t border-gray-200">
                  <h3 className="font-medium text-gray-800">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Products */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Featured Products</h2>
            <Link href="/products/featured" className="text-green-600 hover:text-green-700 flex items-center text-sm font-medium">
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                storeSettings={settings}
                onAddToCart={addToCart}
                onRemoveFromCart={removeFromCart}
                cartQuantity={getCartQuantity(product.id)}
                isLoading={isProductLoading(product.id)}
              />
            ))}
          </div>
        </div>

        {/* Download App Section */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg mb-8 overflow-hidden">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 p-8">
              <h2 className="text-3xl font-bold text-white mb-4">Download Our App</h2>
              <p className="text-green-100 mb-6">Shop groceries anytime, anywhere with our mobile app. Get exclusive app-only offers and discounts.</p>
              <div className="flex flex-wrap gap-4">
                <a href="#" className="inline-block">
                  <img src="/assets/app-store-badge.png" alt="Download on App Store" className="h-12" />
                </a>
                <a href="#" className="inline-block">
                  <img src="/assets/google-play-badge.png" alt="Get it on Google Play" className="h-12" />
                </a>
              </div>
            </div>
            <div className="md:w-1/2 p-4 flex justify-center">
              <img src="/assets/app-mockup.png" alt="Mobile App" className="max-w-xs" />
            </div>
          </div>
        </div>

        {/* New Arrivals */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">New Arrivals</h2>
            <Link href="/products/new" className="text-green-600 hover:text-green-700 flex items-center text-sm font-medium">
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {newArrivals.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                storeSettings={settings}
                onAddToCart={addToCart}
                onRemoveFromCart={removeFromCart}
                cartQuantity={getCartQuantity(product.id)}
                isLoading={isProductLoading(product.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer - Simple version */}
      <footer className="bg-white shadow-inner border-t border-gray-200 py-8">
        <div
          className="max-w-7xl mx-auto px-4"
          style={{ fontFamily: "'Segoe UI', Helvetica, 'Droid Sans', Arial, 'lucida grande', tahoma, verdana, arial, sans-serif" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Service</h3>
              <ul className="space-y-2">
                <li><Link href="/contact" className="text-gray-600 hover:text-green-500">Contact Us</Link></li>
                <li><Link href="/faq" className="text-gray-600 hover:text-green-500">FAQs</Link></li>
                <li><Link href="/page/shipping-policy" className="text-gray-600 hover:text-green-500">Shipping Information</Link></li>
                <li><Link href="/page/return-policy" className="text-gray-600 hover:text-green-500">Returns & Refunds</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">About Us</h3>
              <ul className="space-y-2">
                <li><Link href="/page/about-us" className="text-gray-600 hover:text-green-500">Our Story</Link></li>
                <li><Link href="/blog" className="text-gray-600 hover:text-green-500">Blog</Link></li>
                <li><Link href="/careers" className="text-gray-600 hover:text-green-500">Careers</Link></li>
                <li><Link href="/page/privacy-policy" className="text-gray-600 hover:text-green-500">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">For Business</h3>
              <ul className="space-y-2">
                <li><Link href="/corporate" className="text-gray-600 hover:text-green-500">Corporate Orders</Link></li>
                <li><Link href="/wholesale" className="text-gray-600 hover:text-green-500">Wholesale</Link></li>
                <li><Link href="/partnership" className="text-gray-600 hover:text-green-500">Partnership</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Connect With Us</h3>
              <div className="flex space-x-4 mb-4">
                <a href="#" className="text-gray-500 hover:text-green-500">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-green-500">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-green-500">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>
                </a>
              </div>

              <h4 className="font-semibold mb-2">Payment Methods</h4>
              <div className="flex flex-wrap gap-2">
                <img src="/assets/visa.png" alt="Visa" className="h-8" />
                <img src="/assets/mastercard.png" alt="Mastercard" className="h-8" />
                <img src="/assets/bkash.png" alt="bKash" className="h-8" />
                <img src="/assets/nagad.png" alt="Nagad" className="h-8" />
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600">© {new Date().getFullYear()} {settings?.store_name}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </ShopLayout>
  );
};

export default Home;
