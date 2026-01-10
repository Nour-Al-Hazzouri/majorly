<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Models\Skill;
use App\Models\Occupation;
use Illuminate\Support\Str;

class ImportEscoSkills extends Command
{
    protected $signature = 'majorly:import-esco-skills {--path= : Optional path to ESCO CSV folder}';
    protected $description = 'Import ESCO Skills and link to Occupations';

    public function handle()
    {
        $basePath = $this->option('path') ?: storage_path('app/opendata/ESCO dataset - v1.2.1 - classification - en - csv');
        
        $files = [
            'skills' => $basePath . '/skills_en.csv',
            'occupations' => $basePath . '/occupations_en.csv',
            'relations' => $basePath . '/occupationSkillRelations_en.csv'
        ];

        // 1. Validation
        foreach ($files as $name => $file) {
            if (!file_exists($file)) {
                $this->error("Missing file: $file");
                $this->warn("Please download the ESCO v1.1.1 CSV package (English).");
                $this->warn("Download Link: https://ec.europa.eu/esco/portal/download");
                $this->warn("Action: Download 'ESCO dataset - v1.1.1 (csv)', unzip, and place files in: $basePath");
                return;
            }
        }

        $this->info("Loading ESCO Data...");
        
        DB::beginTransaction();
        try {
            // 2. Load ESCO Occupations (URI -> Name)
            $this->info("Parsing ESCO Occupations...");
            $escoOccMap = []; // URI -> [names]
            $escoIscoMap = []; // URI -> ISCO
            if (($handle = fopen($files['occupations'], "r")) !== FALSE) {
                $header = fgetcsv($handle);
                $uriIdx = array_search('conceptUri', $header);
                $nameIdx = array_search('preferredLabel', $header);
                $altIdx = array_search('altLabels', $header);
                $iscoIdx = array_search('iscoGroup', $header);
                
                if ($uriIdx === false) $uriIdx = 1; 
                if ($nameIdx === false) $nameIdx = 3;

                while (($data = fgetcsv($handle)) !== FALSE) {
                    if (isset($data[$uriIdx])) {
                        $uri = $data[$uriIdx];
                        $names = [];
                        if (isset($data[$nameIdx])) {
                            $names[] = Str::lower(Str::singular($data[$nameIdx]));
                        }
                        if ($altIdx !== false && isset($data[$altIdx])) {
                            $alts = explode("\n", $data[$altIdx]);
                            foreach ($alts as $alt) {
                                $names[] = Str::lower(Str::singular(trim($alt)));
                            }
                        }
                        $escoOccMap[$uri] = array_unique(array_filter($names));
                        
                        // ISCO
                        if ($iscoIdx !== false && isset($data[$iscoIdx])) {
                            $escoIscoMap[$uri] = $data[$iscoIdx];
                        }
                    }
                }
                fclose($handle);
            }

            // 3. Load O*NET Occupations (Name -> ID)
            $this->info("Loading O*NET Occupations from DB...");
            $onetOccMap = [];
            foreach (Occupation::all() as $occ) {
                $normName = Str::lower(Str::singular($occ->name));
                $onetOccMap[$normName] = $occ->id;
            }

            // 4. Map ESCO URI -> O*NET ID (Name matching only for high precision)
            $this->info("Mapping ESCO URIs to O*NET IDs...");
            $uriToOnetId = [];
            $matchesByName = 0;

            foreach ($escoOccMap as $uri => $names) {
                // Only use name matching for accuracy
                foreach ($names as $name) {
                    if (isset($onetOccMap[$name])) {
                        $uriToOnetId[$uri] = $onetOccMap[$name];
                        $matchesByName++;
                        break;
                    }
                }
            }
            $this->info("Matched $matchesByName occupations by exact name matching (high precision mode).");

            // 5. Load Skills (URI -> Details)
            $this->info("Parsing ESCO Skills...");
            $skillsMap = []; // URI -> [name, type]
            if (($handle = fopen($files['skills'], "r")) !== FALSE) {
                $header = fgetcsv($handle);
                $uriIdx = array_search('conceptUri', $header) ?: 0;
                $nameIdx = array_search('preferredLabel', $header) ?: 1;
                $typeIdx = array_search('skillType', $header) ?: 2;

                while (($data = fgetcsv($handle)) !== FALSE) {
                    $skillsMap[$data[$uriIdx]] = [
                        'name' => $data[$nameIdx],
                        'category' => $data[$typeIdx] ?? 'ESCO Skill'
                    ];
                }
                fclose($handle);
            }

            // 6. Process Relations
            $this->info("Linking Skills to Occupations...");
            $relationChunk = [];
            $skillUpsertChunk = [];
            $seenSkills = [];

            if (($handle = fopen($files['relations'], "r")) !== FALSE) {
                fgetcsv($handle); // Skip header
                while (($data = fgetcsv($handle)) !== FALSE) {
                    // Correct Indexes for v1.2.1:
                    // 0: occupationUri, 1: occupationLabel, 2: relationType, 3: skillType, 4: skillUri, 5: skillLabel
                    $occUri = $data[0] ?? null;
                    $skillUri = $data[4] ?? null;
                    $relation = $data[2] ?? '';

                    if ($relation !== 'essential') continue;

                    if (isset($uriToOnetId[$occUri]) && isset($skillsMap[$skillUri])) {
                        $skill = $skillsMap[$skillUri];
                        
                        if (!isset($seenSkills[$skill['name']])) {
                            $skillUpsertChunk[$skill['name']] = [
                                'name' => $skill['name'],
                                'category' => $skill['category'] ?? 'Professional',
                                'lightcast_id' => 'ESCO_' . substr(md5($skill['name']), 0, 10),
                                'created_at' => now(), 'updated_at' => now()
                            ];
                            $seenSkills[$skill['name']] = true;
                        }
                    }
                }
                fclose($handle);
            }

            // 7. Upsert Skills
            $this->info("Upserting " . count($skillUpsertChunk) . " ESCO Skills...");
            foreach (array_chunk($skillUpsertChunk, 1000) as $chunk) {
                Skill::upsert(array_values($chunk), ['name'], ['category', 'lightcast_id']);
            }
            
            // 8. Create Links
            $dbSkills = Skill::pluck('id', 'name')->toArray();
            $pivots = [];
            
            if (($handle = fopen($files['relations'], "r")) !== FALSE) {
                fgetcsv($handle);
                while (($data = fgetcsv($handle)) !== FALSE) {
                    $occUri = $data[0] ?? null;
                    $skillUri = $data[4] ?? null;
                    $relation = $data[2] ?? '';
                    
                    if ($relation !== 'essential') continue;

                    if (isset($uriToOnetId[$occUri]) && isset($skillsMap[$skillUri])) {
                        $skillName = $skillsMap[$skillUri]['name'];
                        
                        if (isset($dbSkills[$skillName])) {
                            $pivots[] = [
                                'occupation_id' => $uriToOnetId[$occUri],
                                'skill_id' => $dbSkills[$skillName],
                                'created_at' => now(), 'updated_at' => now()
                            ];
                        }
                    }
                }
                fclose($handle);
            }

            // Dedup and Insert
            $pivots = array_map("unserialize", array_unique(array_map("serialize", $pivots)));
            $this->info("Inserting " . count($pivots) . " Links...");
            
            foreach (array_chunk($pivots, 1000) as $chunk) {
                DB::table('occupation_skill')->insertOrIgnore($chunk);
            }
             
            // Also link to Specializations? 
            // If an occupation gets a skill, all its specializations likely "inherit" it or are related.
            // But for now, let's keep it clean on the Occupation model.
             
            DB::commit();
            $this->info("Done!");
            
        } catch (\Exception $e) {
            DB::rollBack();
            $this->error($e->getMessage());
        }
    }
}
