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
- **Framework**: [Next.js 16+](https://nextjs.org/) (App Router)
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

### Initial Data Setup

The platform relies on several external datasets for its "Truth" data (O*NET, CIP, and ESCO).

#### 1. Automated Setup (O*NET & CIP)
You can automatically download and extract the primary US-based datasets using:
```bash
php artisan majorly:download-open-data
```
This command will:
- Download **O*NET 29.1 (Text Format)** to `storage/app/opendata/onet.zip`
- Extract it to `storage/app/opendata/onet/db_29_1_text/`
- Download the **CIP 2020 - SOC 2018 Crosswalk** to `storage/app/opendata/CIP2020_SOC2018_Crosswalk.csv`

#### 2. Manual ESCO Setup
Due to licensing and portal constraints, ESCO data must be downloaded manually:
1. Visit the [ESCO Portal Download Page](https://ec.europa.eu/esco/portal/download).
2. Download the **"ESCO dataset - v1.2.1 (classification - en - csv)"** package.
3. Extract the contents into: `backend/storage/app/opendata/ESCO dataset - v1.2.1 - classification - en - csv/`
   - Ensure the folder contains `skills_en.csv`, `occupations_en.csv`, and `occupationSkillRelations_en.csv`.

#### 3. Running the Imports
Once files are in place, run the following commands in order:

```bash
# 1. Primary O*NET and CIP Import (Hierarchy & Mapping)
php artisan majorly:import-open-data

# 2. ESCO Skills Integration (Technical & Professional Skills)
php artisan majorly:import-esco-skills
```

> [!NOTE]
> These imports are intensive and may take several minutes to complete as they process tens of thousands of records and calculate skill relevance weights.

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
