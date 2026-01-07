# Majorly Frontend Project Structure (Next.js 16+)

A streamlined structure guide optimized for the Majorly platform, focusing on directory organization and separation of concerns.

## Directory Structure

```
majorly-frontend/
├── public/                           # Static assets (images, icons, fonts)
├── app/                              # App Router (Root Directory)
│   ├── (auth)/                       # Authentication pages (Login, Register, Reset)
│   ├── (dashboard)/                  # Authenticated user pages (Dashboard, Profile)
│   ├── (public)/                     # Public marketing and browsing pages
│   ├── assessment/                   # Assessment flow pages
│   ├── api/                          # Server-side API route handlers
│   ├── layout.tsx                    # Root layout with global providers
│   ├── globals.css                   # Global Tailwind styles
│   └── not-found.tsx                 # Custom 404 page
├── components/                       # React Components
│   ├── ui/                           # Base UI primitives (buttons, inputs, cards)
│   ├── layout/                       # Structural components (Header, Footer, Sidebar)
│   ├── features/                     # Feature-specific components grouped by domain
│   │   ├── auth/                     # Auth forms and widgets
│   │   ├── assessment/               # Assessment questions and progress UI
│   │   ├── dashboard/                # User dashboard widgets
│   │   └── majors/                   # Major cards, filters, and display logic
│   ├── common/                       # Generic shared components (Loaders, ErrorBoundaries)
│   └── providers/                    # Context providers (Theme, QueryClient, Auth)
├── hooks/                            # Custom React Hooks
│   ├── auth/                         # Authentication hooks
│   ├── api/                          # Data fetching hooks
│   └── ui/                           # UI interaction hooks
├── lib/                              # Logic and Configuration
│   ├── api.ts                        # API client configuration (Fetch/Axios)
│   ├── utils.ts                      # General utility functions (cN, formatting)
│   ├── constants.ts                  # Application-wide constants
│   └── validations/                  # Zod validation schemas
├── store/                            # Global State Management
│   └── slices/                       # Zustand stores (e.g., assessment state)
├── types/                            # TypeScript Definitions
│   └── index.ts                      # Shared interfaces and types
├── next.config.ts                    # Next.js configuration
├── tailwind.config.ts                # Tailwind CSS configuration
└── tsconfig.json                     # TypeScript configuration
```

## Directory Explanations

### App Directory (`app/`)
The core routing directory defined by Next.js App Router.
- **Route Groups `()`**: Used to organize routes without affecting the URL structure (e.g., `(auth)/login` becomes `/login`).
- **Feature Roots**: `assessment` is kept separate to potentially use a different layout strategy than the dashboard or public pages.

### Components (`components/`)
Organized by "Atomic Design" principles mixed with Domain-Driven Design.
- **`ui/`**: Low-level, dumb components. Do not modify these often (shadcn/ui).
- **`features/`**: The bulk of the application logic. If a component belongs to a specific feature (like a "Major Card"), it goes here.
- **`layout/`**: Components that dictate the page structure.

### Lib (`lib/`)
The "brain" of the utility layer.
- **`api.ts`**: Centralized place to handle HTTP requests to the Laravel backend.
- **`validations/`**: specific folder for Zod schemas to keep component files clean.

### Store (`store/`)
Used for client-side global state that needs to persist across components but not necessarily across sessions (like the current progress in a multi-step assessment).

### Types (`types/`)
Centralized TypeScript definitions to ensure consistency between the Frontend and Backend data models.
