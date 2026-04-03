import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from './Toast';

const categoryLabels = {
  "oddiy": "Oddiy plyonka",
  "uv_plyonka": "UV himoyali",
  "kop_qavatli": "Ko'p qavatli",
  "maxsus": "Maxsus plyonka",
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
        src={product.image || `https://placehold.co/400x300/F1F5F9/334155?text=${encodeURIComponent(product.name)}`}
        alt={product.name}
        className="product-card-image"
        onError={(e) => { e.target.src = `https://placehold.co/400x300/F1F5F9/334155?text=MAHSULOT`; e.target.onerror = null; }}
      />
      <div className="product-card-body">
        <div className="product-card-category">
          {categoryLabels[product.category] || product.category}
        </div>
        <h3 className="product-card-name">{product.name}</h3>
        {product.thickness && (
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
            Qalinlik: <strong style={{color: 'var(--color-text)'}}>{product.thickness} mkm</strong> <br/> Eni: <strong style={{color: 'var(--color-text)'}}>{product.width || '-'} m</strong>
          </div>
        )}
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
