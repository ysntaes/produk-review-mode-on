type FeaturePreviewItemProps = {
  title: string
  body: string
}

function FeaturePreviewItem({ title, body }: FeaturePreviewItemProps) {
  return (
    <li className="feature-list__item">
      <strong>{title}</strong>
      <span>{body}</span>
    </li>
  )
}

export default FeaturePreviewItem
