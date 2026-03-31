import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from './Toast';

const categoryLabels = {
  "ko'ylak": "Ko'ylak",
  "shim": "Shim",
  "kostyum": "Kostyum",
  "palto": "Palto",
  "sport": "Sport kiyim",
  "boshqa": "Boshqa"
};

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { addToast } = useToast();
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock > 0 && !added) {
      addItem(product);
      setAdded(true);
      addToast(`"${product.name}" savatga qo'shildi!`, 'success');
      setTimeout(() => setAdded(false), 1500);
    }
  };

  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <img
        src={product.image || `https://placehold.co/400x300/f1f5f9/64748b?text=${encodeURIComponent(product.name)}`}
        alt={product.name}
        className="product-card-image"
      />
      <div className="product-card-body">
        <div className="product-card-category">
          {categoryLabels[product.category] || product.category}
        </div>
        <h3 className="product-card-name">{product.name}</h3>
        <div className="product-card-price">
          {product.price.toLocaleString()} <span>so'm</span>
        </div>
        <div className="product-card-footer">
          <span className={`product-stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
            {product.stock > 0 ? `${product.stock} dona` : 'Tugagan'}
          </span>
          <button
            className={`btn btn-sm ${added ? 'btn-added' : 'btn-primary'}`}
            onClick={handleAdd}
            disabled={product.stock === 0}
            id={`add-to-cart-${product._id}`}
          >
            {added ? (
              <>
                <Check size={14} className="cart-check-icon" />
                Qo'shildi
              </>
            ) : (
              <>
                <ShoppingCart size={14} />
                Savatga
              </>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
