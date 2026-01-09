# Majorly 💫

**Find the Major You'll Actually Love.**

Majorly is an academic concierge designed to bridge the gap between human potential and academic choice. It helps students navigate the complex world of college majors by matching their unique skills, interests, and aspirations with data-backed career paths and educational outcomes.

---

## 🚀 Why I Built This

Choosing a college major is one of the first big decisions in adulthood, yet widespread **confusion and unsureness** is the norm. I experienced this first-hand—even I wasn't entirely sure about my own decision. Seeing this uncertainty around me, I knew there was a need for a clearer path.

At the same time, I wanted to push the boundaries of modern development. I wanted to test my own prompt files for **"vibe coding"** and decided to put that energy into building something that helps others find their way.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend
- **Framework**: [Laravel 12](https://laravel.com/)
- **Authentication**: [Laravel Sanctum](https://laravel.com/docs/sanctum)
- **Language**: PHP 8.2+
- **Database**: PostgreSQL / SQLite (Development)

### Data Sources
- **[Lightcast Open Skills API](https://lightcast.io/open-skills)**: Precise skills matching and taxonomy.
- **[O*NET Web Services](https://www.onetonline.org/)**: Validated career paths, salary data, and job outlooks.

---

## 🏁 Getting Started

### Prerequisites
- **PHP 8.2+**
- **Composer**
- **Node.js & pnpm** (or npm/yarn)
- **SQLite** (or your preferred database)

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   composer install
   ```
3. Setup environment:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
4. Run migrations:
   ```bash
   php artisan migrate
   ```
5. Start the server:
   ```bash
   php artisan serve
   ```

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the development server:
   ```bash
   pnpm dev
   ```

---

## 🎈 Just for Fun

This project was a fun experience for me to explore the synergy between AI and development. 

## NOTE
> I alone can only test so much. If you happen to come across any bugs, glitches, or unexpected behavior, hit me up on LinkedIn: [Nour Al-Hazzouri](https://www.linkedin.com/in/nour-al-hazzouri/)

**Feel free to fork it, use the code, and make it your own!** 

If you do use it, I'd love a shoutout with a link back to this repo. ;)

---

**GitHub Repository**: [https://github.com/Nour-Al-Hazzouri/majorly](https://github.com/Nour-Al-Hazzouri/majorly)
