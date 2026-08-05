type ProductPoint = {
  title: string
  body: string
}

type ProductUnderstandingSectionProps = {
  title: string
  description: string
  points: ProductPoint[]
}

function ProductUnderstandingSection({
  title,
  description,
  points,
}: ProductUnderstandingSectionProps) {
  return (
    <section className="product-understanding" aria-label="Product understanding">
      <div className="product-understanding__header">
        <p className="hero-kicker">PRMO-003</p>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      <div className="product-understanding__content">
        <article className="product-understanding__card">
          <h3>Core focus</h3>
          <ul className="product-understanding__list">
            {points.map((point) => (
              <li key={point.title}>
                <strong>{point.title}</strong>
                <span>{point.body}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="product-understanding__card product-understanding__card--accent">
          <h3>Why this matters</h3>
          <p>
            This stage helps confirm the product context clearly so the later
            creative workflow stays grounded in the right message and use case.
          </p>
        </article>
      </div>
    </section>
  )
}

export default ProductUnderstandingSection
