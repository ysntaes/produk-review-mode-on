import FeaturePreviewItem from './FeaturePreviewItem'

type FeaturePreviewSectionProps = {
  title: string
  description: string
  items: Array<{ title: string; body: string }>
}

function FeaturePreviewSection({ title, description, items }: FeaturePreviewSectionProps) {
  return (
    <section className="feature-card" aria-label="PRMO-002 feature preview">
      <div className="feature-card__header">
        <p className="hero-kicker">PRMO-002 preview</p>
        <h2>{title}</h2>
      </div>
      <p>{description}</p>
      <ul className="feature-list">
        {items.map((item) => (
          <FeaturePreviewItem key={item.title} title={item.title} body={item.body} />
        ))}
      </ul>
    </section>
  )
}

export default FeaturePreviewSection
