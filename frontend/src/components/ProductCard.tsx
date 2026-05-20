import type { Product } from '../types'

interface Props {
  product: Product
  onClick: (product: Product) => void
}

export default function ProductCard({ product, onClick }: Props) {
  const isAvailable = product.status === 'available'

  return (
    <div
      className={`product-card ${!isAvailable ? 'unavailable' : ''}`}
      onClick={() => isAvailable && onClick(product)}
      role="button"
      tabIndex={isAvailable ? 0 : -1}
      onKeyDown={e => e.key === 'Enter' && isAvailable && onClick(product)}
    >
      {/* Image */}
      <div className="product-img-wrap">
        {product.image_path ? (
          <img src={product.image_path} alt={product.name} loading="lazy" />
        ) : (
          <div className="product-img-placeholder">
            <i className="fas fa-mug-hot" style={{ fontSize: '2.5rem', color: 'rgba(212,175,55,0.2)' }} />
          </div>
        )}

        {!isAvailable && (
          <span className="product-badge unavailable-badge">Sold Out</span>
        )}
      </div>

      {/* Body */}
      <div className="product-body">
        <div className="product-category">{product.category}</div>
        <div className="product-name">{product.name}</div>

        {product.description && (
          <div className="product-desc">{product.description}</div>
        )}

        <div className="product-footer">
          <div className="product-price">
            <span>₱</span>
            {product.price.toFixed(2)}
          </div>

          {isAvailable && (
            <button
              className="add-to-cart-btn"
              onClick={e => {
                e.stopPropagation()
                onClick(product)
              }}
              aria-label={`Add ${product.name} to cart`}
            >
              <i className="fas fa-plus" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
