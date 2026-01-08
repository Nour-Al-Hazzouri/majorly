<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Models\Major;
use App\Models\Occupation;
use App\Models\Skill;
use App\Models\Specialization;

class ImportOpenData extends Command
{
    protected $signature = 'majorly:import-open-data';
    protected $description = 'Parse O*NET and CIP files and populate database';

    public function handle()
    {
        $path = storage_path('app/opendata');
        $onetPath = $path . '/onet/db_29_1_text';
        
        $this->info("Importing O*NET 29.1 Data...");

        DB::beginTransaction();
        try {
            // 1. O*NET Occupations
            $this->importOnetOccupations($onetPath);
            
            // 2. O*NET Skills & Knowledge
            $this->importOnetSkills($onetPath);
            
            // 3. Link Skills to Occupations
            $this->linkOnetSkills($onetPath);

            // 4. Transform O*NET occupations to App Majors and Occupations
            // Since CIP crosswalk is unavailable, we'll use SOC Major Groups as "Majors"
            $this->transformToAppData();

            DB::commit();
            $this->info("Success! 'Truth' data imported.");
        } catch (\Exception $e) {
            DB::rollBack();
            $this->error("Error: " . $e->getMessage());
            $this->error($e->getTraceAsString());
        }
    }

    private function importOnetOccupations($path)
    {
        $file = $path . '/Occupation Data.txt';
        if (!file_exists($file)) throw new \Exception("File not found: $file");

        $this->info("Parsing Occupation Data...");
        // O*NET text files are tab delimited
        $lines = file($file, FILE_IGNORE_NEW_LINES);
        // Header: O*NET-SOC Code, Title, Description
        
        $insertData = [];
        foreach ($lines as $index => $line) {
            if ($index == 0) continue; // Skip header
            $parts = explode("\t", $line);
            if (count($parts) < 3) continue;

            $insertData[] = [
                'soc_code' => $parts[0],
                'title' => $parts[1],
                'description' => $parts[2],
            ];

            if (count($insertData) >= 500) {
                DB::table('onet_occupations')->insert($insertData);
                $insertData = [];
            }
        }
        if (!empty($insertData)) DB::table('onet_occupations')->insert($insertData);
    }

    private function importOnetSkills($path)
    {
        // Import both Knowledge.txt and Skills.txt
        $files = ['Knowledge.txt' => 'Knowledge', 'Skills.txt' => 'Skill'];
        
        foreach ($files as $filename => $type) {
            $file = $path . '/' . $filename;
            if (!file_exists($file)) continue;

            $this->info("Parsing $filename...");
            $lines = file($file, FILE_IGNORE_NEW_LINES);
            
            $uniqueElements = []; // avoid duplicates if any
            
            foreach ($lines as $index => $line) {
                if ($index == 0) continue;
                $parts = explode("\t", $line);
                // Schema: O*NET-SOC Code, Element ID, Element Name, Description, ...
                // We just need the definitions first
                
                $id = $parts[1];
                $name = $parts[2];
                $desc = $parts[3];
                
                if (!isset($uniqueElements[$id])) {
                    $uniqueElements[$id] = [
                        'element_id' => $id,
                        'name' => $name,
                        'description' => $desc,
                        'type' => $type
                    ];
                }
            }
            
            // Chunk insert
            $chunks = array_chunk(array_values($uniqueElements), 500);
            foreach ($chunks as $chunk) {
                DB::table('onet_knowledge')->insert($chunk);
            }
        }
    }

    private function linkOnetSkills($path)
    {
         // Import both Knowledge.txt and Skills.txt linking
        $files = ['Knowledge.txt', 'Skills.txt'];
        
        foreach ($files as $filename) {
            $file = $path . '/' . $filename;
            if (!file_exists($file)) continue;
            
            $this->info("Linking $filename...");
            $lines = file($file, FILE_IGNORE_NEW_LINES);
            
            $insertData = [];
            foreach ($lines as $index => $line) {
                if ($index == 0) continue;
                $parts = explode("\t", $line);
                
                // We only care about "Importance" scale for now to filter main skills
                // Schema: O*NET-SOC Code[0], Element ID[1], Element Name[2], Scale ID[3], Data Value[4]
                if (count($parts) < 5) continue;
                if ($parts[3] != 'IM') continue; 
                
                $insertData[] = [
                    'soc_code' => $parts[0],
                    'element_id' => $parts[1],
                    'importance' => $parts[4],
                    'level' => 0 // Placeholder, we can fetch LV later if needed
                ];

                if (count($insertData) >= 1000) {
                    DB::table('onet_occupation_knowledge')->insert($insertData);
                    $insertData = [];
                }
            }
            if (!empty($insertData)) DB::table('onet_occupation_knowledge')->insert($insertData);
        }
    }

    private function importCrosswalk($path)
    {
        $file = $path . '/CIP2020_SOC2018_Crosswalk.csv';
        if (!file_exists($file)) throw new \Exception("Crosswalk not found");
        
        $this->info("Parsing Crosswalk...");
        // Ensure we remove BOM if present
        $content = file_get_contents($file);
        $content = preg_replace('/^\xEF\xBB\xBF/', '', $content); 
        $lines = explode("\n", $content);
        
        $insertData = [];
        foreach ($lines as $index => $line) {
            if ($index == 0) continue;
            $data = str_getcsv($line);
            if (count($data) < 4) continue;
            
            // CSV: CIP2020Code, CIP2020Title, SOC2018Code, SOC2018Title
            // Sometimes quotes cause issues, str_getcsv handles it
            
            $insertData[] = [
                'cip_code' => trim($data[0], '="'), // Often valid CSVs wrap IDs in ="..." for Excel
                'cip_title' => $data[1],
                'soc_code' => trim($data[2], '="'),
                'soc_title' => $data[3],
            ];
            
            if (count($insertData) >= 500) {
                DB::table('cip_soc_crosswalk')->insert($insertData);
                $insertData = [];
            }
        }
        if (!empty($insertData)) DB::table('cip_soc_crosswalk')->insert($insertData);
    }
    
    private function transformToAppData()
    {
        $this->info("Transforming Staging to Application Tables...");
        
        // SOC Major Groups (First 2 digits) mapped to human-readable names
        $socMajorGroups = [
            '11' => 'Management',
            '13' => 'Business and Financial Operations',
            '15' => 'Computer and Mathematical',
            '17' => 'Architecture and Engineering',
            '19' => 'Life, Physical, and Social Science',
            '21' => 'Community and Social Service',
            '23' => 'Legal',
            '25' => 'Educational Instruction and Library',
            '27' => 'Arts, Design, Entertainment, Sports, and Media',
            '29' => 'Healthcare Practitioners and Technical',
            '31' => 'Healthcare Support',
            '33' => 'Protective Service',
            '35' => 'Food Preparation and Serving Related',
            '37' => 'Building and Grounds Cleaning and Maintenance',
            '39' => 'Personal Care and Service',
            '41' => 'Sales and Related',
            '43' => 'Office and Administrative Support',
            '45' => 'Farming, Fishing, and Forestry',
            '47' => 'Construction and Extraction',
            '49' => 'Installation, Maintenance, and Repair',
            '51' => 'Production',
            '53' => 'Transportation and Material Moving',
            '55' => 'Military Specific',
        ];
        
        // 1. Create Majors from SOC Major Groups
        foreach ($socMajorGroups as $code => $name) {
            $slug = \Illuminate\Support\Str::slug($name);
            
            $major = Major::updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $name,
                    'cip_code' => $code, // Store SOC prefix as cip_code
                    'description' => "Occupations in the $name field.",
                    'category' => $this->categorizeByCode($code)
                ]
            );
            
            // 2. Find all occupations in this SOC group
            $occupations = DB::table('onet_occupations')
                ->where('soc_code', 'like', $code . '-%')
                ->get();
            
            $this->output->progressStart($occupations->count());
            
            foreach ($occupations as $onet) {
                $occupation = Occupation::updateOrCreate(
                    ['soc_code' => $onet->soc_code],
                    [
                        'name' => $onet->title,
                        'description' => $onet->description,
                        'median_salary' => $this->estimateSalary($onet->soc_code),
                        'code' => $onet->soc_code
                    ]
                );
                
                // Link Major -> Occupation
                $major->occupations()->syncWithoutDetaching([$occupation->id]);
                
                // 3. Link Skills for this Occupation (top 8 by importance)
                $topSkills = DB::table('onet_occupation_knowledge')
                    ->where('soc_code', $onet->soc_code)
                    ->orderByDesc('importance')
                    ->limit(8)
                    ->get();
                    
                foreach ($topSkills as $s) {
                    $def = DB::table('onet_knowledge')->where('element_id', $s->element_id)->first();
                    if (!$def) continue;
                    
                    $category = ($def->type == 'Knowledge') ? 'Technical Skill' : 'Soft Skill';
                    
                    $skill = Skill::firstOrCreate(
                        ['name' => $def->name],
                        ['category' => $category]
                    );
                    
                    // Attach to Major ONLY if importance >= 3.5 (high importance)
                    // This filters out niche skills like Biology in Computer major
                    // while keeping them available for specific occupations like Bioinformatics
                    if ($s->importance >= 3.5) {
                        $major->skills()->syncWithoutDetaching([$skill->id]);
                    }
                }
                $this->output->progressAdvance();
            }
            $this->output->progressFinish();
            $this->info("Created Major: $name with {$occupations->count()} occupations");
        }
    }

    private function categorizeByCode($code)
    {
        $categories = [
            '11' => 'Business', '13' => 'Business', '41' => 'Business', '43' => 'Business',
            '15' => 'STEM', '17' => 'STEM', '19' => 'STEM',
            '21' => 'Social Sciences', '23' => 'Social Sciences', '25' => 'Education',
            '27' => 'Arts & Humanities', '39' => 'Arts & Humanities',
            '29' => 'Health Sciences', '31' => 'Health Sciences',
            '33' => 'Public Service', '55' => 'Public Service',
            '35' => 'Service Industry', '37' => 'Service Industry',
            '45' => 'Agriculture', '47' => 'Trades', '49' => 'Trades', '51' => 'Trades', '53' => 'Trades',
        ];
        return $categories[$code] ?? 'General';
    }

    private function estimateSalary($socCode)
    {
        // Rough salary estimates based on SOC major group
        $prefix = substr($socCode, 0, 2);
        $salaries = [
            '11' => [90000, 180000], '13' => [55000, 95000], '15' => [70000, 130000],
            '17' => [65000, 110000], '19' => [50000, 90000], '21' => [40000, 60000],
            '23' => [70000, 150000], '25' => [45000, 75000], '27' => [40000, 80000],
            '29' => [55000, 120000], '31' => [28000, 45000], '33' => [40000, 75000],
            '35' => [25000, 40000], '37' => [28000, 45000], '39' => [28000, 50000],
            '41' => [35000, 80000], '43' => [32000, 55000], '45' => [28000, 45000],
            '47' => [40000, 70000], '49' => [45000, 75000], '51' => [35000, 60000],
            '53' => [35000, 60000], '55' => [40000, 80000],
        ];
        $range = $salaries[$prefix] ?? [40000, 70000];
        return rand($range[0], $range[1]);
    }
}
