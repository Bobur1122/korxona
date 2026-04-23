import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [promoCode, setPromoCode] = useState(null);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.product === product._id);
      const currentLang = localStorage.getItem('grandplast-lang') || 'uz';
      const localizedName =
        product[`name_${currentLang}`] ||
        product.name_en ||
        product.name_ru ||
        product.name_uz ||
        product.name ||
        '';

      if (existing) {
        return prev.map(i =>
          i.product === product._id
            ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
            : i
        );
      }
      return [...prev, {
        product: product._id,
        name: localizedName,
        price: product.price,
        image: product.image,
        images: product.images,
        stock: product.stock,
        quantity
      }];
    });
  };

  const removeItem = (productId) => {
    setItems(prev => prev.filter(i => i.product !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return removeItem(productId);
    setItems(prev => prev.map(i =>
      i.product === productId ? { ...i, quantity: Math.min(quantity, i.stock) } : i
    ));
  };

  const clearCart = () => {
    setItems([]);
    setPromoCode(null);
    setDiscount(0);
  };

  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discountAmount = Math.round(totalPrice * discount / 100);
  const finalPrice = totalPrice - discountAmount;
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const applyPromo = (code, discountPercent) => {
    setPromoCode(code);
    setDiscount(discountPercent);
  };

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQuantity, clearCart,
      totalPrice, discountAmount, finalPrice, totalItems,
      promoCode, discount, applyPromo
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
