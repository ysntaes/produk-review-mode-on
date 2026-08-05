# PRODUCT REVIEW MODE ON
## System Architecture

---

# Tech Stack

Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

Deployment

- GitHub
- Vercel

Development

- GitHub Codespaces

---

# Folder Structure

src/

components/
layout/
upload/
creator/
product/
output/
ui/

engines/
product/
scene/
prompt/
character/
recommendation/

hooks/

types/

utils/

pages/

data/

assets/

---

# Application Flow

Upload Product

↓

Product Understanding

↓

Creator Setup

↓

Scene Logic

↓

Prompt Engine

↓

Export Prompt

---

# Engine Responsibility

Product Engine

Responsible for:

- Upload
- Product Information
- Product Validation

---

Character Engine

Responsible for:

- AI Character
- Custom Character
- Character Lock

---

Scene Engine

Responsible for:

- Storyboard
- Scene Planning
- Product Interaction

---

Prompt Engine

Responsible for:

- Image Prompt
- Video Prompt
- Negative Prompt

---

Recommendation Engine

Responsible for:

- Camera
- Lighting
- Background
- Outfit
- Creative Direction

---

# Design Principles

Every module should be:

- Independent
- Reusable
- Easy to maintain

Avoid unnecessary dependencies between modules.

---

# Development Rule

Never implement future engines before their assigned sprint.

Always follow the current TASK only.