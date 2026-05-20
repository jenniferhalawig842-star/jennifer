const items = [
  'Single Origin Beans',
  '100% Ethical Sourcing',
  'Small-Batch Roasting',
  'Expert Baristas',
  '15+ Origins Worldwide',
  'Seasonal Specials',
]

export default function Ribbon() {
  // Duplicate items for seamless loop
  const all = [...items, ...items]

  return (
    <div className="ribbon" aria-hidden="true">
      <div className="ribbon-track">
        {all.map((item, i) => (
          <span key={i} className="ribbon-item">
            <i className="fas fa-circle" />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
