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
        $basePath = $this->option('path') ?: storage_path('app/opendata/esco');
        
        $files = [
            'skills' => $basePath . '/skills_en.csv',
            'occupations' => $basePath . '/occupations_en.csv',
            'relations' => $basePath . '/occupationSkillRelations.csv'
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
            $escoOccMap = []; // URI -> Name
            if (($handle = fopen($files['occupations'], "r")) !== FALSE) {
                $header = fgetcsv($handle);
                $uriIdx = array_search('conceptUri', $header) ?: 0;
                $nameIdx = array_search('preferredLabel', $header) ?: array_search('term', $header); // Headers vary by version
                
                while (($data = fgetcsv($handle)) !== FALSE) {
                    if (isset($data[$uriIdx]) && isset($data[$nameIdx])) {
                        $escoOccMap[$data[$uriIdx]] = Str::lower($data[$nameIdx]);
                    }
                }
                fclose($handle);
            }

            // 3. Load O*NET Occupations (Name -> ID)
            $onetOccMap = Occupation::pluck('id', 'name')->map(fn($id, $name) => [Str::lower($name) => $id])->collapse()->toArray();

            // 4. Map ESCO URI -> O*NET ID (via Name Match)
            $uriToOnetId = [];
            $matches = 0;
            foreach ($escoOccMap as $uri => $name) {
                if (isset($onetOccMap[$name])) {
                    $uriToOnetId[$uri] = $onetOccMap[$name];
                    $matches++;
                }
            }
            $this->info("Matched $matches Occupations by name.");

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
                    // data[0] = occupationUri, data[1] = skillUri, data[2] = relationType, data[3] = skillType
                    $occUri = $data[0];
                    $skillUri = $data[1];
                    $relation = $data[2] ?? '';

                    // Only link 'essential' skills (optional: include 'optional'?)
                    if ($relation !== 'essential') continue;

                    // If this occupation matches one of ours
                    if (isset($uriToOnetId[$occUri]) && isset($skillsMap[$skillUri])) {
                        $onetId = $uriToOnetId[$occUri];
                        $skill = $skillsMap[$skillUri];
                        
                        // Queue Skill for Upsert
                        if (!isset($seenSkills[$skill['name']])) {
                            $skillUpsertChunk[$skill['name']] = [
                                'name' => $skill['name'],
                                'category' => $skill['category'] ?? 'Professional',
                                'lightcast_id' => 'ESCO_' . substr(md5($skill['name']), 0, 10), // Deterministic ID
                                'created_at' => now(), 'updated_at' => now()
                            ];
                            $seenSkills[$skill['name']] = true;
                        }

                        // We delay linking until we have Skill IDs
                    }
                }
                fclose($handle);
            }

            // 7. Upsert Skills
            $this->info("Upserting " . count($skillUpsertChunk) . " ESCO Skills...");
            foreach (array_chunk($skillUpsertChunk, 1000) as $chunk) {
                Skill::upsert($chunk, ['name'], ['category', 'lightcast_id']);
            }
            
            // 8. Create Links (Now that we have IDs)
            $dbSkills = Skill::pluck('id', 'name')->toArray();
            $pivots = [];
            
            // Re-read relations to link (memory efficient)
            if (($handle = fopen($files['relations'], "r")) !== FALSE) {
                fgetcsv($handle);
                while (($data = fgetcsv($handle)) !== FALSE) {
                    $occUri = $data[0];
                    $skillUri = $data[1];
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
