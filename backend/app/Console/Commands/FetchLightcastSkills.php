<?php

namespace App\Console\Commands;

use App\Models\Skill;
use App\Services\LightcastService;
use Illuminate\Console\Command;

class FetchLightcastSkills extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'majorly:fetch-skills';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch and seed skills from Lightcast Service';

    /**
     * Execute the console command.
     */
    public function handle(LightcastService $service)
    {
        $this->info('Fetching skills from Lightcast Service...');

        $skills = $service->fetchSkills();
        $this->output->progressStart(count($skills));

        foreach ($skills as $skillData) {
            Skill::updateOrCreate(
                ['lightcast_id' => $skillData['lightcast_id']],
                [
                    'name' => $skillData['name'],
                    'category' => $skillData['category']
                ]
            );
            $this->output->progressAdvance();
        }

        $this->output->progressFinish();
        $this->info('Skills seeded successfully!');
    }
}
