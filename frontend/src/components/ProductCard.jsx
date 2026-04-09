import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ProductCard({ product }) {
  const { t, tl } = useLanguage();
  const name = tl(product, 'name');
  const imgSrc = product.image || `https://placehold.co/600x400/0F172A/FFFFFF?text=${encodeURIComponent(name)}`;

  return (
    <Link to={`/products/${product._id}`} className="boeing-card" id={`product-card-${product._id}`}>
      <div className="boeing-card__img-wrap">
        <img
          src={imgSrc}
          alt={name}
          className="boeing-card__img"
          onError={(e) => { e.target.src = `https://placehold.co/600x400/0F172A/FFFFFF?text=MAHSULOT`; e.target.onerror = null; }}
        />
        <div className="boeing-card__overlay"></div>
      </div>
      <div className="boeing-card__content">
        <span className="boeing-card__category">{product.category}</span>
        <h3 className="boeing-card__title">{name}</h3>
        <div className="boeing-card__link">
          {t('productInfo')} <ArrowRight size={16} />
        </div>
      </div>
    </Link>
  );
}
