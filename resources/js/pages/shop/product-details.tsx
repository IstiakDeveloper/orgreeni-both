import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
  ChevronRight,
  ShoppingCart,
  Minus,
  Plus,
  Star,
  ChevronsLeft,
  ChevronsRight,
  TruckIcon,
  Tag,
  XCircle,
  CheckCircle
} from 'lucide-react';
import ShopLayout from '@/layouts/ShopLayout';

interface ProductImage {
  id: number;
  product_id: number;
  image: string;
  is_primary: boolean;
  order: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  special_price: number | null;
  unit: string;
  stock: number;
  sku: string;
  category_id: number;
  is_featured: boolean;
  is_active: boolean;
  category: Category;
  images: ProductImage[];
}

interface ProductDetailsProps {
  product: Product;
  relatedProducts: Product[];
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, relatedProducts }) => {

  const [currentImageIndex, setCurrentImageIndex] = useState(
    product.images.findIndex(img => img.is_primary) !== -1
      ? product.images.findIndex(img => img.is_primary)
      : 0
  );
  const [quantity, setQuantity] = useState(1);

  const formatPrice = (price: number) => {
    return `৳${price.toFixed(2)}`;
  };

  const nextImage = () => {
    if (product.images.length > 1) {
      setCurrentImageIndex((currentImageIndex + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product.images.length > 1) {
      setCurrentImageIndex(
        currentImageIndex === 0 ? product.images.length - 1 : currentImageIndex - 1
      );
    }
  };

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const getDiscountPercentage = () => {
    if (product.special_price && product.price > 0) {
      return Math.round(((product.price - product.special_price) / product.price) * 100);
    }
    return 0;
  };

  const getPrimaryImage = (prod: Product) => {
    const primaryImage = prod.images.find(img => img.is_primary);
    return primaryImage ? `/storage/${primaryImage.image}` :
           prod.images.length > 0 ? `/storage/${prod.images[0].image}` :
           '/images/placeholder-product.jpg';
  };

  return (
    <ShopLayout>
      <Head title={product.name} />

      <div className="bg-gray-50 py-3">
        <div className="container mx-auto px-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <Link href={route('home')} className="text-gray-700 hover:text-emerald-600 text-sm">
                  হোম
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                  <Link href="" className="ml-1 text-gray-700 hover:text-emerald-600 text-sm">
                    শপ
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                  <Link
                    href=""
                    className="ml-1 text-gray-700 hover:text-emerald-600 text-sm"
                  >
                    {product.category.name}
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                  <span className="ml-1 text-gray-500 text-sm truncate max-w-[200px]">{product.name}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden border">
                {product.images.length > 0 ? (
                  <img
                    src={`/storage/${product.images[currentImageIndex].image}`}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    কোন ছবি নেই
                  </div>
                )}

                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      aria-label="আগের ছবি"
                    >
                      <ChevronsLeft className="h-5 w-5 text-gray-600" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      aria-label="পরের ছবি"
                    >
                      <ChevronsRight className="h-5 w-5 text-gray-600" />
                    </button>
                  </>
                )}

                {product.special_price && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                    -{getDiscountPercentage()}% ছাড়
                  </div>
                )}
              </div>

              {product.images.length > 1 && (
                <div className="mt-4 grid grid-cols-5 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => selectImage(index)}
                      className={`h-14 w-full border rounded-md overflow-hidden ${
                        index === currentImageIndex ? 'ring-2 ring-emerald-500' : ''
                      }`}
                    >
                      <img
                        src={`/storage/${image.image}`}
                        alt={`${product.name} - ছবি ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col h-full">
              <div className="border-b pb-4 mb-4">
                <Link
                  href=""
                  className="inline-flex items-center text-sm text-emerald-600 hover:text-emerald-700 mb-2"
                >
                  <Tag className="h-4 w-4 mr-1" />
                  {product.category.name}
                </Link>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{product.name}</h1>
              </div>

              <div className="space-y-4 flex-grow">
                {/* মূল্য সেকশন - অপ্টিমাইজড */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  {product.special_price ? (
                    <div className="flex flex-wrap items-center">
                      <span className="text-2xl font-bold text-emerald-700 mr-2">
                        {formatPrice(product.special_price)}
                      </span>
                      <span className="text-lg text-gray-500 line-through mr-2">
                        {formatPrice(product.price)}
                      </span>
                      <span className="mt-1 text-sm bg-red-100 text-red-800 px-2 py-0.5 rounded">
                        {formatPrice(product.price - product.special_price)} টাকা সাশ্রয়
                      </span>
                    </div>
                  ) : (
                    <span className="text-2xl font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>

                {/* স্টক স্ট্যাটাস - অপ্টিমাইজড */}
                <div className="flex items-center bg-gray-50 p-2 rounded-lg">
                  {product.stock > 0 ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-5 w-5 mr-1" />
                      <span>
                        স্টকে আছে
                        {product.stock < 5 && (
                          <span className="ml-1 text-amber-600">
                            (মাত্র {product.stock} {product.unit} বাকি)
                          </span>
                        )}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <XCircle className="h-5 w-5 mr-1" />
                      <span>স্টকে নেই</span>
                    </div>
                  )}
                </div>

                {/* এসকেইউ কোড */}
                <div className="text-sm text-gray-500 bg-gray-50 p-2 rounded-lg">
                  পণ্য কোড: {product.sku}
                </div>

                {/* ডেলিভারি সেকশন - নতুন যোগ করা হয়েছে */}
                <div className="bg-blue-50 p-3 rounded-lg text-blue-800 text-sm flex items-start">
                  <TruckIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">দ্রুত ডেলিভারি</p>
                    <p>ঢাকায় ২৪ ঘন্টার মধ্যে ডেলিভারি। ঢাকার বাইরে ৪৮ ঘন্টার মধ্যে।</p>
                  </div>
                </div>

                {/* বিবরণ */}
                {product.description && (
                  <div className="py-3 px-3 border rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">পণ্যের বিবরণ</h3>
                    <div className="prose prose-sm text-gray-700">
                      {product.description}
                    </div>
                  </div>
                )}

                {/* পরিমাণ সিলেক্টর */}
                <div className="mt-auto">
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                    পরিমাণ
                  </label>
                  <div className="flex items-center">
                    <button
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="p-2 rounded-l-md border border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      className="p-2 w-16 text-center border-t border-b border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300"
                      readOnly
                    />
                    <button
                      onClick={incrementQuantity}
                      disabled={quantity >= product.stock}
                      className="p-2 rounded-r-md border border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* কার্টে যোগ করার বাটন */}
                <div className="pt-4">
                  <button
                    type="button"
                    disabled={product.stock <= 0}
                    className="w-full flex items-center justify-center rounded-md border border-transparent bg-emerald-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {product.stock > 0 ? 'কার্টে যোগ করুন' : 'স্টকে নেই'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* সম্পর্কিত পণ্য - অপ্টিমাইজড */}
        {relatedProducts.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">আপনার পছন্দ হতে পারে</h2>
              <Link href="/products" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                আরও দেখুন <ChevronRight className="inline h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <Link href={route('shop.product', relatedProduct.slug)}>
                    <div className="aspect-square bg-gray-100 overflow-hidden">
                      <img
                        src={getPrimaryImage(relatedProduct)}
                        alt={relatedProduct.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                      />
                      {relatedProduct.special_price && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          -{Math.round(((relatedProduct.price - relatedProduct.special_price) / relatedProduct.price) * 100)}%
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-medium text-gray-900 mb-1 group-hover:text-emerald-600 line-clamp-2">
                        {relatedProduct.name}
                      </h3>
                      <div className="flex justify-between items-center">
                        <div>
                          {relatedProduct.special_price ? (
                            <div className="flex items-center flex-wrap">
                              <span className="text-emerald-600 font-semibold mr-2">
                                {formatPrice(relatedProduct.special_price)}
                              </span>
                              <span className="text-gray-400 text-sm line-through">
                                {formatPrice(relatedProduct.price)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-emerald-600 font-semibold">
                              {formatPrice(relatedProduct.price)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="p-3 pt-0">
                    <button
                      className="w-full mt-2 bg-emerald-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
                      disabled={relatedProduct.stock <= 0}
                    >
                      {relatedProduct.stock > 0 ? 'কার্টে যোগ করুন' : 'স্টকে নেই'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ShopLayout>
  );
};

export default ProductDetails;
