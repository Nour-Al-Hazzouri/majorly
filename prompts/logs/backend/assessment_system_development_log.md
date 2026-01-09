## Log Entry #1 - 2026-01-07
---
## Log Entry #2 - 2026-01-07
**Action Taken**:
1. Implemented `QuestionService`, `SkillController`, and `AssessmentController`.
2. Updated `routes/api.php` with assessment and skills endpoints.
3. Created `SkillFactory` and `AssessmentFactory`.
4. Restored `fillable` properties to models after accidental removal.
5. Ran `php artisan test --filter AssessmentTest`.

### 📁 Files Modified/Created
- `backend/app/Services/QuestionService.php` (NEW)
- `backend/app/Http/Controllers/Api/SkillController.php` (NEW)
- `backend/app/Http/Controllers/Api/AssessmentController.php` (NEW)
- `backend/routes/api.php`
- `backend/app/Models/Skill.php`
- `backend/app/Models/Assessment.php`
- `backend/app/Models/AssessmentResponse.php`
- `backend/database/factories/SkillFactory.php` (NEW)
- `backend/database/factories/AssessmentFactory.php` (NEW)
- `backend/tests/Feature/AssessmentTest.php` (NEW)

---

## Log Entry #3 - 2026-01-07
**Action Taken**:
1. Migrated database and updated seeder with ideal profile data.
2. Implemented `MatchingService` with robust scoring algorithms.
3. Updated `AssessmentController` to process results upon submission.
4. Created and ran `MatchingServiceTest.php`.

### 📁 Files Modified/Created
- `backend/database/migrations/2026_01_07_182556_add_ideal_profiles_to_majors_table.php` (NEW)
- `backend/app/Models/Major.php`
- `backend/database/seeders/MajorSeeder.php`
- `backend/app/Services/MatchingService.php` (NEW)
- `backend/app/Http/Controllers/Api/AssessmentController.php`
- `backend/tests/Feature/MatchingServiceTest.php` (NEW)

---

## Log Entry #4 - 2026-01-09
**Action Taken**:
1. Fixed duplicate percentage issue where multiple majors/occupations showed identical affinity scores.
2. Added `ensureUniquePercentages()` helper method that subtracts 0.5% deltas from duplicates.
3. Applied fix to both `generateRecommendations()` and `generateSpecializationRecommendations()`.
4. Removed ineffective micro tie-breakers that were getting lost after rounding.
5. Ran `php artisan test --filter MatchingServiceTest` - all 6 tests passed.

### 📁 Files Modified
- `backend/app/Services/MatchingService.php`

---

## Log Entry #5 - 2026-01-09
**Action Taken**:
1. Fixed `ensureUniquePercentages()` delta from 0.5 to 0.01 for finer-grained unique percentages.
2. Diagnosed root cause of incorrect recommendations: skill-major mappings in database were random/incorrect.
3. Created `FixSkillMajorMappings` artisan command with comprehensive keyword mappings for all 22 major categories.
4. Ran command to re-map 646 skill-major relationships based on intelligent keyword matching.
5. Programming skills (PHP, Python, JavaScript, Java, HTML, CSS) now properly linked to "Computer and Mathematical" major.
6. All 6 MatchingServiceTest tests pass.

### 📁 Files Modified/Created
- `backend/app/Services/MatchingService.php` (delta 0.5 → 0.01)
- `backend/app/Console/Commands/FixSkillMajorMappings.php` (NEW)

---
