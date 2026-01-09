<?php

namespace App\Console\Commands;

use App\Models\Occupation;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class ImportOnetData extends Command
{
    protected $signature = 'majorly:import-onet-data';
    protected $description = 'Import local O*NET skill and knowledge ratings from text files';

    private string $basePath;

    public function handle()
    {
        $this->basePath = storage_path('app/opendata/onet/db_29_1_text');

        if (!File::exists($this->basePath)) {
            $this->error("O*NET data path not found: {$this->basePath}");
            return;
        }

        $this->info("Starting O*NET data import from: {$this->basePath}");

        $this->importSkills();
        $this->importKnowledge();

        $this->info("Import completed successfully!");
    }

    private function importSkills()
    {
        $filePath = "{$this->basePath}/Skills.txt";
        if (!File::exists($filePath)) {
            $this->warn("Skills.txt not found.");
            return;
        }

        $this->info("Importing Skills...");
        $handle = fopen($filePath, "r");
        fgets($handle); // Skip header

        $batch = [];
        $count = 0;
        
        while (($line = fgets($handle)) !== false) {
            $parts = explode("\t", trim($line));
            if (count($parts) < 5) continue;

            $socCode = $parts[0];
            $elementId = $parts[1];
            $name = $parts[2];
            $scaleId = $parts[3];
            $value = floatval($parts[4]);

            $occupation = DB::table('occupations')->where('soc_code', $socCode)->first();
            if (!$occupation) continue;

            $key = "{$occupation->id}_{$elementId}";
            if (!isset($batch[$key])) {
                $batch[$key] = [
                    'occupation_id' => $occupation->id,
                    'onet_skill_id' => $elementId,
                    'name' => $name,
                    'importance' => 0.0,
                    'level' => 0.0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            if ($scaleId === 'IM') {
                $batch[$key]['importance'] = $value;
            } else {
                $batch[$key]['level'] = $value;
            }

            if (count($batch) >= 500) {
                DB::table('occupation_onet_skills')->upsert(
                    array_values($batch),
                    ['occupation_id', 'onet_skill_id'],
                    ['importance', 'level', 'updated_at']
                );
                $count += count($batch);
                $batch = [];
                $this->info("Processed {$count} skill records...");
            }
        }

        if (!empty($batch)) {
            DB::table('occupation_onet_skills')->upsert(
                array_values($batch),
                ['occupation_id', 'onet_skill_id'],
                ['importance', 'level', 'updated_at']
            );
            $count += count($batch);
        }

        fclose($handle);
        $this->info("Total skill records imported: {$count}");
    }

    private function importKnowledge()
    {
        $filePath = "{$this->basePath}/Knowledge.txt";
        if (!File::exists($filePath)) {
            $this->warn("Knowledge.txt not found.");
            return;
        }

        $this->info("Importing Knowledge...");
        $handle = fopen($filePath, "r");
        fgets($handle);

        $batch = [];
        $count = 0;

        while (($line = fgets($handle)) !== false) {
            $parts = explode("\t", trim($line));
            if (count($parts) < 5) continue;

            $socCode = $parts[0];
            $elementId = $parts[1];
            $name = $parts[2];
            $scaleId = $parts[3];
            $value = floatval($parts[4]);

            $key = "{$socCode}_{$elementId}";
            if (!isset($batch[$key])) {
                $batch[$key] = [
                    'soc_code' => $socCode,
                    'element_id' => $elementId,
                    'importance' => 0.0,
                    'level' => 0.0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            if ($scaleId === 'IM') {
                $batch[$key]['importance'] = $value;
            } else {
                $batch[$key]['level'] = $value;
            }

            if (count($batch) >= 500) {
                DB::table('onet_occupation_knowledge')->upsert(
                    array_values($batch),
                    ['soc_code', 'element_id'], // Assuming unique constraint exists here
                    ['importance', 'level', 'updated_at']
                );
                $count += count($batch);
                $batch = [];
                $this->info("Processed {$count} knowledge records...");
            }
        }

        if (!empty($batch)) {
            DB::table('onet_occupation_knowledge')->upsert(
                array_values($batch),
                ['soc_code', 'element_id'],
                ['importance', 'level', 'updated_at']
            );
            $count += count($batch);
        }

        fclose($handle);
        $this->info("Total knowledge records imported: {$count}");
    }
}
