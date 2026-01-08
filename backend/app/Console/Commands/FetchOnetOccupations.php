<?php

namespace App\Console\Commands;

use App\Models\Occupation;
use App\Services\OnetService;
use Illuminate\Console\Command;

class FetchOnetOccupations extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'majorly:fetch-occupations';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch and seed occupations from O*NET Service';

    /**
     * Execute the console command.
     */
    public function handle(OnetService $service)
    {
        $this->info('Fetching occupations from O*NET Service...');

        $occupations = $service->fetchOccupations();
        $this->output->progressStart(count($occupations));

        foreach ($occupations as $data) {
            Occupation::updateOrCreate(
                ['code' => $data['code']],
                [
                    'name' => $data['name'],
                    // Use description if available, otherwise name
                    'description' => $data['description'] ?: $data['name'],
                    'median_salary' => $data['median_salary'] ?? 0,
                    'job_outlook' => $data['job_outlook'] ?? 'Average'
                ]
            );
            $this->output->progressAdvance();
        }

        $this->output->progressFinish();
        $this->info('Occupations seeded successfully!');
    }
}
