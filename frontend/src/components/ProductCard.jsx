import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getCategoryLabel } from '../utils/categoryTranslation';

export default function ProductCard({ product }) {
  const { t, tl } = useLanguage();
  const name = tl(product, 'name');
  const categoryLabel = getCategoryLabel(t, product.category);
  
  const getFallbackImage = (productName) => {
    const s = (productName || '').toLowerCase();
    if (s.includes('issiqxona') || s.includes('agro') || s.includes('poly')) return '/images/products/agro.png';
    if (s.includes('termo') || s.includes('shrink')) return '/images/products/shrink.png';
    if (s.includes('roof') || s.includes('tom') || s.includes('gidro')) return '/images/products/build.png';
    if (s.includes('pet') || s.includes('paket') || s.includes('oziq')) return '/images/products/food.png';
    
    // Consistent random fallback based on string length
    const fallbacks = [
       '/images/products/agro.png',
       '/images/products/shrink.png',
       '/images/products/build.png',
       '/images/products/food.png'
    ];
    return fallbacks[s.length % 4];
  };

  const imgSrc = (product.image && product.image !== '' && product.image !== 'no-image.jpg') 
      ? product.image 
      : getFallbackImage(name);

  return (
    <Link 
      to={`/products/${product._id}`} 
      id={`product-card-${product._id}`}
      style={{
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 16, 
        overflow: 'hidden',
        textDecoration: 'none',
        position: 'relative',
        height: 280,
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease',
      }}
      onMouseEnter={(e) => { 
        e.currentTarget.style.transform = 'translateY(-6px)'; 
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)'; 
        const arrow = e.currentTarget.querySelector('.boeing-card__arrow');
        if(arrow) arrow.style.transform = 'translateX(6px)';
        const img = e.currentTarget.querySelector('.boeing-card__img-hover');
        if(img) img.style.transform = 'scale(1.08)';
      }}
      onMouseLeave={(e) => { 
        e.currentTarget.style.transform = 'translateY(0)'; 
        e.currentTarget.style.boxShadow = 'none'; 
        const arrow = e.currentTarget.querySelector('.boeing-card__arrow');
        if(arrow) arrow.style.transform = 'translateX(0)';
        const img = e.currentTarget.querySelector('.boeing-card__img-hover');
        if(img) img.style.transform = 'scale(1)';
      }}
    >
      <img
        src={imgSrc}
        alt={name}
        className="boeing-card__img-hover"
        style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}
        onError={(e) => { e.target.src = getFallbackImage(name); e.target.onerror = null; }}
      />
      {/* Elegant smooth gradient overlay purely for typography contrast */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(to top, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0.3) 50%, rgba(15,23,42,0) 100%)',
        zIndex: 1,
        pointerEvents: 'none'
      }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24, zIndex: 2, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 500, color: '#FFFFFF', marginBottom: 8, lineHeight: 1.3, letterSpacing: '0.3px' }}>{name}</h3>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#ffffffff', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
          {t('productInfo')} <ArrowRight className="boeing-card__arrow" size={16} style={{ transition: 'transform 0.3s ease' }} />
        </div>
      </div>
    </Link>
  );
}
