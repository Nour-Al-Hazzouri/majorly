# JIRA Project Backlog - Major Recommendation Platform

## Project Overview
Major Recommendation Platform (MRP) - A web-based platform to help students choose academic majors through skills-based assessments and career matching.

---

## EPIC 1: Project Setup & Infrastructure
**Epic Description**: Initialize project repositories, configure development environments, and establish foundational infrastructure for both frontend and backend applications.

**Labels**: `setup`, `infrastructure`, `foundation`

### Story 1.1: Initialize Next.js Frontend Project
**Description**:
- As a developer
- I want to set up the Next.js 16+ project with TypeScript and Tailwind CSS
- so that I have a configured frontend foundation to build features on

**Labels**: `frontend`, `setup`, `nextjs`
**Priority**: Highest
**Story Points**: 5

#### Subtasks:
- Create Next.js 16+ project with App Router
  - **Priority**: Highest
  - **Points**: 2
- Configure TypeScript with strict mode
  - **Priority**: Highest
  - **Points**: 1
- Install and configure Tailwind CSS
  - **Priority**: Highest
  - **Points**: 1
- Install shadcn/ui and configure components
  - **Priority**: Highest
  - **Points**: 1

---

### Story 1.2: Initialize Laravel Backend Project
**Description**:
- As a developer
- I want to set up the Laravel 12+ project with PostgreSQL
- so that I have a configured backend API foundation

**Labels**: `backend`, `setup`, `laravel`
**Priority**: Highest
**Story Points**: 5

#### Subtasks:
- Create Laravel 12+ project with PHP 8.3+
  - **Priority**: Highest
  - **Points**: 2
- Configure PostgreSQL database connection
  - **Priority**: Highest
  - **Points**: 2
- Install and configure Laravel Sanctum for authentication
  - **Priority**: Highest
  - **Points**: 1

---

### Story 1.3: Configure Development Environment
**Description**:
- As a developer
- I want to configure environment variables and API connections
- so that the frontend and backend can communicate properly

**Labels**: `devops`, `setup`, `configuration`
**Priority**: Highest
**Story Points**: 3

#### Subtasks:
- Set up environment variables for frontend (.env.local)
  - **Priority**: Highest
  - **Points**: 1
- Set up environment variables for backend (.env)
  - **Priority**: Highest
  - **Points**: 1
- Configure CORS for Next.js frontend domain
  - **Priority**: Highest
  - **Points**: 1

---

### Story 1.4: Set Up Version Control and Git Workflow
**Description**:
- As a development team
- I want to establish Git repositories with proper branching strategy
- so that we can collaborate effectively and maintain code quality

**Labels**: `git`, `devops`, `workflow`
**Priority**: High
**Story Points**: 2

#### Subtasks:
- Initialize Git repositories for frontend and backend
  - **Priority**: High
  - **Points**: 1
- Create dev and main branches
  - **Priority**: High
  - **Points**: 1

---

## EPIC 2: Database Schema & Data Seeding
**Epic Description**: Design and implement the complete database schema, including tables for users, skills, occupations, majors, assessments, and relationships. Seed initial data from external APIs.

**Labels**: `database`, `backend`, `data`

### Story 2.1: Create Core Database Schema
**Description**:
- As a backend developer
- I want to create database migrations for all core tables
- so that the application has a complete data structure

**Labels**: `database`, `migration`, `schema`
**Priority**: Highest
**Story Points**: 8

#### Subtasks:
- Create users table migration
  - **Priority**: Highest
  - **Points**: 1
- Create skills table migration
  - **Priority**: Highest
  - **Points**: 1
- Create occupations table migration
  - **Priority**: Highest
  - **Points**: 1
- Create majors table migration
  - **Priority**: Highest
  - **Points**: 1
- Create assessments table migration
  - **Priority**: Highest
  - **Points**: 1
- Create assessment_responses table migration
  - **Priority**: Highest
  - **Points**: 1
- Create assessment_results table migration
  - **Priority**: Highest
  - **Points**: 1
- Create pivot tables (major_skills, major_occupations, saved_majors)
  - **Priority**: Highest
  - **Points**: 1

---

### Story 2.2: Create Eloquent Models
**Description**:
- As a backend developer
- I want to create Eloquent models for all database tables
- so that I can interact with data using Laravel's ORM

**Labels**: `backend`, `models`, `eloquent`
**Priority**: Highest
**Story Points**: 5

#### Subtasks:
- Create User, Skill, Occupation, Major models
  - **Priority**: Highest
  - **Points**: 2
- Create Assessment, AssessmentResponse, AssessmentResult models
  - **Priority**: Highest
  - **Points**: 2
- Define model relationships (hasMany, belongsTo, belongsToMany)
  - **Priority**: Highest
  - **Points**: 1

---

### Story 2.3: Seed Skills Data from Lightcast API
**Description**:
- As a backend developer
- I want to fetch and seed skills data from Lightcast API
- so that users can select from a comprehensive skills catalog

**Labels**: `backend`, `data-seeding`, `lightcast`
**Priority**: High
**Story Points**: 5

#### Subtasks:
- Create Lightcast API service class
  - **Priority**: High
  - **Points**: 2
- Create artisan command to fetch Lightcast skills
  - **Priority**: High
  - **Points**: 2
- Seed skills table with Lightcast data (~33K skills)
  - **Priority**: High
  - **Points**: 1

---

### Story 2.4: Seed Occupations Data from O*NET API
**Description**:
- As a backend developer
- I want to fetch and seed occupation data from O*NET API
- so that the system has career path information

**Labels**: `backend`, `data-seeding`, `onet`
**Priority**: High
**Story Points**: 5

#### Subtasks:
- Create O*NET API service class
  - **Priority**: High
  - **Points**: 2
- Create artisan command to fetch O*NET occupations
  - **Priority**: High
  - **Points**: 2
- Seed occupations table with O*NET data (~900 occupations)
  - **Priority**: High
  - **Points**: 1

---

### Story 2.5: Manually Curate Majors Data
**Description**:
- As a content curator
- I want to create a comprehensive list of majors with descriptions
- so that users have accurate major information

**Labels**: `content`, `data-seeding`, `majors`
**Priority**: High
**Story Points**: 8

#### Subtasks:
- Research and compile 50-100 common majors with descriptions
  - **Priority**: High
  - **Points**: 5
- Create majors seeder with categories (Tech, Healthcare, Business, Arts, etc.)
  - **Priority**: High
  - **Points**: 2
- Run majors seeder to populate database
  - **Priority**: High
  - **Points**: 1

---

### Story 2.6: Create Major-to-Skills Mappings
**Description**:
- As a content curator
- I want to map majors to required skills
- so that the matching algorithm can recommend appropriate majors

**Labels**: `content`, `data-mapping`, `skills`
**Priority**: High
**Story Points**: 13

#### Subtasks:
- Research skill requirements for each major
  - **Priority**: High
  - **Points**: 8
- Create major_skills pivot data with importance weights
  - **Priority**: High
  - **Points**: 3
- Seed major_skills relationships
  - **Priority**: High
  - **Points**: 2

---

### Story 2.7: Create Major-to-Occupations Mappings
**Description**:
- As a content curator
- I want to map majors to relevant O*NET occupations
- so that users see accurate career path information

**Labels**: `content`, `data-mapping`, `occupations`
**Priority**: High
**Story Points**: 13

#### Subtasks:
- Research relevant occupations for each major
  - **Priority**: High
  - **Points**: 8
- Create major_occupations pivot data with relevance scores
  - **Priority**: High
  - **Points**: 3
- Seed major_occupations relationships
  - **Priority**: High
  - **Points**: 2

---

## EPIC 3: Authentication System
**Epic Description**: Implement complete user authentication including registration, login, logout, and password reset functionality using Laravel Sanctum.

**Labels**: `authentication`, `security`, `backend`, `frontend`

### Story 3.1: Build Backend Authentication API
**Description**:
- As a backend developer
- I want to create authentication endpoints with Laravel Sanctum
- so that users can securely register and log in

**Labels**: `backend`, `auth`, `api`, `sanctum`
**Priority**: Highest
**Story Points**: 8

#### Subtasks:
- Create AuthController with register endpoint
  - **Priority**: Highest
  - **Points**: 2
- Create login endpoint with token generation
  - **Priority**: Highest
  - **Points**: 2
- Create logout endpoint to revoke tokens
  - **Priority**: Highest
  - **Points**: 1
- Add validation rules for registration and login
  - **Priority**: Highest
  - **Points**: 1
- Implement rate limiting for auth endpoints
  - **Priority**: High
  - **Points**: 2

---

### Story 3.2: Build Password Reset Functionality
**Description**:
- As a backend developer
- I want to implement password reset with email tokens
- so that users can recover their accounts

**Labels**: `backend`, `auth`, `email`, `password-reset`
**Priority**: High
**Story Points**: 5

#### Subtasks:
- Create forgot password endpoint
  - **Priority**: High
  - **Points**: 2
- Create reset password endpoint with token validation
  - **Priority**: High
  - **Points**: 2
- Configure email service for sending reset links
  - **Priority**: High
  - **Points**: 1

---
---

### Story 3.3: Build Frontend Authentication Context
**Description**:
- As a frontend developer
- I want to create an authentication context provider
- so that auth state is available throughout the application

**Labels**: `frontend`, `auth`, `context`, `react`
**Priority**: Highest
**Story Points**: 3

#### Subtasks:
- Create AuthContext with login/logout/register methods
  - **Priority**: Highest
  - **Points**: 2
- Implement token storage in httpOnly cookies
  - **Priority**: Highest
  - **Points**: 1

---

### Story 3.4: Build Registration and Login Pages
**Description**:
- As a frontend developer
- I want to create registration and login UI
- so that users can create accounts and sign in

**Labels**: `frontend`, `auth`, `ui`, `forms`
**Priority**: Highest
**Story Points**: 5

#### Subtasks:
- Create registration page with form validation (react-hook-form + zod)
  - **Priority**: Highest
  - **Points**: 2
- Create login page with form validation
  - **Priority**: Highest
  - **Points**: 2
- Add error handling and user feedback
  - **Priority**: High
  - **Points**: 1

---

### Story 3.5: Build Password Reset Pages
**Description**:
- As a frontend developer
- I want to create password reset UI flow
- so that users can recover their accounts

**Labels**: `frontend`, `auth`, `ui`, `password-reset`
**Priority**: High
**Story Points**: 3

#### Subtasks:
- Create forgot password page
  - **Priority**: High
  - **Points**: 1
- Create reset password page with token handling
  - **Priority**: High
  - **Points**: 2

---

### Story 3.6: Implement Protected Routes
**Description**:
- As a frontend developer
- I want to create a protected route wrapper
- so that authenticated pages require login

**Labels**: `frontend`, `auth`, `routing`, `security`
**Priority**: Highest
**Story Points**: 2

#### Subtasks:
- Create ProtectedRoute wrapper component
  - **Priority**: Highest
  - **Points**: 1
- Redirect unauthenticated users to login
  - **Priority**: Highest
  - **Points**: 1

---

## EPIC 4: Tier 1 Assessment System
**Epic Description**: Build the core assessment system including skills selection, interest profiler, strengths/weaknesses evaluation, and progress tracking.

**Labels**: `assessment`, `core-feature`, `backend`, `frontend`

### Story 4.1: Design Assessment Questions
**Description**:
- As a product designer
- I want to create assessment questions and structure
- so that we have a clear question set for implementation

**Labels**: `design`, `assessment`, `content`
**Priority**: Highest
**Story Points**: 8

#### Subtasks:
- Define skills selection interface requirements
  - **Priority**: Highest
  - **Points**: 2
- Create 10-15 interest profiler questions
  - **Priority**: Highest
  - **Points**: 3
- Create strengths/weaknesses rating scale questions
  - **Priority**: Highest
  - **Points**: 3

---

### Story 4.2: Build Assessment Backend API
**Description**:
- As a backend developer
- I want to create API endpoints for assessment flow
- so that the frontend can save and submit assessments

**Labels**: `backend`, `api`, `assessment`
**Priority**: Highest
**Story Points**: 8

#### Subtasks:
- Create AssessmentController with start endpoint
  - **Priority**: Highest
  - **Points**: 2
- Create save responses endpoint (partial progress)
  - **Priority**: Highest
  - **Points**: 2
- Create submit assessment endpoint
  - **Priority**: Highest
  - **Points**: 2
- Handle anonymous (guest) assessments
  - **Priority**: High
  - **Points**: 2

---

### Story 4.3: Build Skills Search and Selection API
**Description**:
- As a backend developer
- I want to create a skills search endpoint
- so that users can find and select skills with autocomplete

**Labels**: `backend`, `api`, `skills`, `search`
**Priority**: Highest
**Story Points**: 3

#### Subtasks:
- Create SkillController with search endpoint
  - **Priority**: Highest
  - **Points**: 2
- Implement query filtering by name and category
  - **Priority**: Highest
  - **Points**: 1

---

### Story 4.4: Build Assessment Frontend Flow
**Description**:
- As a frontend developer
- I want to create the multi-step assessment interface
- so that users can complete the assessment smoothly

**Labels**: `frontend`, `assessment`, `ui`, `forms`
**Priority**: Highest
**Story Points**: 13

#### Subtasks:
- Create assessment welcome/instructions page
  - **Priority**: Highest
  - **Points**: 2
- Build Section 1: Current Skills selection with autocomplete
  - **Priority**: Highest
  - **Points**: 3
- Build Section 2: Skills to Learn selection
  - **Priority**: Highest
  - **Points**: 2
- Build Section 3: Strengths/Weaknesses rating scales
  - **Priority**: Highest
  - **Points**: 3
- Build Section 4: Interest profiler questions
  - **Priority**: Highest
  - **Points**: 3

---

### Story 4.5: Implement Assessment Progress Tracking
**Description**:
- As a frontend developer
- I want to add progress indicators and navigation
- so that users know where they are in the assessment

**Labels**: `frontend`, `assessment`, `ux`, `progress`
**Priority**: High
**Story Points**: 3

#### Subtasks:
- Create progress bar component
  - **Priority**: High
  - **Points**: 1
- Add section navigation (Next/Back buttons)
  - **Priority**: High
  - **Points**: 1
- Save progress on each section completion
  - **Priority**: High
  - **Points**: 1

---

### Story 4.6: Handle Guest (Anonymous) Assessments
**Description**:
- As a frontend developer
- I want to allow users to start assessments without login
- so that we reduce friction for new users

**Labels**: `frontend`, `assessment`, `ux`, `auth`
**Priority**: High
**Story Points**: 3

#### Subtasks:
- Allow assessment start without authentication
  - **Priority**: High
  - **Points**: 1
- Store assessment data in local state
  - **Priority**: High
  - **Points**: 1
- Prompt user to register before viewing results
  - **Priority**: High
  - **Points**: 1

---

## EPIC 5: Matching Algorithm & Results
**Epic Description**: Implement the core matching algorithm that calculates major recommendations based on assessment responses, and display personalized results.

**Labels**: `algorithm`, `core-feature`, `backend`, `frontend`

### Story 5.1: Design Matching Algorithm Logic
**Description**:
- As a backend developer
- I want to design the matching algorithm with clear scoring rules
- so that we have a documented approach for implementation

**Labels**: `algorithm`, `design`, `documentation`
**Priority**: Highest
**Story Points**: 5

#### Subtasks:
- Define skill matching score calculation
  - **Priority**: Highest
  - **Points**: 2
- Define interest alignment calculation
  - **Priority**: Highest
  - **Points**: 2
- Define final score weighting strategy
  - **Priority**: Highest
  - **Points**: 1

---

### Story 5.2: Implement Matching Algorithm Service
**Description**:
- As a backend developer
- I want to create a MatchingService class
- so that assessment responses generate major recommendations

**Labels**: `backend`, `algorithm`, `service`
**Priority**: Highest
**Story Points**: 13

#### Subtasks:
- Create MatchingService class with skill matching logic
  - **Priority**: Highest
  - **Points**: 5
- Implement interest alignment scoring
  - **Priority**: Highest
  - **Points**: 3
- Implement strength/weakness scoring
  - **Priority**: Highest
  - **Points**: 3
- Combine scores with weights to calculate final match percentage
  - **Priority**: Highest
  - **Points**: 2

---

### Story 5.3: Generate Match Reasoning
**Description**:
- As a backend developer
- I want to store why each major matched
- so that users understand their recommendations

**Labels**: `backend`, `algorithm`, `explanation`
**Priority**: High
**Story Points**: 5

#### Subtasks:
- Track which skills matched for each major
  - **Priority**: High
  - **Points**: 2
- Track which interests aligned
  - **Priority**: High
  - **Points**: 2
- Store reasoning in assessment_results JSON field
  - **Priority**: High
  - **Points**: 1

---

### Story 5.4: Optimize Algorithm Performance
**Description**:
- As a backend developer
- I want to optimize the matching algorithm
- so that results are calculated in under 3 seconds

**Labels**: `backend`, `performance`, `optimization`
**Priority**: High
**Story Points**: 5

#### Subtasks:
- Profile algorithm execution time
  - **Priority**: High
  - **Points**: 1
- Optimize database queries with eager loading
  - **Priority**: High
  - **Points**: 2
- Add caching for static major data
  - **Priority**: High
  - **Points**: 2

---

### Story 5.5: Build Results Dashboard Frontend
**Description**:
- As a frontend developer
- I want to create the results dashboard UI
- so that users see their major recommendations

**Labels**: `frontend`, `results`, `ui`, `dashboard`
**Priority**: Highest
**Story Points**: 8

#### Subtasks:
- Create results page layout with top recommendations
  - **Priority**: Highest
  - **Points**: 3
- Display major cards with match percentages
  - **Priority**: Highest
  - **Points**: 2
- Create "Why this matched?" expandable sections
  - **Priority**: High
  - **Points**: 2
- Add retake assessment button
  - **Priority**: High
  - **Points**: 1

---

### Story 5.6: Implement Save/Favorite Majors
**Description**:
- As a user
- I want to save majors I'm interested in
- so that I can review them later

**Labels**: `backend`, `frontend`, `feature`, `favorites`
**Priority**: High
**Story Points**: 5

#### Subtasks:
- Create save major API endpoint (backend)
  - **Priority**: High
  - **Points**: 2
- Create delete saved major API endpoint (backend)
  - **Priority**: High
  - **Points**: 1
- Add save/favorite button to major cards (frontend)
  - **Priority**: High
  - **Points**: 2

---

## EPIC 6: Major Details & Resources
**Epic Description**: Build detailed major pages showing skills, career paths, salary data, and resources. Implement browse/search functionality.

**Labels**: `majors`, `frontend`, `backend`, `content`

### Story 6.1: Build Major Details API
**Description**:
- As a backend developer
- I want to create an API endpoint for major details
- so that the frontend can display comprehensive major information

**Labels**: `backend`, `api`, `majors`
**Priority**: High
**Story Points**: 5

#### Subtasks:
- Create MajorController with show endpoint
  - **Priority**: High
  - **Points**: 2
- Eager load skills and occupations relationships
  - **Priority**: High
  - **Points**: 2
- Return formatted JSON with all major details
  - **Priority**: High
  - **Points**: 1

---

### Story 6.2: Build Major Detail Page Frontend
**Description**:
- As a frontend developer
- I want to create detailed major pages
- so that users can explore major information in depth

**Labels**: `frontend`, `majors`, `ui`, `detail-page`
**Priority**: High
**Story Points**: 8

#### Subtasks:
- Create major detail page layout
  - **Priority**: High
  - **Points**: 2
- Display major overview and description
  - **Priority**: High
  - **Points**: 1
- Display required skills as tags/badges
  - **Priority**: High
  - **Points**: 2
- Display career paths with O*NET data (salary, outlook)
  - **Priority**: High
  - **Points**: 3

---

### Story 6.3: Build Browse Majors API
**Description**:
- As a backend developer
- I want to create browse and search endpoints
- so that users can explore all available majors

**Labels**: `backend`, `api`, `majors`, `search`
**Priority**: High
**Story Points**: 5

#### Subtasks:
- Create index endpoint with pagination
  - **Priority**: High
  - **Points**: 2
- Add search filtering by name
  - **Priority**: High
  - **Points**: 2
- Add category filtering
  - **Priority**: High
  - **Points**: 1

---

### Story 6.4: Build Resources/Browse Page Frontend
**Description**:
- As a frontend developer
- I want to create a browse page with search
- so that users can explore all majors

**Labels**: `frontend`, `majors`, `ui`, `browse`, `search`
**Priority**: High
**Story Points**: 8

#### Subtasks:
- Create browse page layout with category sections
  - **Priority**: High
  - **Points**: 2
- Implement search bar with real-time filtering
  - **Priority**: High
  - **Points**: 3
- Create major cards grid display
  - **Priority**: High
  - **Points**: 2
- Add category filters (sidebar or top)
  - **Priority**: High
  - **Points**: 1

---

## EPIC 7: Deep Dive Tests
**Epic Description**: Implement optional major-specific deep dive assessments that provide specialized career recommendations within a major category.

**Labels**: `assessment`, `deep-dive`, `backend`, `frontend`

### Story 7.1: Design Deep Dive Questions
**Description**:
- As a product designer
- I want to create deep dive questions for 3-5 major categories
- so that users can get specialized recommendations

**Labels**: `design`, `assessment`, `content`, `deep-dive`
**Priority**: Medium
**Story Points**: 13

#### Subtasks:
- Create Computer Science deep dive questions (15-20 questions)
  - **Priority**: Medium
  - **Points**: 3
- Create Business deep dive questions
  - **Priority**: Medium
  - **Points**: 3
- Create Healthcare deep dive questions
  - **Priority**: Medium
  - **Points**: 3
- Create Engineering deep dive questions
  - **Priority**: Medium
  - **Points**: 2
- Create Arts deep dive questions
  - **Priority**: Medium
  - **Points**: 2

---

### Story 7.2: Build Deep Dive Assessment Backend
**Description**:
- As a backend developer
- I want to create API endpoints for deep dive assessments
- so that users can take specialized tests

**Labels**: `backend`, `api`, `assessment`, `deep-dive`
**Priority**: Medium
**Story Points**: 8

#### Subtasks:
- Extend assessment endpoints to handle deep_dive type
  - **Priority**: Medium
  - **Points**: 3
- Create specialization scoring logic in MatchingService
  - **Priority**: Medium
  - **Points**: 3
- Generate specialization recommendations with O*NET mappings
  - **Priority**: Medium
  - **Points**: 2

---

### Story 7.3: Build Deep Dive Assessment Frontend
**Description**:
- As a frontend developer
- I want to create deep dive test pages
- so that users can take specialized assessments

**Labels**: `frontend`, `assessment`, `ui`, `deep-dive`
**Priority**: Medium
**Story Points**: 8

#### Subtasks:
- Create deep dive assessment flow pages
  - **Priority**: Medium
  - **Points**: 3
- Display major-specific questions
  - **Priority**: Medium
  - **Points**: 2
- Show specialization results with rankings
  - **Priority**: Medium
  - **Points**: 3

---

### Story 7.4: Add Deep Dive CTA to Major Pages
**Description**:
- As a frontend developer
- I want to add "Take Deep Dive Test" buttons
- so that users can access specialized assessments from major pages

**Labels**: `frontend`, `ui`, `majors`, `deep-dive`
**Priority**: Medium
**Story Points**: 2

#### Subtasks:
- Add deep dive button to major detail pages
  - **Priority**: Medium
  - **Points**: 1
- Handle navigation to deep dive assessment
  - **Priority**: Medium
  - **Points**: 1

---

## EPIC 8: User Profile & Dashboard
**Epic Description**: Build user profile pages showing saved majors, assessment history, and account management.

**Labels**: `profile`, `dashboard`, `frontend`, `backend`

### Story 8.1: Build User Profile API
**Description**:
- As a backend developer
- I want to create user profile endpoints
- so that users can view their data

**Labels**: `backend`, `api`, `profile`
**Priority**: Medium
**Story Points**: 5

#### Subtasks:
- Create UserController with profile endpoint
  - **Priority**: Medium
  - **Points**: 2
- Return user info, assessment history, and saved majors
  - **Priority**: Medium
  - **Points**: 2
- Create update profile endpoint
  - **Priority**: Low
  - **Points**: 1

---

### Story 8.2: Build User Profile Page Frontend
**Description**:
- As a frontend developer
- I want to create a user profile page
- so that users can view their saved majors and history

**Labels**: `frontend`, `profile`, `ui`, `dashboard`
**Priority**: Medium
**Story Points**: 8

#### Subtasks:
- Create profile page layout
  - **Priority**: Medium
  - **Points**: 2
- Display user information
  - **Priority**: Medium
  - **Points**: 1
- Display assessment history with top 3 results
  - **Priority**: Medium
  - **Points**: 2
- Display saved/favorited majors grid
  - **Priority**: Medium
  - **Points**: 2
- Add retake assessment option
  - **Priority**: Medium
  - **Points**: 1

---

## EPIC 9: Landing Page & Marketing
**Epic Description**: Build the public-facing landing page with hero section, how it works, and call-to-action.

**Labels**: `frontend`, `marketing`, `landing-page`, `public`

### Story 9.1: Design Landing Page
**Description**:
- As a designer
- I want to create landing page mockups
- so that we have a clear design to implement

**Labels**: `design`, `landing-page`, `ui`
**Priority**: Medium
**Story Points**: 5

#### Subtasks:
- Design hero section with CTA
  - **Priority**: Medium
  - **Points**: 2
- Design "How It Works" section
  - **Priority**: Medium
  - **Points**: 2
- Design footer with links
  - **Priority**: Low
  - **Points**: 1

---

### Story 9.2: Build Landing Page Frontend
**Description**:
- As a frontend developer
- I want to build the landing page
- so that users have an entry point to the platform

**Labels**: `frontend`, `landing-page`, `ui`, `public`
**Priority**: Medium
**Story Points**: 8

#### Subtasks:
- Build hero section with "Start Free Assessment" CTA
  - **Priority**: Medium
  - **Points**: 3
- Build "How It Works" section (3-step visual)
  - **Priority**: Medium
  - **Points**: 3
- Build footer with About, Privacy, Terms links
  - **Priority**: Low
  - **Points**: 2

---

### Story 9.3: Create Privacy Policy and Terms Pages
**Description**:
- As a content writer
- I want to create privacy policy and terms of service
- so that we comply with legal requirements

**Labels**: `content`, `legal`, `compliance`
**Priority**: Medium
**Story Points**: 5

#### Subtasks:
- Write privacy policy content
  - **Priority**: Medium
  - **Points**: 3
- Write terms of service content
  - **Priority**: Medium
  - **Points**: 2

---

## EPIC 10: Testing & Quality Assurance
**Epic Description**: Write tests, perform QA, and ensure application quality and security.

**Labels**: `testing`, `qa`, `quality`, `security`

### Story 10.1: Write Backend Unit Tests
**Description**:
- As a backend developer
- I want to write PHPUnit tests for critical logic
- so that we ensure code quality

**Labels**: `backend`, `testing`, `unit-tests`
**Priority**: High
**Story Points**: 8

#### Subtasks:
- Write tests for MatchingService algorithm
  - **Priority**: High
  - **Points**: 3
- Write tests for authentication logic
  - **Priority**: High
  - **Points**: 2
- Write tests for API validation rules
  - **Priority**: High
  - **Points**: 3

---

### Story 10.2: Write Backend Integration Tests
**Description**:
- As a backend developer
- I want to write Laravel Feature tests for API endpoints
- so that we ensure endpoints work correctly

**Labels**: `backend`, `testing`, `integration-tests`
**Priority**: High
**Story Points**: 8

#### Subtasks:
- Write tests for auth endpoints (register, login, logout)
  - **Priority**: High
  - **Points**: 3
- Write tests for assessment endpoints
  - **Priority**: High
  - **Points**: 3
- Write tests for major endpoints
  - **Priority**: High
  - **Points**: 2

---

### Story 10.3: Write Frontend Component Tests
**Description**:
- As a frontend developer
- I want to write Vitest/Jest tests for React components
- so that we ensure UI components work correctly

**Labels**: `frontend`, `testing`, `component-tests`
**Priority**: Medium
**Story Points**: 5

#### Subtasks:
- Write tests for auth forms (registration, login)
  - **Priority**: Medium
  - **Points**: 2
- Write tests for assessment components
  - **Priority**: Medium
  - **Points**: 2
- Write tests for major cards and results display
  - **Priority**: Medium
  - **Points**: 1

---

### Story 10.4: Perform Security Audit
**Description**:
- As a security engineer
- I want to audit the application for vulnerabilities
- so that we ensure user data is protected

**Labels**: `security`, `audit`, `testing`
**Priority**: High
**Story Points**: 8

#### Subtasks:
- Test for SQL injection vulnerabilities
  - **Priority**: High
  - **Points**: 2
- Test for XSS vulnerabilities
  - **Priority**: High
  - **Points**: 2
- Verify authentication and authorization rules
  - **Priority**: High
  - **Points**: 2
- Test rate limiting on sensitive endpoints
  - **Priority**: High
  - **Points**: 2

---

### Story 10.5: Performance Testing and Optimization
**Description**:
- As a developer
- I want to test and optimize application performance
- so that page loads and API responses are fast

**Labels**: `performance`, `testing`, `optimization`
**Priority**: Medium
**Story Points**: 5

#### Subtasks:
- Test page load times (<3s target)
  - **Priority**: Medium
  - **Points**: 1
- Test API response times (<1s p95 target)
  - **Priority**: Medium
  - **Points**: 1
- Optimize frontend bundle size (<200KB)
  - **Priority**: Medium
  - **Points**: 2
- Profile and optimize database queries
  - **Priority**: Medium
  - **Points**: 1

---

### Story 10.6: Responsive Design Testing
**Description**:
- As a QA tester
- I want to test the application on multiple devices
- so that it works properly on mobile, tablet, and desktop

**Labels**: `frontend`, `testing`, `responsive`, `qa`
**Priority**: High
**Story Points**: 5

#### Subtasks:
- Test on mobile devices (320px-767px)
  - **Priority**: High
  - **Points**: 2
- Test on tablets (768px-1023px)
  - **Priority**: High
  - **Points**: 2
- Test on desktop (1024px+)
  - **Priority**: High
  - **Points**: 1

---

### Story 10.7: Accessibility Testing
**Description**:
- As a QA tester
- I want to test WCAG 2.1 AA compliance
- so that the application is accessible to all users

**Labels**: `frontend`, `testing`, `accessibility`, `a11y`
**Priority**: High
**Story Points**: 5

#### Subtasks:
- Test keyboard navigation
  - **Priority**: High
  - **Points**: 2
- Test screen reader compatibility
  - **Priority**: High
  - **Points**: 2
- Verify color contrast ratios
  - **Priority**: High
  - **Points**: 1

---

## EPIC 11: Deployment & Infrastructure
**Epic Description**: Set up hosting, configure CI/CD, implement monitoring, and deploy to production.

**Labels**: `devops`, `deployment`, `infrastructure`, `production`

### Story 11.1: Configure Hosting for Frontend
**Description**:
- As a DevOps engineer
- I want to set up hosting for the Next.js frontend
- so that users can access the application

**Labels**: `devops`, `hosting`, `frontend`, `vercel`
**Priority**: High
**Story Points**: 3

#### Subtasks:
- Set up Vercel project (or chosen hosting)
  - **Priority**: High
  - **Points**: 1
- Configure environment variables
  - **Priority**: High
  - **Points**: 1
- Set up custom domain (if applicable)
  - **Priority**: Medium
  - **Points**: 1

---

### Story 11.2: Configure Hosting for Backend & Database
**Description**:
- As a DevOps engineer
- I want to set up hosting for Laravel backend and PostgreSQL
- so that the API is accessible

**Labels**: `devops`, `hosting`, `backend`, `database`
**Priority**: High
**Story Points**: 5

#### Subtasks:
- Set up Laravel hosting (Railway/DigitalOcean/chosen platform)
  - **Priority**: High
  - **Points**: 2
- Set up PostgreSQL database hosting
  - **Priority**: High
  - **Points**: 2
- Configure environment variables and secrets
  - **Priority**: High
  - **Points**: 1

---

### Story 11.3: Set Up CI/CD Pipeline
**Description**:
- As a DevOps engineer
- I want to set up automated deployments
- so that code changes deploy automatically

**Labels**: `devops`, `cicd`, `automation`, `github-actions`
**Priority**: Medium
**Story Points**: 5

#### Subtasks:
- Create GitHub Actions workflow for frontend
  - **Priority**: Medium
  - **Points**: 2
- Create GitHub Actions workflow for backend
  - **Priority**: Medium
  - **Points**: 2
- Configure deployment triggers (dev and main branches)
  - **Priority**: Medium
  - **Points**: 1

---

### Story 11.4: Configure Email Service
**Description**:
- As a DevOps engineer
- I want to set up transactional email service
- so that password reset emails work

**Labels**: `devops`, `email`, `sendgrid`, `configuration`
**Priority**: High
**Story Points**: 3

#### Subtasks:
- Set up SendGrid account (or chosen service)
  - **Priority**: High
  - **Points**: 1
- Configure Laravel mail settings
  - **Priority**: High
  - **Points**: 1
- Test email delivery
  - **Priority**: High
  - **Points**: 1

---

### Story 11.5: Set Up Error Tracking and Monitoring
**Description**:
- As a DevOps engineer
- I want to implement error tracking and monitoring
- so that we can detect and fix issues quickly

**Labels**: `devops`, `monitoring`, `sentry`, `observability`
**Priority**: Medium
**Story Points**: 3

#### Subtasks:
- Set up Sentry for frontend error tracking
  - **Priority**: Medium
  - **Points**: 1
- Set up Sentry for backend error tracking
  - **Priority**: Medium
  - **Points**: 1
- Configure uptime monitoring (UptimeRobot or similar)
  - **Priority**: Low
  - **Points**: 1

---

### Story 11.6: Deploy to Production
**Description**:
- As a DevOps engineer
- I want to deploy the application to production
- so that users can access the live platform

**Labels**: `devops`, `deployment`, `production`, `launch`
**Priority**: High
**Story Points**: 5

#### Subtasks:
- Run final database migrations on production
  - **Priority**: High
  - **Points**: 1
- Seed production database with initial data
  - **Priority**: High
  - **Points**: 2
- Deploy frontend to production
  - **Priority**: High
  - **Points**: 1
- Deploy backend to production
  - **Priority**: High
  - **Points**: 1

---

## EPIC 12: Polish & Bug Fixes
**Epic Description**: Final polish, bug fixes, and improvements based on testing and feedback.

**Labels**: `polish`, `bug-fixes`, `improvements`, `ux`

### Story 12.1: UI/UX Polish Pass
**Description**:
- As a frontend developer
- I want to polish the UI and improve user experience
- so that the application feels professional

**Labels**: `frontend`, `ui`, `ux`, `polish`
**Priority**: Medium
**Story Points**: 8

#### Subtasks:
- Add loading states and spinners
  - **Priority**: Medium
  - **Points**: 2
- Improve error messages and user feedback
  - **Priority**: Medium
  - **Points**: 2
- Add smooth transitions and animations
  - **Priority**: Low
  - **Points**: 2
- Improve mobile experience with touch optimization
  - **Priority**: Medium
  - **Points**: 2

---

### Story 12.2: Bug Fixes from Testing
**Description**:
- As a developer
- I want to fix bugs discovered during testing
- so that the application works reliably

**Labels**: `bug`, `fixes`, `testing`
**Priority**: High
**Story Points**: 8

#### Subtasks:
- Create bug tracking list from QA
  - **Priority**: High
  - **Points**: 1
- Fix critical bugs (P0)
  - **Priority**: High
  - **Points**: 3
- Fix high priority bugs (P1)
  - **Priority**: High
  - **Points**: 3
- Fix medium priority bugs (P2)
  - **Priority**: Medium
  - **Points**: 1

---

### Story 12.3: Performance Optimization Final Pass
**Description**:
- As a developer
- I want to do a final performance optimization
- so that the application meets performance targets

**Labels**: `performance`, `optimization`, `backend`, `frontend`
**Priority**: Medium
**Story Points**: 5

#### Subtasks:
- Implement lazy loading for images and components
  - **Priority**: Medium
  - **Points**: 2
- Add database query caching where appropriate
  - **Priority**: Medium
  - **Points**: 2
- Optimize API response sizes
  - **Priority**: Low
  - **Points**: 1

---

## Summary

**Total Epics**: 12
**Total Stories**: 57
**Estimated Total Story Points**: 367

**Priority Breakdown**:
- **Highest Priority (P0)**: Project Setup, Database Schema, Authentication, Core Assessment, Matching Algorithm
- **High Priority (P1)**: Deep features completion, Major Details, Testing, Deployment
- **Medium Priority (P2)**: Deep Dive Tests, Profile, Landing Page, Polish
- **Low Priority (P3)**: Nice-to-have improvements

**Recommended Sprint Order**:
1. **Sprint 1**: Epic 1 (Setup) + Epic 2 (Database)
2. **Sprint 2**: Epic 3 (Authentication)
3. **Sprint 3**: Epic 4 (Assessment System)
4. **Sprint 4**: Epic 5 (Matching & Results)
5. **Sprint 5**: Epic 6 (Major Details & Resources)
6. **Sprint 6**: Epic 8 (User Profile) + Epic 9 (Landing Page)
7. **Sprint 7**: Epic 7 (Deep Dive Tests)
8. **Sprint 8**: Epic 10 (Testing & QA)
9. **Sprint 9**: Epic 11 (Deployment)
10. **Sprint 10**: Epic 12 (Polish & Bug Fixes)

**Notes**:
- DB schema implementation is included in Epic 2 (Stories 2.1-2.2)
- Data seeding is broken down into clear, actionable subtasks
- All stories follow user story format: "As a [role], I want [capability], so that [benefit]"
- Story points use Fibonacci sequence (1, 2, 3, 5, 8, 13)
- Priorities align with MVP requirements from PRC document