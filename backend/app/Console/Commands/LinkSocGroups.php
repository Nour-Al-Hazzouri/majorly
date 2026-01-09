<?php

namespace App\Console\Commands;

use App\Models\Major;
use App\Models\Occupation;
use Illuminate\Console\Command;

class LinkSocGroups extends Command
{
    protected $signature = 'majorly:link-soc-groups';
    protected $description = 'Link majors to occupations based on 2-digit SOC prefixes';

    private array $mappings = [
        'Management' => '11',
        'Business and Financial Operations' => '13',
        'Computer and Mathematical' => '15',
        'Architecture and Engineering' => '17',
        'Life, Physical, and Social Science' => '19',
        'Community and Social Service' => '21',
        'Legal' => '23',
        'Educational Instruction and Library' => '25',
        'Arts, Design, Entertainment, Sports, and Media' => '27',
        'Healthcare Practitioners and Technical' => '29',
        'Healthcare Support' => '31',
        'Protective Service' => '33',
        'Food Preparation and Serving Related' => '35',
        'Building and Grounds Cleaning and Maintenance' => '37',
        'Personal Care and Service' => '39',
        'Sales and Related' => '41',
        'Office and Administrative Support' => '43',
        'Farming, Fishing, and Forestry' => '45',
        'Construction and Extraction' => '47',
        'Installation, Maintenance, and Repair' => '49',
        'Production' => '51',
        'Transportation and Material Moving' => '53',
        'Military Specific' => '55',
    ];

    public function handle()
    {
        $this->info('Linking majors to occupations by SOC prefixes...');

        foreach ($this->mappings as $majorName => $prefix) {
            $major = Major::where('name', $majorName)->first();
            if (!$major) {
                $this->warn("Major not found: {$majorName}");
                continue;
            }

            $occupations = Occupation::where('soc_code', 'like', "{$prefix}-%")->get();
            $major->occupations()->sync($occupations->pluck('id'));

            $this->info("Linked " . $occupations->count() . " occupations to {$majorName}");
        }

        $this->info('Done!');
    }
}
