import { useEffect, useState, type ChangeEvent } from 'react'

type ProductInfoState = {
  productName: string
  brand: string
  category: string
  marketplaceUrl: string
  price: string
  shortDescription: string
}

type ProductUnderstandingState = {
  targetAudience: string
  problems: string
  benefits: string
  usp: string
  cta: string
}

type ProductImageState = {
  id: string
  src: string
  name: string
}

type PromptHistoryItem = {
  id: string
  title: string
  text: string
  createdAt: string
}

type ReviewDraftState = {
  title: string
  hook: string
  body: string
  cta: string
}

type ReviewHistoryItem = {
  id: string
  title: string
  hook: string
  body: string
  cta: string
  createdAt: string
}

type ProductPreset = {
  id: string
  label: string
  productInfo: ProductInfoState
  understanding: ProductUnderstandingState
}

const initialProductInfoState: ProductInfoState = {
  productName: '',
  brand: '',
  category: '',
  marketplaceUrl: '',
  price: '',
  shortDescription: '',
}

const initialProductUnderstandingState: ProductUnderstandingState = {
  targetAudience: '',
  problems: '',
  benefits: '',
  usp: '',
  cta: '',
}

const initialReviewDraftState: ReviewDraftState = {
  title: '',
  hook: '',
  body: '',
  cta: '',
}

const productPresets: ProductPreset[] = [
  {
    id: 'tech-gadget',
    label: 'Tech gadget',
    productInfo: {
      productName: 'Aurora Smart Speaker',
      brand: 'Northstar',
      category: 'Audio',
      marketplaceUrl: 'https://example.com/aurora-smart-speaker',
      price: '$129.99',
      shortDescription: 'A compact smart speaker that blends immersive sound with conversational voice controls and seamless home integration.',
    },
    understanding: {
      targetAudience: 'Busy professionals and modern households seeking hands-free convenience',
      problems: 'Limited smart home control and mediocre sound quality in small spaces',
      benefits: 'Fast voice control, rich audio, and a polished design that fits effortlessly into daily routines',
      usp: 'A wireless design with studio-grade sound and a built-in adaptive assistant',
      cta: 'Explore the speaker and bring a smarter listening experience into your home.',
    },
  },
  {
    id: 'skincare',
    label: 'Skincare',
    productInfo: {
      productName: 'Velora Night Serum',
      brand: 'Luma Skin',
      category: 'Skincare',
      marketplaceUrl: 'https://example.com/velora-night-serum',
      price: '$54.00',
      shortDescription: 'A lightweight nightly serum designed to hydrate, restore, and brighten the skin while you sleep.',
    },
    understanding: {
      targetAudience: 'Beauty-conscious shoppers looking for a simple nighttime ritual',
      problems: 'Dryness, dullness, and inconsistent overnight care routines',
      benefits: 'A calmer complexion, better hydration, and visible radiance without a complicated routine',
      usp: 'A fragrance-free formula balanced with botanicals and barrier-supporting ingredients',
      cta: 'Try the serum and upgrade your nightly skincare ritual today.',
    },
  },
  {
    id: 'home-office',
    label: 'Home office',
    productInfo: {
      productName: 'Slate Desk Lamp',
      brand: 'Monarch Studio',
      category: 'Home office',
      marketplaceUrl: 'https://example.com/slate-desk-lamp',
      price: '$79.00',
      shortDescription: 'A minimalist desk lamp with adjustable brightness and a compact profile built for focused work at home.',
    },
    understanding: {
      targetAudience: 'Remote workers and creative professionals building calm workspaces',
      problems: 'Poor lighting and distracting desk clutter during long work sessions',
      benefits: 'Sharper visibility, less eye strain, and a cleaner setup that supports deep focus',
      usp: 'A sculptural form with precision lighting and an easy-to-aim head',
      cta: 'Bring a more focused work setup home with this refined desk lamp.',
    },
  },
]

const loadWorkspaceDraft = () => {
  if (typeof window === 'undefined') {
    return null
  }

  const savedDraft = window.localStorage.getItem('product-review-workspace-state')
  if (!savedDraft) {
    return null
  }

  try {
    const parsedDraft = JSON.parse(savedDraft) as {
      productInfo?: Partial<ProductInfoState>
      understanding?: Partial<ProductUnderstandingState>
      prompt?: string
      reviewDraft?: Partial<ReviewDraftState>
      images?: ProductImageState[]
    }

    return parsedDraft
  } catch {
    window.localStorage.removeItem('product-review-workspace-state')
    return null
  }
}

function AppShell() {
  const [productInfo, setProductInfo] = useState<ProductInfoState>(() => {
    const savedDraft = loadWorkspaceDraft()
    return savedDraft?.productInfo ? { ...initialProductInfoState, ...savedDraft.productInfo } : initialProductInfoState
  })
  const [understanding, setUnderstanding] = useState<ProductUnderstandingState>(() => {
    const savedDraft = loadWorkspaceDraft()
    return savedDraft?.understanding
      ? { ...initialProductUnderstandingState, ...savedDraft.understanding }
      : initialProductUnderstandingState
  })
  const [images, setImages] = useState<ProductImageState[]>(() => {
    const savedDraft = loadWorkspaceDraft()
    return Array.isArray(savedDraft?.images) ? savedDraft.images : []
  })
  const [prompt, setPrompt] = useState(() => {
    const savedDraft = loadWorkspaceDraft()
    return typeof savedDraft?.prompt === 'string' ? savedDraft.prompt : ''
  })
  const [promptHistory, setPromptHistory] = useState<PromptHistoryItem[]>(() => {
    if (typeof window === 'undefined') {
      return []
    }

    const savedHistory = window.localStorage.getItem('product-review-prompt-history')
    if (!savedHistory) {
      return []
    }

    try {
      const parsedHistory = JSON.parse(savedHistory) as PromptHistoryItem[]
      return Array.isArray(parsedHistory) ? parsedHistory : []
    } catch {
      window.localStorage.removeItem('product-review-prompt-history')
      return []
    }
  })
  const [reviewDraft, setReviewDraft] = useState<ReviewDraftState>(() => {
    const savedDraft = loadWorkspaceDraft()
    return savedDraft?.reviewDraft
      ? { ...initialReviewDraftState, ...savedDraft.reviewDraft }
      : initialReviewDraftState
  })
  const [reviewHistory, setReviewHistory] = useState<ReviewHistoryItem[]>(() => {
    if (typeof window === 'undefined') {
      return []
    }

    const savedReviews = window.localStorage.getItem('product-review-review-history')
    if (!savedReviews) {
      return []
    }

    try {
      const parsedReviews = JSON.parse(savedReviews) as ReviewHistoryItem[]
      return Array.isArray(parsedReviews) ? parsedReviews : []
    } catch {
      window.localStorage.removeItem('product-review-review-history')
      return []
    }
  })
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('product-review-prompt-history', JSON.stringify(promptHistory))
    }
  }, [promptHistory])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(
        'product-review-workspace-state',
        JSON.stringify({ productInfo, understanding, prompt, reviewDraft, images }),
      )
    }
  }, [productInfo, understanding, prompt, reviewDraft, images])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('product-review-review-history', JSON.stringify(reviewHistory))
    }
  }, [reviewHistory])

  useEffect(() => {
    if (!feedbackMessage) {
      return undefined
    }

    const timer = window.setTimeout(() => {
      setFeedbackMessage(null)
    }, 2200)

    return () => window.clearTimeout(timer)
  }, [feedbackMessage])

  const showFeedback = (message: string) => {
    setFeedbackMessage(message)
  }

  const updateProductInfo = (field: keyof ProductInfoState, value: string) => {
    setProductInfo((prevState) => ({ ...prevState, [field]: value }))
  }

  const updateUnderstanding = (field: keyof ProductUnderstandingState, value: string) => {
    setUnderstanding((prevState) => ({ ...prevState, [field]: value }))
  }

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) {
      return
    }

    const uploads = Array.from(files).map(
      (file) =>
        new Promise<ProductImageState>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => {
            resolve({
              id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
              src: typeof reader.result === 'string' ? reader.result : '',
              name: file.name,
            })
          }
          reader.onerror = () => reject(reader.error)
          reader.readAsDataURL(file)
        }),
    )

    void Promise.all(uploads)
      .then((newImages) => {
        setImages((prevState) => [...newImages, ...prevState])
        showFeedback(`${newImages.length} image${newImages.length > 1 ? 's' : ''} added.`)
      })
      .catch(() => {
        showFeedback('Unable to upload one or more images.')
      })

    event.target.value = ''
  }

  const handleRemoveImage = (imageId: string) => {
    setImages((prevState) => prevState.filter((image) => image.id !== imageId))
  }

  const buildPromptText = (nextProductInfo: ProductInfoState, nextUnderstanding: ProductUnderstandingState, nextImages: ProductImageState[]) => [
    `Create a persuasive product review prompt for ${nextProductInfo.productName || 'this product'}.`,
    `Brand: ${nextProductInfo.brand || 'not specified'}.`,
    `Category: ${nextProductInfo.category || 'not specified'}.`,
    `Marketplace URL: ${nextProductInfo.marketplaceUrl || 'not provided'}.`,
    `Price: ${nextProductInfo.price || 'not listed'}.`,
    `Short description: ${nextProductInfo.shortDescription || 'Summarize the product in a crisp, engaging way.'}`,
    `Target audience: ${nextUnderstanding.targetAudience || 'the ideal buyer'}.`,
    `Problems: ${nextUnderstanding.problems || 'Describe the core issue this product solves.'}`,
    `Benefits: ${nextUnderstanding.benefits || 'Highlight the value and outcomes for the user.'}`,
    `USP: ${nextUnderstanding.usp || 'Call out the differentiating advantage.'}`,
    `CTA: ${nextUnderstanding.cta || 'Encourage the audience to explore or buy the product.'}`,
    nextImages.length > 0
      ? `Visual references: ${nextImages.length} uploaded image${nextImages.length > 1 ? 's' : ''} should be considered in the review setup.`
      : 'Visual references: no product images uploaded.',
  ].join('\n')

  const createGeneratedPrompt = () => buildPromptText(productInfo, understanding, images)

  const handleGeneratePrompt = () => {
    const generatedPrompt = createGeneratedPrompt()

    setPrompt(generatedPrompt)
    setPromptHistory((prevState) => [
      {
        id: `${Date.now()}`,
        title: productInfo.productName || 'Untitled product',
        text: generatedPrompt,
        createdAt: new Date().toLocaleString(),
      },
      ...prevState,
    ].slice(0, 5))
    showFeedback('Prompt generated and ready to review.')
  }

  const handleCopyPrompt = () => {
    if (!prompt) {
      showFeedback('Generate a prompt first so there is something to copy.')
      return
    }

    if (!navigator.clipboard) {
      showFeedback('Clipboard is unavailable in this browser.')
      return
    }

    void navigator.clipboard.writeText(prompt).then(() => {
      showFeedback('Prompt copied to clipboard.')
    })
  }

  const downloadTextFile = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleDownloadTxt = () => {
    if (!prompt) {
      showFeedback('Generate a prompt first so there is something to download.')
      return
    }

    downloadTextFile(prompt, 'product-review-prompt.txt')
    showFeedback('TXT download started.')
  }

  const handleLoadHistoryPrompt = (item: PromptHistoryItem) => {
    setPrompt(item.text)
    showFeedback(`Loaded ${item.title}.`)
  }

  const handleHistoryCopy = (text: string) => {
    if (!navigator.clipboard) {
      showFeedback('Clipboard is unavailable in this browser.')
      return
    }

    void navigator.clipboard.writeText(text).then(() => {
      showFeedback('Saved prompt copied to clipboard.')
    })
  }

  const handleApplyPreset = (preset: ProductPreset) => {
    setProductInfo(preset.productInfo)
    setUnderstanding(preset.understanding)
    setImages([])
    setPrompt(buildPromptText(preset.productInfo, preset.understanding, []))
    showFeedback(`${preset.label} preset applied.`)
  }

  const handleResetWorkspace = () => {
    setProductInfo(initialProductInfoState)
    setUnderstanding(initialProductUnderstandingState)
    setImages([])
    setPrompt('')
    setReviewDraft(initialReviewDraftState)
    showFeedback('Workspace reset to a fresh start.')
  }

  const handleHistoryDownload = (text: string) => {
    downloadTextFile(text, 'product-review-prompt.txt')
    showFeedback('Saved prompt downloaded.')
  }

  const buildReviewDraftText = (nextProductInfo: ProductInfoState) => {
    const productName = nextProductInfo.productName || 'this product'
    const brand = nextProductInfo.brand || 'the brand'
    const summary = nextProductInfo.shortDescription || 'a thoughtfully designed product'

    return {
      title: `${productName} delivers a strong review-ready story`,
      hook: `${productName} stands out by pairing ${summary.toLowerCase()} with a clear, modern experience.`,
      body: `${productName} from ${brand} feels easy to recommend because it combines practical value with a polished presentation. The current prompt context highlights the product's positioning, audience, and benefits, making it a natural fit for a persuasive review.`,
      cta: `Take a closer look at ${productName} and see whether it meets your expectations.`,
    }
  }

  const buildReviewText = (draft: ReviewDraftState) => [draft.title, draft.hook, draft.body, draft.cta].filter(Boolean).join('\n\n')

  const handleGenerateReview = () => {
    const reviewContent = buildReviewDraftText(productInfo)
    const nextReviewDraft = {
      title: reviewContent.title,
      hook: reviewContent.hook,
      body: reviewContent.body,
      cta: reviewContent.cta,
    }

    setReviewDraft(nextReviewDraft)
    setReviewHistory((prevState) => [
      {
        id: `${Date.now()}`,
        title: nextReviewDraft.title,
        hook: nextReviewDraft.hook,
        body: nextReviewDraft.body,
        cta: nextReviewDraft.cta,
        createdAt: new Date().toLocaleString(),
      },
      ...prevState,
    ].slice(0, 5))
    showFeedback('Review draft generated.')
  }

  const handleCopyReview = () => {
    const reviewText = buildReviewText(reviewDraft)

    if (!reviewText) {
      showFeedback('Generate a review draft first so there is something to copy.')
      return
    }

    if (!navigator.clipboard) {
      showFeedback('Clipboard is unavailable in this browser.')
      return
    }

    void navigator.clipboard.writeText(reviewText).then(() => {
      showFeedback('Review copied to clipboard.')
    })
  }

  const handleDownloadReview = () => {
    const reviewText = buildReviewText(reviewDraft)

    if (!reviewText) {
      showFeedback('Generate a review draft first so there is something to download.')
      return
    }

    downloadTextFile(reviewText, 'product-review-draft.txt')
    showFeedback('Review download started.')
  }

  const handleClearReview = () => {
    setReviewDraft(initialReviewDraftState)
    showFeedback('Review draft cleared.')
  }

  const handleLoadReviewHistory = (item: ReviewHistoryItem) => {
    setReviewDraft({
      title: item.title,
      hook: item.hook,
      body: item.body,
      cta: item.cta,
    })
    showFeedback(`Loaded ${item.title}.`)
  }

  const handleReviewHistoryCopy = (item: ReviewHistoryItem) => {
    const reviewText = buildReviewText(item)

    if (!navigator.clipboard) {
      showFeedback('Clipboard is unavailable in this browser.')
      return
    }

    void navigator.clipboard.writeText(reviewText).then(() => {
      showFeedback('Saved review copied to clipboard.')
    })
  }

  const handleReviewHistoryDownload = (item: ReviewHistoryItem) => {
    const reviewText = buildReviewText(item)
    downloadTextFile(reviewText, 'product-review-draft.txt')
    showFeedback('Saved review downloaded.')
  }

  return (
    <div className="workspace-shell">
      <header className="workspace-header">
        <div className="workspace-header__top">
          <div>
            <p className="eyebrow">MVP ready</p>
            <h1>Product review workspace</h1>
            <p className="workspace-header__subtitle">
              Shape the product story, attach reference images, and generate polished prompt and review drafts in one place. Your work is saved locally as you go.
            </p>
          </div>
          <button type="button" className="secondary-button workspace-header__action" onClick={handleResetWorkspace}>
            Reset workspace
          </button>
        </div>
      </header>

      {feedbackMessage ? (
        <div className="feedback-banner" aria-live="polite">
          {feedbackMessage}
        </div>
      ) : null}

      <section className="workspace-card" aria-label="Product information">
        <div className="workspace-card__header">
          <div>
            <p className="hero-kicker">01</p>
            <h2>Product information</h2>
          </div>
        </div>

        <div className="preset-row" aria-label="Quick presets">
          {productPresets.map((preset) => (
            <button key={preset.id} type="button" className="secondary-button" onClick={() => handleApplyPreset(preset)}>
              {preset.label}
            </button>
          ))}
        </div>

        <div className="form-grid">
          <label className="field">
            <span>Product name</span>
            <input
              value={productInfo.productName}
              onChange={(event) => updateProductInfo('productName', event.target.value)}
              placeholder="Enter the product name"
            />
          </label>

          <label className="field">
            <span>Brand</span>
            <input
              value={productInfo.brand}
              onChange={(event) => updateProductInfo('brand', event.target.value)}
              placeholder="Brand name"
            />
          </label>

          <label className="field">
            <span>Category</span>
            <input
              value={productInfo.category}
              onChange={(event) => updateProductInfo('category', event.target.value)}
              placeholder="Gadgets, skincare, furniture"
            />
          </label>

          <label className="field">
            <span>Marketplace URL</span>
            <input
              type="url"
              value={productInfo.marketplaceUrl}
              onChange={(event) => updateProductInfo('marketplaceUrl', event.target.value)}
              placeholder="https://example.com/product"
            />
          </label>

          <label className="field">
            <span>Price</span>
            <input
              value={productInfo.price}
              onChange={(event) => updateProductInfo('price', event.target.value)}
              placeholder="$149.99"
            />
          </label>

          <label className="field field--full">
            <span>Short description</span>
            <textarea
              rows={3}
              value={productInfo.shortDescription}
              onChange={(event) => updateProductInfo('shortDescription', event.target.value)}
              placeholder="Describe the product in a concise, persuasive way"
            />
          </label>
        </div>
      </section>

      <section className="workspace-card" aria-label="Product images">
        <div className="workspace-card__header">
          <div>
            <p className="hero-kicker">02</p>
            <h2>Product images</h2>
          </div>
        </div>

        <label className="upload-field">
          <span>Upload images</span>
          <input type="file" accept="image/*" multiple onChange={handleImageUpload} aria-label="Upload product images" />
        </label>

        {images.length === 0 ? (
          <div className="empty-state">No images yet. Add product photos to preview them here.</div>
        ) : (
          <div className="image-grid">
            {images.map((image) => (
              <article className="image-card" key={image.id}>
                <img src={image.src} alt={image.name} />
                <div className="image-card__meta">
                  <p>{image.name}</p>
                  <button type="button" onClick={() => handleRemoveImage(image.id)} aria-label={`Remove ${image.name}`}>
                    Remove image
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="workspace-card" aria-label="Product understanding">
        <div className="workspace-card__header">
          <div>
            <p className="hero-kicker">03</p>
            <h2>Product understanding</h2>
          </div>
        </div>

        <div className="form-grid">
          <label className="field">
            <span>Target audience</span>
            <input
              value={understanding.targetAudience}
              onChange={(event) => updateUnderstanding('targetAudience', event.target.value)}
              placeholder="Who is this product for?"
            />
          </label>

          <label className="field">
            <span>Problems</span>
            <input
              value={understanding.problems}
              onChange={(event) => updateUnderstanding('problems', event.target.value)}
              placeholder="What pain point does it solve?"
            />
          </label>

          <label className="field">
            <span>Benefits</span>
            <input
              value={understanding.benefits}
              onChange={(event) => updateUnderstanding('benefits', event.target.value)}
              placeholder="What value does it deliver?"
            />
          </label>

          <label className="field">
            <span>USP</span>
            <input
              value={understanding.usp}
              onChange={(event) => updateUnderstanding('usp', event.target.value)}
              placeholder="What makes it unique?"
            />
          </label>

          <label className="field field--full">
            <span>CTA</span>
            <textarea
              rows={3}
              value={understanding.cta}
              onChange={(event) => updateUnderstanding('cta', event.target.value)}
              placeholder="What action should the audience take?"
            />
          </label>
        </div>
      </section>

      <section className="workspace-card" aria-label="Prompt output">
        <div className="workspace-card__header">
          <div>
            <p className="hero-kicker">04</p>
            <h2>Prompt output</h2>
          </div>
        </div>

        <div className="action-row">
          <button type="button" className="primary-button" onClick={handleGeneratePrompt}>
            Generate Prompt
          </button>
          <button type="button" className="secondary-button" onClick={handleCopyPrompt} disabled={!prompt}>
            Copy Prompt
          </button>
          <button type="button" className="secondary-button" onClick={handleDownloadTxt} disabled={!prompt}>
            Download TXT
          </button>
        </div>

        <textarea className="prompt-output" readOnly rows={12} value={prompt} placeholder="Generated prompt will appear here" />
      </section>

      <section className="workspace-card" aria-label="Review output">
        <div className="workspace-card__header">
          <div>
            <p className="hero-kicker">05</p>
            <h2>Review output</h2>
          </div>
        </div>

        <div className="action-row">
          <button type="button" className="primary-button" onClick={handleGenerateReview}>
            Generate Review
          </button>
          <button type="button" className="secondary-button" onClick={handleCopyReview} disabled={!reviewDraft.title && !reviewDraft.body}>
            Copy Review
          </button>
          <button type="button" className="secondary-button" onClick={handleDownloadReview} disabled={!reviewDraft.title && !reviewDraft.body}>
            Download Review
          </button>
          <button type="button" className="secondary-button" onClick={handleClearReview}>
            Clear
          </button>
        </div>

        {reviewDraft.title || reviewDraft.body ? (
          <div className="review-output">
            <div className="review-output__block">
              <span className="review-output__label">Title</span>
              <h3>{reviewDraft.title}</h3>
            </div>
            <div className="review-output__block">
              <span className="review-output__label">Hook</span>
              <p>{reviewDraft.hook}</p>
            </div>
            <div className="review-output__block">
              <span className="review-output__label">Review body</span>
              <p>{reviewDraft.body}</p>
            </div>
            <div className="review-output__block">
              <span className="review-output__label">CTA</span>
              <p>{reviewDraft.cta}</p>
            </div>
          </div>
        ) : (
          <div className="empty-state">Generate a review draft to preview the final review content here.</div>
        )}
      </section>

      <section className="workspace-card" aria-label="Review history">
        <div className="workspace-card__header">
          <div>
            <p className="hero-kicker">06</p>
            <h2>Recent reviews</h2>
          </div>
        </div>

        {reviewHistory.length === 0 ? (
          <div className="empty-state">No saved reviews yet. Generate one to build a reusable review history.</div>
        ) : (
          <div className="history-list">
            {reviewHistory.map((item) => (
              <article className="history-item" key={item.id}>
                <div className="history-item__content">
                  <div className="history-item__meta">
                    <strong>{item.title}</strong>
                    <span>{item.createdAt}</span>
                  </div>
                  <p>{item.body}</p>
                </div>
                <div className="history-item__actions">
                  <button type="button" className="secondary-button" onClick={() => handleLoadReviewHistory(item)}>
                    Load
                  </button>
                  <button type="button" className="secondary-button" onClick={() => handleReviewHistoryCopy(item)}>
                    Copy
                  </button>
                  <button type="button" className="secondary-button" onClick={() => handleReviewHistoryDownload(item)}>
                    Download
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="workspace-card" aria-label="Prompt history">
        <div className="workspace-card__header">
          <div>
            <p className="hero-kicker">07</p>
            <h2>Recent prompts</h2>
          </div>
        </div>

        {promptHistory.length === 0 ? (
          <div className="empty-state">No saved prompts yet. Generate one to build a reusable history.</div>
        ) : (
          <div className="history-list">
            {promptHistory.map((item) => (
              <article className="history-item" key={item.id}>
                <div className="history-item__content">
                  <div className="history-item__meta">
                    <strong>{item.title}</strong>
                    <span>{item.createdAt}</span>
                  </div>
                  <p>{item.text}</p>
                </div>
                <div className="history-item__actions">
                  <button type="button" className="secondary-button" onClick={() => handleLoadHistoryPrompt(item)}>
                    Load
                  </button>
                  <button type="button" className="secondary-button" onClick={() => handleHistoryCopy(item.text)}>
                    Copy
                  </button>
                  <button type="button" className="secondary-button" onClick={() => handleHistoryDownload(item.text)}>
                    Download
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default AppShell
