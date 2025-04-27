import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { router } from '@inertiajs/react';
import { ShoppingBag, CreditCard, Truck, Home, CheckCircle } from 'lucide-react';

interface Address {
  id: number;
  address: string;
  city: string;
  postal_code: string;
  is_default: boolean;
}

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface DeliveryOption {
  id: string;
  name: string;
  cost: number;
}

interface PaymentMethod {
  id: string;
  name: string;
}

interface CheckoutPageProps {
  defaultAddress?: Address;
  paymentMethods: PaymentMethod[];
  deliveryOptions: DeliveryOption[];
  user: User;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({
  defaultAddress,
  paymentMethods,
  deliveryOptions,
  user
}) => {
  // Get cart data from context
  const { items, count, total, syncCart } = useCart();

  const [selectedAddress, setSelectedAddress] = useState<number | null>(defaultAddress?.id || null);
  const [paymentMethod, setPaymentMethod] = useState<string>('cash_on_delivery');
  const [deliveryOption, setDeliveryOption] = useState<string>('standard');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Ensure cart is synced with backend when component mounts
  useEffect(() => {
    // Force sync cart with backend
    syncCart();
  }, []);

  // If no items in cart, redirect to home
  useEffect(() => {
    if (count === 0) {
      // Delay to allow for cart restoration
      const timer = setTimeout(() => {
        if (count === 0) {
          window.location.href = '/';
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [count]);

  // Get delivery cost based on selected option
  const getDeliveryCost = () => {
    const option = deliveryOptions.find(opt => opt.id === deliveryOption);
    return option ? option.cost : 49;
  };

  // Calculate total
  const deliveryCost = getDeliveryCost();
  const orderTotal = total + deliveryCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const newErrors: {[key: string]: string} = {};

    if (!selectedAddress) {
      newErrors.address = 'Please select a delivery address';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    // Final cart sync before checkout
    syncCart().then(() => {
      // Submit the order using Inertia
      router.post('/checkout/process', {
        address_id: selectedAddress,
        payment_method: paymentMethod,
        delivery_option: deliveryOption,
        notes: notes,
      }, {
        onSuccess: () => {
          // Will be redirected by the controller
        },
        onError: (errors) => {
          setIsSubmitting(false);
          setErrors(errors as {[key: string]: string});
        },
      });
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <ShoppingBag className="mr-2" size={24} />
          Checkout
        </h1>

        {count === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500 mb-4">Your cart is empty</p>
            <a href="/" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Continue Shopping
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Summary */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
                <div className="bg-green-600 text-white px-4 py-3">
                  <h2 className="font-medium flex items-center">
                    <ShoppingBag className="mr-2" size={18} />
                    Order Summary ({count} item{count !== 1 ? 's' : ''})
                  </h2>
                </div>
                <div className="p-4">
                  {/* Cart Items */}
                  <div className="divide-y divide-gray-100">
                    {Object.values(items).map((item) => (
                      <div key={item.id} className="py-3 flex">
                        <div className="w-16 h-16 flex-shrink-0">
                          <img
                            src={item.image ? `/storage/${item.image}` : '/assets/product-placeholder.png'}
                            alt={item.name}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-sm font-medium">{item.name}</h3>
                          <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                          <div className="flex justify-between mt-1">
                            <p className="text-xs">
                              {item.special_price && <span className="text-green-600">Special Price: </span>}
                              ৳{(item.special_price || item.price)}/{item.unit}
                            </p>
                            <p className="font-medium text-sm">
                              ৳{((item.special_price || item.price) * item.quantity).toFixed(0)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
                <div className="bg-green-600 text-white px-4 py-3">
                  <h2 className="font-medium flex items-center">
                    <Home className="mr-2" size={18} />
                    Delivery Address
                  </h2>
                </div>
                <div className="p-4">
                  {defaultAddress ? (
                    <div className="border border-gray-200 rounded p-3">
                      <div className="flex items-start">
                        <input
                          type="radio"
                          name="address"
                          id={`address-${defaultAddress.id}`}
                          className="mt-1"
                          checked={selectedAddress === defaultAddress.id}
                          onChange={() => setSelectedAddress(defaultAddress.id)}
                        />
                        <label htmlFor={`address-${defaultAddress.id}`} className="ml-2 text-sm">
                          <div className="font-medium">{user.name}</div>
                          <div className="text-gray-600">{defaultAddress.address}</div>
                          <div className="text-gray-600">{defaultAddress.city}, {defaultAddress.postal_code}</div>
                          <div className="text-gray-600">Phone: {user.phone}</div>
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500 mb-2">No delivery address found</p>
                      <a href="/profile/addresses" className="text-green-600 hover:underline">
                        Add a new address
                      </a>
                    </div>
                  )}

                  {errors.address && (
                    <div className="mt-2 text-red-500 text-sm">{errors.address}</div>
                  )}
                </div>
              </div>

              {/* Delivery Options */}
              <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
                <div className="bg-green-600 text-white px-4 py-3">
                  <h2 className="font-medium flex items-center">
                    <Truck className="mr-2" size={18} />
                    Delivery Options
                  </h2>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    {deliveryOptions.map((option) => (
                      <div key={option.id} className="border border-gray-200 rounded p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-start">
                            <input
                              type="radio"
                              name="delivery"
                              id={`delivery-${option.id}`}
                              className="mt-1"
                              checked={deliveryOption === option.id}
                              onChange={() => setDeliveryOption(option.id)}
                            />
                            <label htmlFor={`delivery-${option.id}`} className="ml-2 text-sm">
                              <div className="font-medium">{option.name}</div>
                            </label>
                          </div>
                          <div className="font-medium">৳{option.cost}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
                <div className="bg-green-600 text-white px-4 py-3">
                  <h2 className="font-medium flex items-center">
                    <CreditCard className="mr-2" size={18} />
                    Payment Method
                  </h2>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="border border-gray-200 rounded p-3">
                        <div className="flex items-start">
                          <input
                            type="radio"
                            name="payment"
                            id={`payment-${method.id}`}
                            className="mt-1"
                            checked={paymentMethod === method.id}
                            onChange={() => setPaymentMethod(method.id)}
                          />
                          <label htmlFor={`payment-${method.id}`} className="ml-2 text-sm">
                            <div className="font-medium">{method.name}</div>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Notes */}
              <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
                <div className="p-4">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    placeholder="Any special instructions for delivery"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Order Total and Submit */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow overflow-hidden sticky top-4">
                <div className="bg-green-600 text-white px-4 py-3">
                  <h2 className="font-medium">Order Total</h2>
                </div>
                <div className="p-4">
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span>৳{total.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Delivery</span>
                      <span>৳{deliveryCost}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>৳{orderTotal.toFixed(0)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !selectedAddress}
                    className={`w-full py-3 rounded font-medium text-white ${
                      isSubmitting || !selectedAddress
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {isSubmitting ? 'Processing...' : 'Place Order'}
                  </button>

                  {Object.keys(errors).length > 0 && Object.keys(errors).some(key => key !== 'address') && (
                    <div className="mt-4 p-3 bg-red-50 text-red-700 rounded text-sm">
                      <ul className="list-disc pl-4">
                        {Object.entries(errors).map(([key, error]) => (
                          key !== 'address' && <li key={key}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
