import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

// Define interfaces for our types
interface CartItem {
    id: number;
    product_id: number;
    name: string;
    price: number;
    special_price: number | null;
    quantity: number;
    unit: string;
    stock: number;
    image?: string;
}

interface CartContextType {
    lastAddedProductId: number | null;
    setLastAddedProductId: React.Dispatch<React.SetStateAction<number | null>>;
    items: { [key: number]: CartItem };
    count: number;
    total: number;
    addToCart: (product: any, quantity?: number) => boolean;
    removeFromCart: (productId: number, quantity?: number) => void;
    updateQuantity: (productId: number, newQuantity: number) => boolean;
    clearCart: () => void;
    syncCart: () => Promise<any>;
    isCartOpen: boolean;
    toggleCart: () => void;
}

// Create the context with a default value
const CartContext = createContext<CartContextType | undefined>(undefined);


// Provider component
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Cart state
    const [items, setItems] = useState<{ [key: number]: CartItem }>({});
    const [count, setCount] = useState(0);
    const [total, setTotal] = useState(0);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const [lastAddedProductId, setLastAddedProductId] = useState<number | null>(null);


    // Load cart from sessionStorage on initial load
    useEffect(() => {
        const savedCart = sessionStorage.getItem('cart');
        if (savedCart) {
            try {
                const { items, count, total } = JSON.parse(savedCart);
                setItems(items || {});
                setCount(count || 0);
                setTotal(total || 0);
            } catch (error) {
                console.error('Failed to parse cart data from session storage', error);
            }
        }

        // Check if cart should be open
        const cartOpen = localStorage.getItem('cartOpen') === 'true';
        setIsCartOpen(cartOpen);
    }, []);

    // Save cart to sessionStorage whenever it changes
    useEffect(() => {
        const cart = { items, count, total };
        sessionStorage.setItem('cart', JSON.stringify(cart));
    }, [items, count, total]);

    // Save cart open state
    useEffect(() => {
        localStorage.setItem('cartOpen', isCartOpen.toString());

        // Apply margin to main content when cart is open
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            if (isCartOpen) {
                mainContent.style.marginRight = '320px';
                mainContent.style.transition = 'margin-right 0.3s ease-in-out';
            } else {
                mainContent.style.marginRight = '0';
            }
        }
    }, [isCartOpen]);

    // Toggle cart
    const toggleCart = () => {
        setIsCartOpen(prev => !prev);
    };

    // Calculate total cart value
    const calculateTotal = (cartItems: { [key: number]: CartItem }) => {
        return Object.values(cartItems).reduce(
            (sum, item) => sum + (item.special_price || item.price) * item.quantity,
            0
        );
    };

    // Add item to cart
    const addToCart = (product: any, quantity = 1): boolean => {
        // Check stock first
        const currentQuantity = items[product.id]?.quantity || 0;

        if (currentQuantity + quantity > product.stock) {
            alert(`দুঃখিত, শুধুমাত্র ${product.stock}টি স্টকে আছে।`);
            return false;
        }

        setItems(prevItems => {
            const newItems = { ...prevItems };

            // If product exists, update quantity
            if (newItems[product.id]) {
                newItems[product.id] = {
                    ...newItems[product.id],
                    quantity: newItems[product.id].quantity + quantity
                };
            } else {
                // Otherwise add new item
                newItems[product.id] = {
                    id: product.id,
                    product_id: product.id,
                    name: product.name,
                    price: product.price,
                    special_price: product.special_price,
                    quantity: quantity,
                    unit: product.unit,
                    stock: product.stock,
                    image: product.images && product.images.length > 0
                        ? product.images.find((img: any) => img.is_primary)?.image || product.images[0].image
                        : undefined
                };
            }
            setLastAddedProductId(product.id);


            // Update count and total
            const newCount = Object.values(newItems).reduce((sum, item) => sum + item.quantity, 0);
            const newTotal = calculateTotal(newItems);

            setCount(newCount);
            setTotal(newTotal);

            return newItems;
        });
        setLastAddedProductId(product.id);

        setTimeout(() => {
            setLastAddedProductId(null);
        }, 2000);
        return true;

    };

    // Remove item from cart
    const removeFromCart = (productId: number, quantity = 1) => {
        setItems(prevItems => {
            const newItems = { ...prevItems };

            // If product exists
            if (newItems[productId]) {
                // If removing all or last item, delete it
                if (newItems[productId].quantity <= quantity) {
                    delete newItems[productId];
                } else {
                    // Otherwise reduce quantity
                    newItems[productId] = {
                        ...newItems[productId],
                        quantity: newItems[productId].quantity - quantity
                    };
                }
            }

            // Update count and total
            const newCount = Object.values(newItems).reduce((sum, item) => sum + item.quantity, 0);
            const newTotal = calculateTotal(newItems);

            setCount(newCount);
            setTotal(newTotal);

            return newItems;
        });
    };

    // Update quantity
    const updateQuantity = (productId: number, newQuantity: number): boolean => {
        // Validate the product exists
        if (!items[productId]) {
            return false;
        }

        // Check if new quantity exceeds stock
        if (newQuantity > items[productId].stock) {
            alert(`দুঃখিত, শুধুমাত্র ${items[productId].stock}টি স্টকে আছে।`);
            return false;
        }

        // If quantity is 0 or less, remove the item
        if (newQuantity <= 0) {
            setItems(prevItems => {
                const newItems = { ...prevItems };
                delete newItems[productId];

                // Update count and total
                const newCount = Object.values(newItems).reduce((sum, item) => sum + item.quantity, 0);
                const newTotal = calculateTotal(newItems);

                setCount(newCount);
                setTotal(newTotal);

                return newItems;
            });
        } else {
            // Otherwise update the quantity
            setItems(prevItems => {
                const newItems = { ...prevItems };
                newItems[productId] = {
                    ...newItems[productId],
                    quantity: newQuantity
                };

                // Update count and total
                const newCount = Object.values(newItems).reduce((sum, item) => sum + item.quantity, 0);
                const newTotal = calculateTotal(newItems);

                setCount(newCount);
                setTotal(newTotal);

                return newItems;
            });
        }

        return true;
    };

    // Clear cart
    const clearCart = () => {
        setItems({});
        setCount(0);
        setTotal(0);
        sessionStorage.removeItem('cart');
    };

    // Sync cart with backend
    const syncCart = async () => {
        try {
            // Prepare cart items for API
            const cartItems = Object.values(items).map(item => ({
                product_id: item.product_id,
                quantity: item.quantity
            }));

            // Call the API endpoint
            const response = await fetch('/api/cart/sync', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({ items: cartItems })
            });

            if (!response.ok) {
                throw new Error('Failed to sync cart with server');
            }

            return await response.json();
        } catch (error) {
            console.error('Error syncing cart:', error);
            return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
        }
    };

    return (
        <CartContext.Provider
            value={{
                items,
                count,
                total,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                syncCart,
                isCartOpen,
                toggleCart,
                lastAddedProductId,
                setLastAddedProductId
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

// Hook for using the cart context
export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
