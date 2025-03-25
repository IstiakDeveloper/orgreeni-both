import React, {
    createContext,
    useState,
    useEffect,
    useContext,
    ReactNode
} from 'react';
import { router } from '@inertiajs/react';

// Comprehensive Cart Item Interface
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
    category?: {
        id: number;
        name: string;
    };
}

// Extended Cart Context Interface
interface CartContextType {
    // Core cart properties
    items: { [key: number]: CartItem };
    count: number;
    total: number;

    // Product interaction methods
    addToCart: (product: any, quantity?: number) => boolean;
    removeFromCart: (productId: number, quantity?: number) => void;
    updateQuantity: (productId: number, newQuantity: number) => boolean;
    clearCart: () => void;

    // Cart state management
    isCartOpen: boolean;
    toggleCart: () => void;
    openCart: () => void;
    closeCart: () => void;

    // Sync and tracking
    syncCart: () => Promise<any>;
    restoreCart: () => Promise<void>;
    lastAddedProductId: number | null;
    setLastAddedProductId: React.Dispatch<React.SetStateAction<number | null>>;

    // Additional utilities
    getItemTotal: (item: CartItem) => number;
    hasItemInCart: (productId: number) => boolean;
}

// Create the context with a default value
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider component with comprehensive cart management
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // State management
    const [items, setItems] = useState<{ [key: number]: CartItem }>({});
    const [count, setCount] = useState(0);
    const [total, setTotal] = useState(0);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [lastAddedProductId, setLastAddedProductId] = useState<number | null>(null);

    // Calculation methods
    const calculateTotal = (cartItems: { [key: number]: CartItem }): number => {
        return Object.values(cartItems).reduce(
            (sum, item) => sum + ((item.special_price || item.price) * item.quantity),
            0
        );
    };

    // Cart state persistence and synchronization
    useEffect(() => {
        // Load cart from session storage on initial load
        const savedCart = sessionStorage.getItem('cart');
        if (savedCart) {
            try {
                const { items: savedItems, count: savedCount, total: savedTotal } = JSON.parse(savedCart);
                setItems(savedItems || {});
                setCount(savedCount || 0);
                setTotal(savedTotal || 0);
            } catch (error) {
                console.error('Failed to parse cart data from session storage', error);
            }
        }

        // Restore cart from backend
        restoreCart();

        // Check if cart should be open
        const cartOpen = localStorage.getItem('cartOpen') === 'true';
        setIsCartOpen(cartOpen);
    }, []);

    // Save cart to session storage and manage layout
    useEffect(() => {
        // Save to session storage
        const cart = { items, count, total };
        sessionStorage.setItem('cart', JSON.stringify(cart));

        // Manage cart open state
        localStorage.setItem('cartOpen', isCartOpen.toString());

        // Adjust main content margin
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.style.marginRight = isCartOpen ? '320px' : '0';
            mainContent.style.transition = 'margin-right 0.3s ease-in-out';
        }
    }, [items, count, total, isCartOpen]);

    // Cart interaction methods
    // In the addToCart method
    const addToCart = (product: any, quantity = 1): boolean => {
        // Validate product
        if (!product || !product.id) {
            console.error('Invalid product', product);
            return false;
        }

        // Immediately log the cart addition attempt
        console.log('Adding to cart:', {
            product: product.id,
            quantity,
            currentItems: Object.keys(items)
        });

        // Check stock availability
        const currentQuantity = items[product.id]?.quantity || 0;
        const totalRequestedQuantity = currentQuantity + quantity;

        if (totalRequestedQuantity > product.stock) {
            alert(`দুঃখিত, শুধুমাত্র ${product.stock}টি স্টকে আছে। বর্তমান কার্টে ${currentQuantity} আছে।`);
            return false;
        }

        // Update items
        setItems(prevItems => {
            const newItems = { ...prevItems };

            if (newItems[product.id]) {
                // Update existing item
                newItems[product.id] = {
                    ...newItems[product.id],
                    quantity: newItems[product.id].quantity + quantity
                };
            } else {
                // Add new item
                newItems[product.id] = {
                    id: product.id,
                    product_id: product.id,
                    name: product.name,
                    price: product.price,
                    special_price: product.special_price,
                    quantity: quantity,
                    unit: product.unit,
                    stock: product.stock,
                    category: product.category,
                    image: product.images && product.images.length > 0
                        ? product.images.find((img: any) => img.is_primary)?.image || product.images[0].image
                        : undefined
                };
            }

            // Update count and total
            const newCount = Object.values(newItems).reduce((sum, item) => sum + item.quantity, 0);
            const newTotal = calculateTotal(newItems);

            setCount(newCount);
            setTotal(newTotal);

            // Log cart state after update
            console.log('Cart updated:', {
                items: newItems,
                count: newCount,
                total: newTotal
            });

            // Trigger background sync
            syncCart();

            return newItems;
        });

        // Immediately save to session storage
        const cart = { items, count, total };
        sessionStorage.setItem('cart', JSON.stringify(cart));

        // Highlight and reset last added product
        setLastAddedProductId(product.id);
        setTimeout(() => setLastAddedProductId(null), 2000);

        // Automatically open cart
        openCart();

        return true;
    };

    const removeFromCart = (productId: number, quantity = 1) => {
        setItems(prevItems => {
            const newItems = { ...prevItems };

            if (newItems[productId]) {
                // Remove item or reduce quantity
                if (newItems[productId].quantity <= quantity) {
                    delete newItems[productId];
                } else {
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

            // Trigger background sync
            syncCart();

            return newItems;
        });
    };

    const updateQuantity = (productId: number, newQuantity: number): boolean => {
        const item = items[productId];
        if (!item) return false;

        // Stock validation
        if (newQuantity > item.stock) {
            alert(`দুঃখিত, শুধুমাত্র ${item.stock}টি স্টকে আছে।`);
            return false;
        }

        // Remove or update
        if (newQuantity <= 0) {
            removeFromCart(productId);
            return true;
        }

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

            // Trigger background sync
            syncCart();

            return newItems;
        });

        return true;
    };

    const clearCart = () => {
        setItems({});
        setCount(0);
        setTotal(0);
        sessionStorage.removeItem('cart');
        syncCart();
    };

    // Cart state methods
    const toggleCart = () => setIsCartOpen(prev => !prev);
    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    // Synchronization methods
    // Modify syncCart method
    const syncCart = async () => {
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            if (!csrfToken) {
                console.warn('CSRF token not found');
                return { success: false };
            }

            const cartItems = Object.values(items).map(item => ({
                product_id: item.product_id,
                quantity: item.quantity
            }));

            // Force sync even if cart is empty
            const response = await fetch('/api/cart/sync', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ items: cartItems })
            });

            const responseData = await response.json();

            // Log sync response for debugging
            console.log('Cart Sync Response:', responseData);

            return responseData;
        } catch (error) {
            console.error('Cart Sync Error:', error);
            return { success: false, error: String(error) };
        }
    };

    // Modify restoreCart to force restoration
    const restoreCart = async () => {
        try {
            const response = await fetch('/api/cart/restore', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            if (!response.ok) {
                console.error('Failed to restore cart', response);
                throw new Error('Failed to restore cart');
            }

            const { items: backendItems } = await response.json();

            // Log restored items for debugging
            console.log('Restored Cart Items:', backendItems);

            if (backendItems && Object.keys(backendItems).length > 0) {
                setItems(backendItems);
                setCount(Object.values(backendItems).reduce((sum, item) => sum + item.quantity, 0));
                setTotal(calculateTotal(backendItems));
            }
        } catch (error) {
            console.error('Cart Restore Error:', error);
        }
    };

    // Utility methods
    const getItemTotal = (item: CartItem): number =>
        (item.special_price || item.price) * item.quantity;

    const hasItemInCart = (productId: number): boolean =>
        productId in items;

    return (
        <CartContext.Provider
            value={{
                // Core properties
                items,
                count,
                total,

                // Interaction methods
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,

                // Cart state methods
                isCartOpen,
                toggleCart,
                openCart,
                closeCart,

                // Sync and tracking
                syncCart,
                restoreCart,
                lastAddedProductId,
                setLastAddedProductId,

                // Utility methods
                getItemTotal,
                hasItemInCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

// Custom hook for using cart context
export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export default CartContext;
