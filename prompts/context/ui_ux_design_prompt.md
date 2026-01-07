# Majorly UI/UX Design & Flow Prompt

## Role & Vision
You are a world-class UI/UX designer and frontend engineer specializing in educational platforms for Gen Z and late Millennials. Your goal is to design a high-fidelity prototype for "Majorly," a platform that helps students find their ideal college major. The interface should feel like a "Personal Academic Concierge"—trustworthy, encouraging, and effortlessly modern.

---

## Design System & Aesthetic
- **Theme**: "Modern Academic Excellence"
- **Vibe**: Clean, professional, yet vibrant and approachable. Avoid "clinical" or "boring school portal" styles.
- **Design Language**: 
    - Use **shadcn/ui** components as the foundation.
    - **Glassmorphism**: Subtle translucent backgrounds for cards and navigation bars.
    - **Typography**: Modern sans-serif (e.g., *Outfit* or *Inter*). Use bold headings and generous line-height for body text.
    - **Corners**: Highly rounded (12px to 16px) for a soft, friendly feel.
    - **Animations**: Micro-interactions for button hovers, smooth transitions between assessment steps, and a celebratory "loading" state when calculating results.

### Color Palette
- **Primary (Core)**: Deep Indigo (`#4F46E5`) or Electric Purple (`#7C3AED`) representing wisdom and ambition.
- **Secondary**: Soft Lavender (`#F5F3FF`) for background accents and clean breathing room.
- **Success (The "Perfect Fit")**: Minty Green (`#10B981`) for high match scores.
- **Accent**: Sunset Orange or Warm Yellow for "Interests" and calls to action.
- **Neutral**: Slate Grays (`#1E293B`) for text hierarchy.

---

## The User Flow (Linear Prototype Journey)

### 1. Landing Page (The Hook)
- **Hero Section**: A bold headline ("Find the Major You'll Actually Love") with a simple, high-contrast button: "Start Assessment (Free, 10 min)".
- **Visuals**: Abstract geometric shapes or high-quality imagery of diverse students in collaborative environments.
- **Trust Indicators**: A "How it Works" section with 3 simple steps (Take Test -> Get Matches -> Explore Careers).

### 2. The Guest Assessment (Progressive Disclosure)
- **Concept**: A full-screen or focused-modal experience to minimize distractions.
- **Steps**:
    - **Section 1 (Current Skills)**: A searchable tag-cloud or autocomplete input where users pick skills they already have.
    - **Section 2 (Aspirations)**: Similar UI, but for skills they *want* to learn.
    - **Section 3 (Strengths)**: Interactive sliders or card-sort UI for self-assessment.
    - **Section 4 (Interests)**: Visual cards with icons (e.g., "Working with data," "Leading a team") that users can rate or select.
- **Navigation**: A persistent progress bar at the top or bottom showing "% Complete."

### 3. The "Calculating" State (The Magic)
- While results load, show a sophisticated animation (e.g., pulsating brain or spinning constellations of majors) with encouraging text: "Analyzing 33,000+ skills and matching your unique profile..."

### 4. Results Dashboard (The Big Reveal)
- **Header**: "Your Top Academic Matches."
- **Primary Recommendations**: 3 Large, "featured" cards showing the Major Title, Category (e.g., STEM, Arts), and a large circular **Match Percentage**.
- **The "Why" Hook**: Each card has a "See Why" badge that, when clicked, reveals matching skills and interests in a beautiful pop-over or expansion.
- **Secondary Matches**: A list or grid of smaller cards for matches 4–7.

### 5. Major Detail Page (The Deep Dive)
- **Hero**: Breadcrumbs (Results > Computer Science), large title, and a "Save to Favorites" heart icon.
- **Layout**: Two-column layout on desktop.
    - **Left Column**: Rich description, "Skills You'll Master," and "Career Outlook."
    - **Right Column (Sticky)**: A "Quick Stats" card with Median Salary and Job Growth percentage.
- **Call to Action**: A prominent "Take Deep Dive Test" button to unlock specializations.

### 6. Authentication Bridge (The Conversion)
- If a guest tries to "Save" or "Take Deep Dive," trigger a beautiful slide-in modal to "Create an Account to Save Your Journey."
- Simple fields: Name, Email, Password. Social login options (Google/Apple) for speed.

### 7. User Profile (The Library)
- A dashboard for returning users showing:
    - **My Saved Majors**: A grid of favorited cards.
    - **Assessment History**: Date of last test and a "Retake" button.
    - **Recommended Resources**: Curated links based on their top saved majors.

---

## Detailed UI Features for AI Implementation
- **Responsive**: Ensure the assessment is effortless on mobile (large buttons, no tiny text).
- **Feedback Loops**: When a user selects a skill, provide a subtle haptic-like visual pulse.
- **Hierarchy**: Use whitespace to separate sections. Don't crowd the screen.
- **Accessibility**: Ensure high contrast for all text and clear focus states for keyboard-only users.
