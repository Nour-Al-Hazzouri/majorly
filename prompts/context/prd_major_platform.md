# PRC - Major Recommendation Platform (Development Specification)

## 1) Document Control
- **Project Name**: Majorly
- **Date**: January 7, 2026
- **Status**: Development Specification
- **Purpose**: Technical specification for vibe coding - implementation details only

## 2) Project Overview

### Problem Statement
Students struggle to choose appropriate academic majors due to lack of self-awareness about their skills, interests, and strengths, combined with insufficient knowledge about major requirements and career outcomes.

### Solution
A web-based platform that provides:
1. **Two-tier assessment system**: Quick broad assessment (10-15 min) + optional deep-dive tests per major category (15-20 min)
2. **Skills-based matching**: Uses Lightcast skills data + O*NET occupation data to recommend suitable majors
3. **Progressive disclosure**: Users get broad recommendations first, then can explore specific majors in depth
4. **Rich resources**: Career paths, salary data, skill requirements, and learning resources for each major

### Target Users
- Primary: High school students (ages 16-18) exploring college majors
- Secondary: College students considering major changes
- Tertiary: Career changers exploring educational paths

### Out of Scope
- College/university recommendations or applications
- Direct connections to educational institutions
- Paid career counseling or human advisor matching
- Job board or internship matching
- Social features (forums, peer connections)
- Mobile native apps (web-responsive only)
- Multi-language support (English only)
- Integration with learning management systems
- Scholarship or financial aid information

## 3) Core Features

### MVP Features (Must Have)

1. **User Authentication**
   - Email/password registration and login
   - Password reset functionality
   - Session management with Laravel Sanctum

2. **Tier 1: Quick Assessment (10-15 minutes)**
   - Skills inventory: Select current skills from Lightcast catalog
   - Skills aspiration: Select skills willing to learn
   - Strengths/weaknesses: Self-assessment questionnaire
   - Interest profiler: 10-15 questions about preferences
   - Progress indicator throughout assessment
   - Can start without login (guest assessment)
   - Prompt to register to save results

3. **Results Dashboard**
   - Display top 5-7 major recommendations with match percentages
   - "Why this matched" explanation for each major
   - Overview cards for each recommended major
   - Save/favorite majors functionality
   - Retake assessment option

4. **Major Detail Pages**
   - Major overview and description
   - Required skills (from Lightcast)
   - Career paths (from O*NET occupations)
   - Median salary ranges (from O*NET)
   - Job market outlook (from O*NET)
   - "Take Deep Dive Test" CTA button

5. **Tier 2: Deep Dive Tests (Optional)**
   - Major-specific assessment (15-20 questions per major category)
   - Specialization recommendations within major (e.g., CS → Cybersecurity, Web Dev, AI/ML)
   - Detailed results showing fit for each specialization

6. **Resources/Browse Page**
   - Browse all available majors by category
   - Search functionality for majors
   - Basic filtering (by category, required education level)

7. **User Profile**
   - View saved/favorited majors
   - Assessment history
   - Retake or update assessments

### Phase 2 Features (Future)
- Comparison tool (side-by-side major comparison)
- Career path timeline visualization
- College program finder (College Scorecard API integration)
- Community reviews/testimonials
- Email notifications
- Export results to PDF
- Social login (Google, Facebook OAuth)
- Admin dashboard for content management

## 4) Functional Requirements

### User Registration & Authentication

**User Story**: As a prospective student, I want to create an account so that I can save my assessment results and return to them later.

**Acceptance Criteria**:
- User can register with email and password (min 8 chars)
- User can log in with valid credentials
- User can request password reset via email
- Sessions persist for 7 days (remember me)
- User can log out

**Edge Cases**:
- Email already registered → Show error "Email already exists"
- Invalid email format → Show validation error
- Password too weak → Show requirements
- Reset token expired → Show error, allow new request

**Priority**: P0

---

### Tier 1 Quick Assessment

**User Story**: As a student unsure about majors, I want to take a guided assessment that asks me about my skills and interests, so that I can receive personalized major recommendations.

**Acceptance Criteria**:
- Assessment has 4 sections: current skills, learning skills, strengths/weaknesses, interest questions
- Progress bar shows completion percentage
- Skills have autocomplete/search functionality (from Lightcast database)
- Partial progress is saved if user logs out
- Assessment generates 5-7 recommendations with match scores
- Can be completed without login (guest mode)

**Edge Cases**:
- User selects 0 skills → Prompt "Please select at least 3 current skills"
- Skills search returns 0 results → Show "No matches found"
- User tries to skip required sections → Disable "Next" button

**Priority**: P0

---

### Results Dashboard

**User Story**: As a student who completed the assessment, I want to see which majors match my profile and understand why, so that I can make informed decisions.

**Acceptance Criteria**:
- Majors ranked by match percentage (highest first)
- "Why this matched?" shows aligned skills, interests, and strengths
- Click major to navigate to detail page
- Can save/favorite majors (requires login)

**Edge Cases**:
- Tie scores → Order by secondary criteria (number of matching skills)
- All match scores <60% → Show message "These are your best fits, consider retaking"

**Priority**: P0

---

### Major Detail Page

**User Story**: As a student interested in a recommended major, I want to learn detailed information about it, so that I can decide if it's right for me.

**Acceptance Criteria**:
- Shows: major description, required skills, career paths, salary ranges, job outlook
- Career paths link to O*NET occupation details
- "Take Deep Dive Test" button (if available for this major)

**Edge Cases**:
- Major has no mapped career paths → Show "Career path data coming soon"
- Salary data unavailable → Show "Salary data not available"

**Priority**: P0

---

### Tier 2 Deep Dive Tests

**User Story**: As a student interested in Computer Science, I want to take a specialized test to learn which CS specializations best match my interests.

**Acceptance Criteria**:
- 15-20 major-specific questions
- Results show specializations ranked by match percentage
- Each specialization shows mapped O*NET occupations and required skills

**Edge Cases**:
- User hasn't taken Tier 1 → Prompt to complete Tier 1 first
- Major has no deep dive test → Hide button

**Priority**: P1

---

### Resources/Browse Page

**User Story**: As a student, I want to browse all available majors even if they weren't recommended to me, so that I can explore other options.

**Acceptance Criteria**:
- All majors organized by category
- Real-time search filtering
- Click major to view detail page

**Edge Cases**:
- Search returns 0 results → Show "No majors found"

**Priority**: P1

---

### User Profile & Saved Majors

**User Story**: As a returning user, I want to see my previously saved majors and assessment results, so that I can continue my research.

**Acceptance Criteria**:
- Shows saved/favorited majors
- Shows assessment completion date and top 3 results
- Can retake assessment (start fresh or modify previous answers)

**Edge Cases**:
- No saved majors → Show "You haven't saved any majors yet"

**Priority**: P1

## 5) UX / UI Requirements

### Page Structure

```
Landing Page (Unauthenticated)
├── Hero: "Find Your Ideal Major in 10 Minutes"
├── How It Works (3-step visual)
├── CTA: "Start Free Assessment"
└── Footer: About, Privacy, Terms

Registration/Login Pages
├── Standard forms
└── Redirect to assessment or dashboard

Assessment Flow
├── Welcome/Instructions
├── Section 1: Current Skills (multi-select with search)
├── Section 2: Skills to Learn (multi-select)
├── Section 3: Strengths/Weaknesses (rating scales)
├── Section 4: Interest Questions (multiple choice)
├── Progress bar persistent throughout
└── Submit → Results

**Note**: Assessment structure and questions are dynamically served from the backend `QuestionService`.

Results Dashboard
├── Header: User profile dropdown, navigation
├── Top Recommendations (cards with match %)
├── Secondary Recommendations (collapsed)
└── Actions: Retake | Browse All Majors

Major Detail Page
├── Major name + category
├── Overview section
├── Required Skills (tags/badges)
├── Career Paths (cards with salary/outlook)
├── "Take Deep Dive Test" CTA
└── Related Majors

Deep Dive Test
├── Similar to Tier 1 but major-specific
└── Results: Specializations ranked

Resources/Browse Page
├── Search bar
├── Category filters
├── Major cards (grid layout)

User Profile
├── User info (name, email)
├── Assessment history with top 3 results
└── Saved Majors (grid of cards)
```

### Key User Flows

**Primary Flow: New User → Recommendations**
```
1. Land on homepage → Click "Start Assessment"
2. Skip login (guest mode)
3. Complete assessment sections (10-15 min)
4. Submit → See results dashboard
5. Explore major details → Save favorites
6. Prompted to sign up to save permanently
```

**Deep Dive Flow**
```
1. View major from results
2. Read overview, skills, careers
3. Click "Take Deep Dive Test"
4. Complete 15-20 questions
5. See specialization rankings with O*NET data
```

**Returning User Flow**
```
1. Login → Dashboard with previous results
2. Review saved majors
3. Optionally retake or take deep dive tests
```

### Design System
- **Framework**: Tailwind CSS + shadcn/ui components
- **Typography**: Modern sans-serif for headings, system font stack for body
- **Color Palette**: **[TO BE DECIDED]**
  - Primary: Trustworthy blue/purple (suggestion)
  - Success: Green for high match scores
  - Warning: Yellow for medium matches
  - Error: Red for low matches
  - Neutral grays for text hierarchy
- **Component Library**: shadcn/ui (buttons, cards, forms, dialogs, progress bars)

### Responsive Requirements
- **Mobile-first design**
- **Breakpoints**:
  - Mobile: 320px - 767px (single column)
  - Tablet: 768px - 1023px (2-column grid)
  - Desktop: 1024px+ (multi-column layouts)
- **Touch targets**: Minimum 44x44px for mobile
- **Assessment optimized for mobile** (large touch areas, minimal scrolling per question)

### Accessibility
- **WCAG 2.1 AA compliance**
- Color contrast ratio ≥4.5:1 for normal text
- Keyboard navigation for all interactive elements
- Focus indicators visible and clear
- Form labels and ARIA labels for screen readers
- Alt text for images/icons
- No flashing/strobing content

### Content Guidelines
- **Tone**: Encouraging, supportive, non-judgmental
- **Reading level**: 8th-10th grade (accessible to high school students)
- **Avoid jargon**: Explain technical terms when necessary
- **Positive framing**: "Best fit" not "poor matches"
- **Transparency**: Explain how matching works, cite data sources

## 6) Tech Stack

### Frontend
- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS v3.x or v4
- **UI Library**: shadcn/ui (latest)
- **State Management**: 
  - React Context API + hooks for local state
  - TanStack Query (React Query) for server state
- **Forms**: react-hook-form + zod validation
- **Data Fetching**: TanStack Query for API calls and caching
- **Auth (frontend)**: 
  - httpOnly cookies for token storage
  - Context provider for auth state
  - Protected route wrapper component

### Backend
- **Framework**: Laravel 12+
- **Language**: PHP 8.3+
- **Architecture**: RESTful API
- **Auth**: Laravel Sanctum (API token authentication)
- **File Storage**: Local filesystem (upgrade to S3 later)
- **Background Jobs**: Laravel Queues with database driver

### Database
- **Database**: PostgreSQL 15+ or 16+
- **ORM**: Eloquent ORM (Laravel built-in)
- **Migrations**: Laravel migrations

### Package Manager & Runtime
- **Frontend Package Manager**: pnpm (v8+)
- **Node Runtime**: Node.js 20+ LTS
- **PHP Runtime**: PHP 8.3+
- **Build Tools**: 
  - Next.js built-in (Turbopack in dev)
  - Laravel Vite

### Environment Variables

**Frontend (.env.local)**:
```
NEXT_PUBLIC_API_URL=
```

**Backend (.env)**:
```
APP_KEY=
APP_ENV=
APP_DEBUG=
APP_URL=
DB_CONNECTION=pgsql
DB_HOST=
DB_PORT=5432
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=
SANCTUM_STATEFUL_DOMAINS=
SESSION_DRIVER=
CACHE_DRIVER=
QUEUE_CONNECTION=database
MAIL_MAILER=
MAIL_HOST=
MAIL_PORT=
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_FROM_ADDRESS=
```

### External APIs

**Lightcast Open Skills API**
- **Purpose**: Skills catalog (33,000+ skills)
- **Status**: **[IMPLEMENTED]** (Sync command and Service Layer with OAuth2 support)
- **Authentication**: OAuth2 Client Credentials (via `LIGHTCAST_CLIENT_ID` and `LIGHTCAST_CLIENT_SECRET`)
- **Usage**: Synced to local database via `majorly:fetch-skills` command.
- **Fallback**: Includes robust mock dataset for development and testing without API keys.
- **Rate Limits**: Mitigated by local caching and batch syncing.

**O*NET Web Services API**
- **Purpose**: Occupation data (900+ occupations), salary, job outlook, education requirements
- **Authentication**: None (fully open)
- **Usage**: Seed database with occupation data, refresh quarterly
- **Rate Limits**: No documented limits

**Email Service** (for password reset)
- **Options**: SendGrid, Mailgun, AWS SES, or SMTP - **[TO BE DECIDED]**

## 7) Data Model

### Core Entities & Relationships

**users** (1:many assessments, many:many majors via saved_majors)
- Stores user account information
- Standard Laravel users table structure

**skills** (many:many majors via major_skills)
- Seeded from Lightcast API
- ~33,000 skills with categories and metadata

**occupations** (many:many majors via major_occupations)
- Seeded from O*NET API
- ~900 occupations with salary, outlook, education data

**majors** (many:many skills, many:many occupations)
- Manually curated list of 50-100 majors
- Organized by category (Tech, Healthcare, Business, Arts, etc.)

**assessments** (belongs to user, has many assessment_responses and assessment_results)
- Stores assessment sessions (tier1 or deep_dive)
- Can be anonymous (user_id NULL) or authenticated

**assessment_responses** (belongs to assessment)
- Stores individual question answers
- JSON response_value for flexibility

**assessment_results** (belongs to assessment and major)
- Computed recommendations with match scores
- Stores reasoning (which skills/interests matched)

**saved_majors** (pivot: user many:many majors)
- User favorites/bookmarks

### Indexing Considerations
- Index on: skills.name, majors.slug, occupations.onet_code
- Composite unique indexes on pivot tables
- Eager load relationships when fetching majors to avoid N+1

## 8) Matching Algorithm (High-Level)

### Algorithm Overview
Simple weighted scoring system for MVP:

1. **Input**: User assessment responses
   - Current skills (array of skill IDs)
   - Learning skills (array of skill IDs)
   - Strengths/weaknesses (ratings 1-5)
   - Interest questions (ratings 1-5)

2. **Process**:
   - For each major in database:
     - Calculate skill match score (current skills + learning skills vs major required skills)
     - Calculate interest alignment (interest responses vs major characteristics)
     - Calculate strength alignment (strengths vs major requirements)
     - Combine scores with weights (e.g., 50% skills, 30% interests, 20% strengths)
   - Rank majors by total score
   - Return top 5-7 recommendations

3. **Output**: Array of majors with:
   - Match percentage (0-100)
   - Reasoning (which skills/interests matched)
   - Rank (1 = top recommendation)

### Implementation Notes
- Start simple: weighted averaging
- Store algorithm version with results for iteration
- Can improve with cosine similarity, ML models in future
- Must compute in <3 seconds for good UX

## 9) Non-Functional Requirements

### Performance
- Page load: <3s on 3G connection
- Assessment transitions: <500ms
- API response time: p95 <1s
- Results calculation: <3s
- Frontend bundle: <200KB gzipped

### Security
- Passwords hashed with bcrypt
- Minimum password length: 8 characters
- Rate limiting: 5 login attempts per minute
- HTTPS only in production
- CORS configured for Next.js domain
- API rate limiting: 60 req/min unauthenticated, 200 authenticated
- Input validation and sanitization (XSS prevention)
- SQL injection prevention (ORM prepared statements)

### Privacy
- Store only necessary data (name, email, assessment responses)
- No sensitive personal data (SSN, addresses, etc.)
- Assessment responses linked to user but can be anonymized
- User can delete account and all data
- No tracking cookies (auth cookies only)
- Privacy policy required

### Reliability
- Graceful degradation when external APIs fail (use cached data)
- User-friendly error messages (no stack traces)
- Daily database backups
- Error handling on all API calls

### Scalability (MVP Targets)
- Support 100-500 users initially
- 10-50 concurrent users
- ~1,000 assessments per month
- PostgreSQL handles 10K+ users without optimization

### Observability
- Application logs (Laravel log channels)
- Error logs (separate channel)
- API request logs (endpoint, response time, status)
- Log retention: 30 days

**Optional (TO BE DECIDED)**:
- Error tracking: Sentry (recommended)
- Uptime monitoring: UptimeRobot
- Application metrics: Custom or third-party

## 10) Testing Strategy

### Unit Tests
- Backend: PHPUnit for models, services, utilities
- Frontend: Vitest/Jest for React components and utilities
- Focus on matching algorithm and business logic

### Integration Tests
- Laravel Feature tests for API endpoints
- Test authentication flows
- Test assessment submission and result generation

### End-to-End Tests (Optional)
- Playwright or Cypress for critical flows
- Test: Registration → Assessment → Results → Save major

### Quality Gates
- ESLint + Prettier for frontend
- PHP CS Fixer / Laravel Pint for backend
- TypeScript type checking
- Tests pass before deployment

### Critical Test Cases
1. User registration, login, password reset
2. Complete assessment flow (all sections)
3. Matching algorithm produces valid results
4. Save major functionality
5. Browse and search majors
6. Error handling for API failures

## 11) Implementation Assumptions

### Explicit Assumptions
- **ASSUMPTION**: 50-100 curated majors covers majority of user needs for MVP
- **ASSUMPTION**: Simple weighted scoring algorithm sufficient for initial validation
- **ASSUMPTION**: Users willing to spend 10-15 minutes on assessment
- **ASSUMPTION**: Lightcast and O*NET APIs remain free and available
- **ASSUMPTION**: Anonymous assessments (without login) acceptable for user acquisition
- **ASSUMPTION**: Email-based password reset sufficient (no SMS)
- **ASSUMPTION**: English-language content only for MVP

### Dependencies
- Lightcast Open Skills API availability
- O*NET Web Services API availability
- Email service provider (to be selected)
- Hosting providers (to be selected)
- Manual mapping of majors to skills (requires research)
- Manual mapping of majors to O*NET occupations
- Content writing for major descriptions

## 12) Open Questions (TO BE RESOLVED)

### Critical
1. **Hosting**: Where to host frontend, backend, database? (Vercel + Railway recommended)
2. **Email Service**: Which provider? (SendGrid recommended for free tier)
3. **Domain**: Custom domain or use hosting subdomain?
4. **Design Colors**: Primary brand color and scheme?

### Important
5. **Content Creation**: Who will write major descriptions and create mappings?
6. **Analytics**: Track user behavior? (Google Analytics, Plausible, or none)
7. **Anonymous Assessments**: Allow without registration? (Recommended: Yes)
8. **Deep Dive Scope**: How many major categories initially? (Recommended: 3-5)
9. **Data Refresh**: How often to update Lightcast/O*NET data? (Recommended: Quarterly)
10. **CI/CD**: Automated or manual deployment? (GitHub Actions recommended)
11. **Error Tracking**: Use Sentry or basic Laravel logs?

## 13) Development Notes

### General Principles
- Build incrementally in small, working chunks
- Do not invent requirements beyond this spec
- Ask clarification when ambiguous
- Keep secrets in environment variables
- Follow framework best practices (Laravel, Next.js conventions)
- Comment non-obvious logic (especially matching algorithm)

### Workflow
1. Backend first: API endpoint → test with Postman
2. Frontend: Consume API → test in browser
3. Iterate on UX
4. Write tests for critical paths
5. Polish and optimize

---

**End of Development Specification**