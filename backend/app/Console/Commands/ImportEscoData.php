<?php
 
 namespace App\Console\Commands;
 
 use App\Models\Occupation;
 use App\Models\Skill;
 use App\Services\EscoService;
 use Illuminate\Console\Command;
 
 class ImportEscoData extends Command
 {
     /**
      * The name and signature of the console command.
      *
      * @var string
      */
     protected $signature = 'majorly:import-esco {--limit=500}';
 
     /**
      * The console command description.
      *
      * @var string
      */
     protected $description = 'Import large dataset of skills and occupations from ESCO API';
 
     /**
      * Execute the console command.
      */
     public function handle(EscoService $service)
    {
        $limit = (int) $this->option('limit');
        $batchSize = 100;
        $alphabet = range('a', 'z');
        
        $this->info("Starting ESCO Diversified Import...");
        $batchSize = 100;

        // Keywords to ensure coverage for common majors
        $keywords = ['software', 'engineer', 'nurse', 'doctor', 'manager', 'analyst', 'designer', 'teacher', 'psychologist', 'security', 'marketing', 'artist', 'scientist'];

        // --- Occupations ---
        $this->info('Importing Occupations (Targeted + Alphabet)...');
        $count = 0;
        $this->output->progressStart($limit);

        // Targeted Pass
        foreach ($keywords as $kw) {
            $occupations = $service->fetchOccupations($batchSize, 0, $kw);
            foreach ($occupations as $data) {
                // Estimate salary
                $estimatedSalary = $this->estimateSalary($data['name']);

                Occupation::updateOrCreate(['code' => $data['code']], [
                    'name' => $data['name'],
                    'description' => $data['description'] ?: $data['name'],
                    'median_salary' => $estimatedSalary,
                    'job_outlook' => $this->estimateOutlook($data['name'])
                ]);
                $count++;
                $this->output->progressAdvance();
            }
        }

        // Alphabet Pass (Limited per letter)
        foreach ($alphabet as $letter) {
            $occupations = $service->fetchOccupations(50, 0, $letter);
                foreach ($occupations as $data) {
                    // Estimate salary based on keywords since ESCO doesn't provide it
                    $estimatedSalary = $this->estimateSalary($data['name']);
                    
                    Occupation::updateOrCreate(
                        ['code' => $data['code']],
                        [
                            'name' => $data['name'],
                            'description' => $data['description'] ?: $data['name'],
                            'median_salary' => $estimatedSalary,
                            'job_outlook' => $this->estimateOutlook($data['name'])
                        ]
                    );
                    $count++;
                    $this->output->progressAdvance();
                    if ($count >= $limit + 1000) break; // Extra buffer
                }
        }
        $this->output->progressFinish();
        $this->info("Occupations updated.");

        // --- Skills ---
        $this->info('Importing Diversified Skills...');
        $count = 0;
        $this->output->progressStart($limit);

        foreach ($keywords as $kw) {
            $skills = $service->fetchSkills($batchSize, 0, $kw);
            foreach ($skills as $data) {
                Skill::updateOrCreate(['lightcast_id' => $data['lightcast_id']], [
                    'name' => $data['name'],
                    'category' => $data['category']
                ]);
                $count++;
                $this->output->progressAdvance();
            }
        }
        $this->output->progressFinish();
        $this->info("Skills updated.");

        $this->info('ESCO Diversified Import completed!');
    }

    private function estimateSalary(string $title): int
    {
        $title = strtolower($title);
        $base = 45000;
        
        if (str_contains($title, 'manager') || str_contains($title, 'director')) $base += 40000;
        if (str_contains($title, 'senior') || str_contains($title, 'lead')) $base += 20000;
        if (str_contains($title, 'engineer') || str_contains($title, 'architect') || str_contains($title, 'developer')) $base += 25000;
        if (str_contains($title, 'analyst') || str_contains($title, 'consultant')) $base += 15000;
        if (str_contains($title, 'technician') || str_contains($title, 'assistant')) $base -= 5000;
        if (str_contains($title, 'doctor') || str_contains($title, 'surgeon')) $base += 80000;
        
        // Add some noise
        return $base + rand(-5000, 5000);
    }

    private function estimateOutlook(string $title): string
    {
        $title = strtolower($title);
        if (str_contains($title, 'software') || str_contains($title, 'security') || str_contains($title, 'data') || str_contains($title, 'health')) {
            return 'Bright Outlook';
        }
        return 'Average';
    }
}
