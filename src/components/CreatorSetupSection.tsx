type CreatorSetupItem = {
  title: string
  body: string
}

type CreatorSetupSectionProps = {
  title: string
  description: string
  items: CreatorSetupItem[]
}

function CreatorSetupSection({ title, description, items }: CreatorSetupSectionProps) {
  return (
    <section className="creator-setup" aria-label="Creator setup">
      <div className="creator-setup__header">
        <p className="hero-kicker">PRMO-004</p>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      <div className="creator-setup__content">
        {items.map((item) => (
          <article className="creator-setup__card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default CreatorSetupSection
