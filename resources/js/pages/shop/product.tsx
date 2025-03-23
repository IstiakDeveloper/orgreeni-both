import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import ShopLayout from '@/layouts/ShopLayout';
import { ChevronRight, Minus, Plus, ShoppingCart, Heart, Share2, Star, StarHalf, TruckIcon, PackageCheck, Shield } from 'lucide-react';

interface ProductImage {
    id: number;
    image: string;
    is_primary: boolean;
    order: number;
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
    category: {
        id: number;
        name: string;
        slug: string;
    };
    is_featured: boolean;
    images: ProductImage[];
}

interface ProductProps {
    product: Product;
    relatedProducts: Product[];
    storeSettings: {
        store_name: string;
        currency_symbol: string;
    };
}

const Product: React.FC<ProductProps> = ({ product, relatedProducts, storeSettings }) => {
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);
    const [inWishlist, setInWishlist] = useState(false);

    // Increment quantity
    const incrementQuantity = () => {
        if (quantity < product.stock) {
            setQuantity(prev => prev + 1);
        }
    };

    // Decrement quantity
    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    // Toggle wishlist
    const toggleWishlist = () => {
        setInWishlist(prev => !prev);
    };

    // Format price with currency symbol
    const formatPrice = (price: number) => {
        return `${storeSettings.currency_symbol}${price.toFixed(2)}`;
    };

    // Get product primary image
    const getProductImage = (prod: Product) => {
        const primaryImage = prod.images.find(img => img.is_primary);
        return primaryImage ? `/storage/${primaryImage.image}` : '/assets/placeholder.png';
    };

    // Calculate discount percentage
    const discountPercentage = product.special_price
        ? Math.round((1 - product.special_price / product.price) * 100)
        : 0;

    // Rating - mock data (would come from reviews in a real app)
    const rating = 4.5;
    const reviewCount = 24;

    // Share product
    const shareProduct = () => {
        if (navigator.share) {
            navigator.share({
                title: product.name,
                text: product.description,
                url: window.location.href,
            })
            .catch(console.error);
        }
    };

    return (
        <ShopLayout>
            <Head title={`${product.name} - ${storeSettings.store_name}`} />

            <div className="container mx-auto px-4 py-6">
                {/* Breadcrumbs */}
                <div className="flex items-center text-sm mb-6">
                    <Link href="/" className="text-gray-500 hover:text-green-600">Home</Link>
                    <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                    <Link
                        href={`/category/${product.category.slug}`}
                        className="text-gray-500 hover:text-green-600"
                    >
                        {product.category.name}
                    </Link>
                    <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                    <span className="text-green-600 font-medium">{product.name}</span>
                </div>

                {/* Product Details */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Product Images */}
                        <div className="lg:w-2/5">
                            <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                                <img
                                    src={`/storage/${product.images[activeImage]?.image || product.images[0]?.image}`}
                                    alt={product.name}
                                    className="w-full h-96 object-contain"
                                />
                            </div>

                            {/* Thumbnail Images */}
                            {product.images.length > 1 && (
                                <div className="flex space-x-2 overflow-x-auto pb-2">
                                    {product.images.map((image, index) => (
                                        <button
                                            key={image.id}
                                            onClick={() => setActiveImage(index)}
                                            className={`border rounded-md overflow-hidden h-20 w-20 flex-shrink-0 ${
                                                activeImage === index ? 'border-green-500' : 'border-gray-200'
                                            }`}
                                        >
                                            <img
                                                src={`/storage/${image.image}`}
                                                alt={`${product.name} - Image ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="lg:w-3/5">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>

                            {/* Rating */}
                            <div className="flex items-center mb-4">
                                <div className="flex text-yellow-400">
                                    {[...Array(Math.floor(rating))].map((_, i) => (
                                        <Star key={i} className="h-5 w-5 fill-current" />
                                    ))}
                                    {rating % 1 !== 0 && <StarHalf className="h-5 w-5 fill-current" />}
                                </div>
                                <span className="text-gray-500 ml-2">{rating} ({reviewCount} reviews)</span>
                            </div>

                            {/* Price */}
                            <div className="mb-6">
                                {product.special_price ? (
                                    <div className="flex items-center">
                                        <span className="text-2xl font-bold text-green-700 mr-3">
                                            {formatPrice(product.special_price)}
                                        </span>
                                        <span className="text-lg text-gray-500 line-through">
                                            {formatPrice(product.price)}
                                        </span>
                                        <span className="ml-3 bg-red-500 text-white text-sm px-2 py-1 rounded">
                                            {discountPercentage}% OFF
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-2xl font-bold text-green-700">
                                        {formatPrice(product.price)}
                                    </span>
                                )}
                                <p className="text-gray-500 mt-1">Price per {product.unit}</p>
                            </div>

                            {/* Description */}
                            {product.description && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                                    <div className="text-gray-600 prose-sm" dangerouslySetInnerHTML={{ __html: product.description }} />
                                </div>
                            )}

                            {/* Stock Status */}
                            <div className="mb-6">
                                <div className="flex items-center">
                                    <span className="text-gray-700 mr-2">Availability:</span>
                                    {product.stock > 0 ? (
                                        <span className="text-green-600 font-medium">In Stock</span>
                                    ) : (
                                        <span className="text-red-600 font-medium">Out of Stock</span>
                                    )}
                                </div>
                                <div className="flex items-center mt-1">
                                    <span className="text-gray-700 mr-2">SKU:</span>
                                    <span className="text-gray-600">{product.sku}</span>
                                </div>
                            </div>

                            {/* Add to Cart */}
                            <div className="mb-6">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex border border-gray-300 rounded-md w-full sm:w-36">
                                        <button
                                            onClick={decrementQuantity}
                                            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-l-md"
                                        >
                                            <Minus className="h-5 w-5" />
                                        </button>
                                        <input
                                            type="number"
                                            value={quantity}
                                            min={1}
                                            max={product.stock}
                                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                                            className="w-full text-center border-none focus:ring-0"
                                        />
                                        <button
                                            onClick={incrementQuantity}
                                            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-r-md"
                                        >
                                            <Plus className="h-5 w-5" />
                                        </button>
                                    </div>

                                    <button
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium flex items-center justify-center"
                                        disabled={product.stock <= 0}
                                    >
                                        <ShoppingCart className="h-5 w-5 mr-2" />
                                        Add to Cart
                                    </button>

                                    <button
                                        onClick={toggleWishlist}
                                        className="px-4 py-3 border border-gray-300 hover:border-red-500 rounded-md"
                                    >
                                        <Heart className={`h-5 w-5 ${inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                                    </button>

                                    <button
                                        onClick={shareProduct}
                                        className="px-4 py-3 border border-gray-300 hover:border-blue-500 rounded-md"
                                    >
                                        <Share2 className="h-5 w-5 text-gray-600" />
                                    </button>
                                </div>
                            </div>

                            {/* Delivery Info */}
                            <div className="border-t border-gray-200 pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="flex items-center">
                                        <TruckIcon className="h-8 w-8 text-green-600 mr-3" />
                                        <div>
                                            <h4 className="font-medium">Free Delivery</h4>
                                            <p className="text-sm text-gray-500">On orders over {formatPrice(1000)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <PackageCheck className="h-8 w-8 text-green-600 mr-3" />
                                        <div>
                                            <h4 className="font-medium">Quality Guarantee</h4>
                                            <p className="text-sm text-gray-500">Fresh and premium products</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <Shield className="h-8 w-8 text-green-600 mr-3" />
                                        <div>
                                            <h4 className="font-medium">Secure Payment</h4>
                                            <p className="text-sm text-gray-500">100% secure checkout</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mb-12 bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Products</h2>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {relatedProducts.map((relatedProduct) => (
                                <div key={relatedProduct.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden transition-all hover:shadow-md">
                                    <Link href={`/product/${relatedProduct.slug}`} className="block relative">
                                        <div className="aspect-square overflow-hidden">
                                            <img
                                                src={getProductImage(relatedProduct)}
                                                alt={relatedProduct.name}
                                                className="w-full h-full object-cover transition-transform hover:scale-105"
                                            />
                                        </div>
                                        {relatedProduct.special_price && (
                                            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                                                {Math.round((1 - relatedProduct.special_price / relatedProduct.price) * 100)}% OFF
                                            </div>
                                        )}
                                    </Link>

                                    <div className="p-3">
                                        <Link href={`/product/${relatedProduct.slug}`} className="block">
                                            <h3 className="font-medium text-gray-800 mb-1 line-clamp-2 min-h-[2.5rem]">{relatedProduct.name}</h3>
                                            <p className="text-xs text-gray-500 mb-2">{relatedProduct.unit}</p>
                                        </Link>

                                        <div className="flex justify-between items-center">
                                            <div>
                                                {relatedProduct.special_price ? (
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-green-700">{formatPrice(relatedProduct.special_price)}</span>
                                                        <span className="text-xs text-gray-500 line-through">{formatPrice(relatedProduct.price)}</span>
                                                    </div>
                                                ) : (
                                                    <span className="font-semibold text-green-700">{formatPrice(relatedProduct.price)}</span>
                                                )}
                                            </div>

                                            <button
                                                className="p-2 text-green-700 hover:bg-green-50 border border-green-700 rounded"
                                            >
                                                <ShoppingCart className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Product Tabs - Description, Reviews, etc. */}
                <div className="bg-white rounded-lg shadow-md mb-8">
                    <div className="border-b border-gray-200">
                        <div className="flex overflow-x-auto">
                            <button className="px-6 py-3 text-green-600 border-b-2 border-green-600 font-medium">
                                Description
                            </button>
                            <button className="px-6 py-3 text-gray-600 hover:text-green-600">
                                Reviews ({reviewCount})
                            </button>
                            <button className="px-6 py-3 text-gray-600 hover:text-green-600">
                                Shipping & Returns
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        {product.description ? (
                            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: product.description }} />
                        ) : (
                            <p className="text-gray-500">No description available for this product.</p>
                        )}
                    </div>
                </div>

                {/* Recently Viewed (mock data) */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Recently Viewed</h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {relatedProducts.slice(0, 6).map((relatedProduct) => (
                            <div key={`recent-${relatedProduct.id}`} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                <Link href={`/product/${relatedProduct.slug}`} className="block">
                                    <div className="aspect-square overflow-hidden">
                                        <img
                                            src={getProductImage(relatedProduct)}
                                            alt={relatedProduct.name}
                                            className="w-full h-full object-cover transition-transform hover:scale-105"
                                        />
                                    </div>
                                    <div className="p-2">
                                        <h3 className="font-medium text-sm text-gray-800 truncate">{relatedProduct.name}</h3>
                                        <p className="text-xs text-green-700">{formatPrice(relatedProduct.special_price || relatedProduct.price)}</p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </ShopLayout>
    );
};

export default Product;
