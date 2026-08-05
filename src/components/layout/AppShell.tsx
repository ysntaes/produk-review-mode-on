import { useEffect, useState } from 'react'
import CreatorSetupSection from '../CreatorSetupSection'
import FeaturePreviewSection from '../FeaturePreviewSection'
import ProductUnderstandingSection from '../ProductUnderstandingSection'

type ViewKey = 'Overview' | 'Projects' | 'Templates' | 'Settings'

type ReviewResult = {
  title: string
  hook: string
  content: string
  cta: string
}

type WorkflowState = {
  productName: string
  productContext: string
  audience: string
  creatorName: string
  creatorTone: string
  visualStyle: string
  sceneGoal: string
  sceneCount: string
  prompt: string
  reviewTitle: string
  reviewHook: string
  reviewContent: string
  reviewCta: string
}

type HistoryItem = {
  id: number
  title: string
  prompt: string
  review: ReviewResult
  data: WorkflowState
}

type ProjectItem = {
  id: number
  title: string
  status: string
  summary: string
  progress: string
}

type TemplateItem = {
  id: number
  title: string
  description: string
  fit: string
  defaults: Partial<WorkflowState>
}

type SettingsState = {
  notifications: boolean
  autoSave: boolean
  reviewTone: string
}

const navigationItems: Array<{ id: ViewKey; label: string }> = [
  { id: 'Overview', label: 'Overview' },
  { id: 'Projects', label: 'Projects' },
  { id: 'Templates', label: 'Templates' },
  { id: 'Settings', label: 'Settings' },
]

const detailCards = [
  {
    title: 'Current focus',
    body: 'Turn the foundation into a complete, connected product review workspace with working actions and lightweight navigation.',
  },
  {
    title: 'Next steps',
    body: 'The MVP now supports drafting, saving, exporting, and exploring review-ready content with dummy data.',
  },
]

const featureFocusItems = [
  {
    title: 'Guided review flow',
    body: 'Move from product context to prompt generation with a clear storyline in one workspace.',
  },
  {
    title: 'Reusable templates',
    body: 'Kick off a review with preset creative directions that can be adjusted in seconds.',
  },
  {
    title: 'Lightweight history',
    body: 'Keep earlier drafts close at hand and export them for sharing or handoff.',
  },
]

const productUnderstandingPoints = [
  {
    title: 'Product context',
    body: 'Capture the core product details that should guide later creative decisions.',
  },
  {
    title: 'Review alignment',
    body: 'Clarify the intended value, use case, and messaging direction for the product.',
  },
  {
    title: 'Workflow readiness',
    body: 'Prepare the experience for a smoother transition into the next review workflow steps.',
  },
]

const creatorSetupItems = [
  {
    title: 'Creator profile',
    body: 'Define the creative identity, tone, and presentation style that will guide the setup.',
  },
  {
    title: 'Creative direction',
    body: 'Capture the visual and narrative direction needed to keep the setup consistent.',
  },
  {
    title: 'Ready for review',
    body: 'Prepare the creator context for the next stage of the workflow with a clear summary.',
  },
]

const scenePlanningItems = [
  {
    title: 'Shot structure',
    body: 'Arrange the order of scenes so the product story feels clear and persuasive.',
  },
  {
    title: 'Product interaction',
    body: 'Show how the product is used or highlighted in each scene for stronger impact.',
  },
  {
    title: 'Narrative flow',
    body: 'Keep the visuals logical, engaging, and aligned with the review goal.',
  },
  {
    title: 'Review pacing',
    body: 'Balance the scene rhythm so the story feels deliberate and easy to follow.',
  },
]

const projectCards: ProjectItem[] = [
  {
    id: 1,
    title: 'Launch campaign brief',
    status: 'Storyboarding ready',
    summary: 'A polished review brief for a flagship product reveal with clear CTA direction.',
    progress: '82% complete',
  },
  {
    id: 2,
    title: 'Creator handoff',
    status: 'Prompt approved',
    summary: 'A review draft with voice and visuals aligned for the next creator pass.',
    progress: '64% complete',
  },
  {
    id: 3,
    title: 'Social cutdown',
    status: 'Draft exported',
    summary: 'A shorter version of the review motion with a more concise narrative arc.',
    progress: '47% complete',
  },
]

const templateCards: TemplateItem[] = [
  {
    id: 1,
    title: 'Launch spotlight',
    description: 'A bold and high-energy review flow for flagship product launches.',
    fit: 'Best for premium launches and social-first reveals.',
    defaults: {
      creatorTone: 'confident',
      visualStyle: 'cinematic',
      sceneGoal: 'Open with the product benefit, show the key interaction, then close on the emotional payoff.',
      sceneCount: '3',
    },
  },
  {
    id: 2,
    title: 'Everyday utility',
    description: 'A practical, approachable storyline for everyday use cases and value-led messaging.',
    fit: 'Best for utility-driven products and creator-led reviews.',
    defaults: {
      creatorTone: 'friendly',
      visualStyle: 'clean and modern',
      sceneGoal: 'Introduce the problem, show the solution in context, then reinforce the habit change.',
      sceneCount: '4',
    },
  },
  {
    id: 3,
    title: 'Expert breakdown',
    description: 'A more analytical flow for detailed product comparisons and feature education.',
    fit: 'Best for comparison reviews and thoughtful audience segments.',
    defaults: {
      creatorTone: 'expert',
      visualStyle: 'minimal and polished',
      sceneGoal: 'Highlight the core feature, prove the benefit, then compare it to common alternatives.',
      sceneCount: '5',
    },
  },
]

const initialWorkflowState: WorkflowState = {
  productName: '',
  productContext: '',
  audience: '',
  creatorName: '',
  creatorTone: '',
  visualStyle: '',
  sceneGoal: '',
  sceneCount: '3',
  prompt: '',
  reviewTitle: '',
  reviewHook: '',
  reviewContent: '',
  reviewCta: '',
}

const initialSettingsState: SettingsState = {
  notifications: true,
  autoSave: true,
  reviewTone: 'Confident',
}

function AppShell() {
  const [activeItem, setActiveItem] = useState<ViewKey>('Overview')
  const [workflowState, setWorkflowState] = useState<WorkflowState>(initialWorkflowState)
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>(() => {
    if (typeof window === 'undefined') {
      return []
    }

    const savedHistory = window.localStorage.getItem('review-workflow-history')
    if (!savedHistory) {
      return []
    }

    try {
      const parsedHistory = JSON.parse(savedHistory) as HistoryItem[]
      return Array.isArray(parsedHistory) ? parsedHistory : []
    } catch {
      window.localStorage.removeItem('review-workflow-history')
      return []
    }
  })
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)
  const [settings, setSettings] = useState<SettingsState>(initialSettingsState)

  useEffect(() => {
    window.localStorage.setItem('review-workflow-history', JSON.stringify(historyItems))
  }, [historyItems])

  useEffect(() => {
    if (!feedbackMessage) {
      return undefined
    }

    const timer = window.setTimeout(() => {
      setFeedbackMessage(null)
    }, 2200)

    return () => window.clearTimeout(timer)
  }, [feedbackMessage])

  const updateWorkflowState = (field: keyof WorkflowState, value: string) => {
    setWorkflowState((prev) => ({ ...prev, [field]: value }))
  }

  const showFeedback = (message: string) => {
    setFeedbackMessage(message)
  }

  const buildReviewDraft = () => {
    const resolvedTone = workflowState.creatorTone || settings.reviewTone.toLowerCase()
    const nextPrompt = [
      `Create a product review prompt for ${workflowState.productName || 'the featured product'}.`,
      `Product context: ${workflowState.productContext || 'Focus on the core product value and benefit.'}`,
      `Audience: ${workflowState.audience || 'Target buyers and curious viewers.'}`,
      `Creator: ${workflowState.creatorName || 'a confident creator'} with a ${resolvedTone || 'clear'} tone.`,
      `Visual direction: ${workflowState.visualStyle || 'modern and polished'} visuals.`,
      `Scene plan: ${workflowState.sceneGoal || 'Highlight the product clearly'} across ${workflowState.sceneCount || '3'} scenes.`,
    ].join(' ')

    const nextReview = {
      title: `${workflowState.productName || 'Featured product'} review draft`,
      hook: `${workflowState.creatorName || 'The creator'} presents ${workflowState.productName || 'this product'} as a smart choice for ${workflowState.audience || 'modern shoppers'}.`,
      content: `This review emphasizes ${workflowState.productContext || 'the product value'} while keeping the tone ${resolvedTone || 'confident'} and the storytelling clear. The sequence is shaped around ${workflowState.sceneGoal || 'the product journey'} over ${workflowState.sceneCount || '3'} scenes, with ${workflowState.visualStyle || 'a polished visual style'} guiding the presentation.`,
      cta: `Explore ${workflowState.productName || 'this product'} today and see how it fits into your routine.`,
    }

    const nextState: WorkflowState = {
      ...workflowState,
      prompt: nextPrompt,
      reviewTitle: nextReview.title,
      reviewHook: nextReview.hook,
      reviewContent: nextReview.content,
      reviewCta: nextReview.cta,
    }

    return { nextPrompt, nextReview, nextState }
  }

  const saveDraftToHistory = (message: string) => {
    const { nextPrompt, nextReview, nextState } = buildReviewDraft()

    setWorkflowState(nextState)
    setHistoryItems((prev) => [
      {
        id: Date.now(),
        title: nextReview.title,
        prompt: nextPrompt,
        review: nextReview,
        data: nextState,
      },
      ...prev,
    ])
    showFeedback(message)
  }

  const handleGeneratePrompt = () => {
    saveDraftToHistory('Review prompt generated and saved to history.')
  }

  const handleCopyPrompt = () => {
    if (!workflowState.prompt) {
      showFeedback('Generate a prompt first so there is something to copy.')
      return
    }

    if (!navigator.clipboard) {
      showFeedback('Clipboard is unavailable in this browser.')
      return
    }

    void navigator.clipboard.writeText(workflowState.prompt)
    showFeedback('Prompt copied to clipboard.')
  }

  const handleCopyReview = () => {
    if (!workflowState.reviewTitle && !workflowState.reviewContent) {
      showFeedback('Generate a review first so there is something to copy.')
      return
    }

    if (!navigator.clipboard) {
      showFeedback('Clipboard is unavailable in this browser.')
      return
    }

    const reviewText = `${workflowState.reviewTitle}\n\n${workflowState.reviewHook}\n\n${workflowState.reviewContent}\n\n${workflowState.reviewCta}`
    void navigator.clipboard.writeText(reviewText)
    showFeedback('Review copied to clipboard.')
  }

  const handleSaveDraft = () => {
    saveDraftToHistory('Draft saved and ready for later review.')
  }

  const handleClear = () => {
    setWorkflowState(initialWorkflowState)
    showFeedback('Workspace cleared to a fresh draft state.')
  }

  const handleLoadHistoryItem = (item: HistoryItem) => {
    setWorkflowState(item.data)
    setActiveItem('Overview')
    showFeedback(`Loaded ${item.title}.`)
  }

  const handleDownloadTxt = (text: string) => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'review-history.txt'
    link.click()
    URL.revokeObjectURL(url)
    showFeedback('TXT export started.')
  }

  const handleDownloadMarkdown = (text: string) => {
    const blob = new Blob([`# Review\n\n${text}`], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'review-history.md'
    link.click()
    URL.revokeObjectURL(url)
    showFeedback('Markdown export started.')
  }

  const handleApplyTemplate = (template: TemplateItem) => {
    setWorkflowState((prev) => ({
      ...prev,
      ...template.defaults,
      prompt: '',
      reviewTitle: '',
      reviewHook: '',
      reviewContent: '',
      reviewCta: '',
    }))
    setActiveItem('Overview')
    showFeedback(`Applied ${template.title} template.`)
  }

  const handleProjectAction = (action: string, title: string) => {
    showFeedback(`${action} ${title}.`)
  }

  const handleSaveSettings = () => {
    showFeedback('Preferences saved.')
  }

  const handleResetSettings = () => {
    setSettings(initialSettingsState)
    showFeedback('Settings reset to defaults.')
  }

  const hasPrompt = Boolean(workflowState.prompt)
  const hasReview = Boolean(workflowState.reviewTitle || workflowState.reviewContent)

  const renderOverview = () => (
    <>
      <section className="hero-card">
        <div className="hero-card__heading">
          <div>
            <p className="hero-kicker">Product review mode</p>
            <h2>Welcome to your review workspace</h2>
          </div>
          <span className="hero-badge">MVP complete</span>
        </div>
        <p>
          Build product review storyboards, creative direction, and campaign prompts from a polished workspace with connected actions.
        </p>
        <div className="hero-actions">
          <button type="button" className="topbar-btn" onClick={handleSaveDraft}>
            Save draft
          </button>
          <button type="button" className="prompt-generator__button prompt-generator__button--secondary" onClick={() => setActiveItem('Templates')}>
            Open templates
          </button>
        </div>
      </section>

      <FeaturePreviewSection
        title="Next feature area"
        description="This phase introduces a lightweight preview section that reflects the next incremental feature direction while staying within the current foundation."
        items={featureFocusItems}
      />

      <ProductUnderstandingSection
        title="Product understanding"
        description="Capture the product story clearly so the review workflow stays grounded in the right context."
        points={productUnderstandingPoints}
      />

      <div className="workflow-form">
        <label className="workflow-field">
          <span>Product Name</span>
          <input
            value={workflowState.productName}
            onChange={(event) => updateWorkflowState('productName', event.target.value)}
            placeholder="Enter the product name"
          />
        </label>
        <label className="workflow-field">
          <span>Product Context</span>
          <textarea
            value={workflowState.productContext}
            onChange={(event) => updateWorkflowState('productContext', event.target.value)}
            placeholder="Describe the product value and key benefit"
            rows={3}
          />
        </label>
        <label className="workflow-field">
          <span>Audience</span>
          <input
            value={workflowState.audience}
            onChange={(event) => updateWorkflowState('audience', event.target.value)}
            placeholder="Who is this review for?"
          />
        </label>
      </div>

      <CreatorSetupSection
        title="Creator setup"
        description="Define the creative identity and direction for the review experience in a lightweight, structured way."
        items={creatorSetupItems}
      />

      <div className="workflow-form">
        <label className="workflow-field">
          <span>Creator Name</span>
          <input
            value={workflowState.creatorName}
            onChange={(event) => updateWorkflowState('creatorName', event.target.value)}
            placeholder="Enter the creator name"
          />
        </label>
        <label className="workflow-field">
          <span>Creator Tone</span>
          <input
            value={workflowState.creatorTone}
            onChange={(event) => updateWorkflowState('creatorTone', event.target.value)}
            placeholder="Confident, playful, or expert"
          />
        </label>
        <label className="workflow-field">
          <span>Visual Style</span>
          <input
            value={workflowState.visualStyle}
            onChange={(event) => updateWorkflowState('visualStyle', event.target.value)}
            placeholder="Modern, polished, or cinematic"
          />
        </label>
      </div>

      <section className="scene-planning" aria-label="Scene planning">
        <div className="scene-planning__header">
          <p className="hero-kicker">MVP feature</p>
          <h2>Scene planning</h2>
          <p>Outline the visual story in a simple structure so the review flow feels more complete.</p>
        </div>

        <div className="scene-planning__content">
          {scenePlanningItems.map((item) => (
            <article className="scene-planning__card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>

        <div className="workflow-form workflow-form--compact">
          <label className="workflow-field">
            <span>Scene Goal</span>
            <textarea
              value={workflowState.sceneGoal}
              onChange={(event) => updateWorkflowState('sceneGoal', event.target.value)}
              placeholder="Describe what each scene should communicate"
              rows={3}
            />
          </label>
          <label className="workflow-field">
            <span>Scene Count</span>
            <input
              value={workflowState.sceneCount}
              onChange={(event) => updateWorkflowState('sceneCount', event.target.value)}
              placeholder="3"
            />
          </label>
        </div>
      </section>

      <section className="prompt-generator" aria-label="Prompt generator">
        <div className="prompt-generator__header">
          <p className="hero-kicker">MVP feature</p>
          <h2>AI prompt generator</h2>
          <p>Preview and copy a generated prompt for the current product workflow.</p>
        </div>

        <div className="prompt-generator__actions">
          <button type="button" className="topbar-btn prompt-generator__button" onClick={handleGeneratePrompt}>
            Generate Prompt
          </button>
          <button type="button" className="prompt-generator__button prompt-generator__button--secondary" onClick={handleCopyPrompt} disabled={!hasPrompt}>
            Copy Prompt
          </button>
        </div>

        <textarea className="prompt-generator__textarea" readOnly rows={7} value={workflowState.prompt} />
      </section>

      <section className="review-result" aria-label="AI review result">
        <div className="review-result__header">
          <p className="hero-kicker">MVP feature</p>
          <h2>AI review result</h2>
          <p>Preview a generated review draft for the current product storyline.</p>
        </div>

        <div className="prompt-generator__actions">
          <button type="button" className="topbar-btn prompt-generator__button" onClick={handleCopyReview} disabled={!hasReview}>
            Copy Review
          </button>
          <button type="button" className="prompt-generator__button prompt-generator__button--secondary" onClick={handleClear}>
            Clear
          </button>
        </div>

        <div className="review-result__content">
          <div className="review-result__field">
            <h3>Review Title</h3>
            <p>{workflowState.reviewTitle || 'No review title yet.'}</p>
          </div>
          <div className="review-result__field">
            <h3>Hook</h3>
            <p>{workflowState.reviewHook || 'No hook yet.'}</p>
          </div>
          <div className="review-result__field">
            <h3>Review Content</h3>
            <p>{workflowState.reviewContent || 'No review content yet.'}</p>
          </div>
          <div className="review-result__field">
            <h3>Call To Action</h3>
            <p>{workflowState.reviewCta || 'No CTA yet.'}</p>
          </div>
        </div>
      </section>

      <section className="history" aria-label="Review history">
        <div className="history__header">
          <p className="hero-kicker">MVP feature</p>
          <h2>History</h2>
          <p>Review a lightweight list of your previously generated review drafts.</p>
        </div>

        <div className="history__list">
          {historyItems.length === 0 ? (
            <div className="empty-state">No saved drafts yet. Generate a review to populate this workspace.</div>
          ) : (
            historyItems.map((item) => (
              <article className="history__item" key={item.id}>
              <button type="button" className="history__item--button" onClick={() => handleLoadHistoryItem(item)}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.prompt}</p>
                </div>
              </button>
              <div className="history__actions">
                <button
                  type="button"
                  className="prompt-generator__button prompt-generator__button--secondary"
                  onClick={() => {
                    if (navigator.clipboard) {
                      void navigator.clipboard.writeText(item.prompt)
                      showFeedback('History prompt copied.')
                    }
                  }}
                >
                  Copy
                </button>
                <button
                  type="button"
                  className="prompt-generator__button prompt-generator__button--secondary"
                  onClick={() => handleDownloadTxt(item.prompt)}
                >
                  Download TXT
                </button>
                <button
                  type="button"
                  className="prompt-generator__button prompt-generator__button--secondary"
                  onClick={() => handleDownloadMarkdown(item.prompt)}
                >
                  Download Markdown
                </button>
              </div>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="grid" aria-label="Workspace overview">
        {detailCards.map((card) => (
          <article className="panel" key={card.title}>
            <h3>{card.title}</h3>
            <p>{card.body}</p>
          </article>
        ))}
      </section>
    </>
  )

  const renderProjects = () => (
    <section className="workspace-panel" aria-label="Projects overview">
      <div className="workspace-panel__header">
        <div>
          <p className="hero-kicker">Project hub</p>
          <h2>Review workspaces</h2>
        </div>
        <button type="button" className="topbar-btn" onClick={() => handleProjectAction('Created', 'a fresh review project')}>
          Create project
        </button>
      </div>

      <div className="project-grid">
        {projectCards.map((project) => (
          <article className="project-card" key={project.id}>
            <div className="project-card__top">
              <div>
                <p className="project-card__status">{project.status}</p>
                <h3>{project.title}</h3>
              </div>
              <span className="hero-badge">{project.progress}</span>
            </div>
            <p>{project.summary}</p>
            <div className="project-card__actions">
              <button type="button" className="topbar-btn" onClick={() => handleProjectAction('Opened', project.title)}>
                Open
              </button>
              <button type="button" className="prompt-generator__button prompt-generator__button--secondary" onClick={() => handleProjectAction('Duplicated', project.title)}>
                Duplicate
              </button>
              <button type="button" className="prompt-generator__button prompt-generator__button--secondary" onClick={() => handleProjectAction('Archived', project.title)}>
                Archive
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )

  const renderTemplates = () => (
    <section className="workspace-panel" aria-label="Templates gallery">
      <div className="workspace-panel__header">
        <div>
          <p className="hero-kicker">Reusable templates</p>
          <h2>Pick a starting point</h2>
          <p>Choose a structure and use it to kick-start your next product review draft.</p>
        </div>
      </div>

      <div className="template-grid">
        {templateCards.map((template) => (
          <article className="template-card" key={template.id}>
            <div className="template-card__top">
              <h3>{template.title}</h3>
              <span className="hero-badge">{template.fit}</span>
            </div>
            <p>{template.description}</p>
            <button type="button" className="topbar-btn" onClick={() => handleApplyTemplate(template)}>
              Use template
            </button>
          </article>
        ))}
      </div>
    </section>
  )

  const renderSettings = () => (
    <section className="workspace-panel" aria-label="Settings">
      <div className="workspace-panel__header">
        <div>
          <p className="hero-kicker">Workspace preferences</p>
          <h2>Review mode settings</h2>
          <p>Adjust the working defaults behind your review workflow without switching tools.</p>
        </div>
      </div>

      <div className="settings-grid">
        <article className="settings-card">
          <label className="toggle-row">
            <span>Enable notifications</span>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(event) => setSettings((prev) => ({ ...prev, notifications: event.target.checked }))}
            />
          </label>
          <label className="toggle-row">
            <span>Auto-save drafts</span>
            <input
              type="checkbox"
              checked={settings.autoSave}
              onChange={(event) => setSettings((prev) => ({ ...prev, autoSave: event.target.checked }))}
            />
          </label>
          <label className="settings-field">
            <span>Default review tone</span>
            <select
              value={settings.reviewTone}
              onChange={(event) => setSettings((prev) => ({ ...prev, reviewTone: event.target.value }))}
            >
              <option value="Confident">Confident</option>
              <option value="Friendly">Friendly</option>
              <option value="Expert">Expert</option>
            </select>
          </label>
        </article>

        <article className="settings-card settings-card--accent">
          <h3>Quick actions</h3>
          <p>These controls keep your review workflow ready for the next handoff or creative pass.</p>
          <div className="project-card__actions">
            <button type="button" className="topbar-btn" onClick={handleSaveSettings}>
              Save preferences
            </button>
            <button type="button" className="prompt-generator__button prompt-generator__button--secondary" onClick={handleResetSettings}>
              Reset defaults
            </button>
          </div>
        </article>
      </div>
    </section>
  )

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="brand">
            <div className="brand-mark">PR</div>
            <div>
              <h2>Product Review</h2>
              <p>Mode On</p>
            </div>
          </div>

          <nav className="nav" aria-label="Primary navigation">
            <ul>
              {navigationItems.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={item.id === activeItem ? 'nav-link active' : 'nav-link'}
                    onClick={() => setActiveItem(item.id)}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="sidebar-footer">
          <p>Creative workspace</p>
          <span>Now with connected flows</span>
        </div>
      </aside>

      <div className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">Sprint 1</p>
            <h1>{activeItem}</h1>
          </div>
          <div className="topbar-actions">
            <button type="button" className="prompt-generator__button prompt-generator__button--secondary" onClick={handleSaveDraft}>
              Save draft
            </button>
            <button type="button" className="topbar-btn" onClick={() => setActiveItem('Overview')}>
              New project
            </button>
          </div>
        </header>

        <main className="content">
          {feedbackMessage ? <div className="feedback-banner">{feedbackMessage}</div> : null}

          {activeItem === 'Overview' && renderOverview()}
          {activeItem === 'Projects' && renderProjects()}
          {activeItem === 'Templates' && renderTemplates()}
          {activeItem === 'Settings' && renderSettings()}
        </main>
      </div>
    </div>
  )
}

export default AppShell
