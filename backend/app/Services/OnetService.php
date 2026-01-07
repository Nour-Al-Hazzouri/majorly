<?php

namespace App\Services;

class OnetService
{
    /**
     * Fetch occupations from O*NET API (Mock for now).
     *
     * @return array
     */
    public function fetchOccupations(): array
    {
        // Mock data to simulate API response
        return [
            [
                'code' => '15-1252.00',
                'name' => 'Software Developers',
                'description' => 'Research, design, and develop computer and network software or specialized utility programs.',
                'median_salary' => 127260.00,
                'job_outlook' => 'Bright Outlook'
            ],
            [
                'code' => '15-1211.00',
                'name' => 'Computer Systems Analysts',
                'description' => 'Analyze science, engineering, business, and other data processing problems to develop and implement solutions.',
                'median_salary' => 102240.00,
                'job_outlook' => 'Average'
            ],
            [
                'code' => '29-1141.00',
                'name' => 'Registered Nurses',
                'description' => 'Assess patient health problems and needs, develop and implement nursing care plans, and maintain medical records.',
                'median_salary' => 81220.00,
                'job_outlook' => 'Bright Outlook'
            ],
            [
                'code' => '13-2011.00',
                'name' => 'Accountants and Auditors',
                'description' => 'Examine, analyze, and interpret accounting records to prepare financial statements.',
                'median_salary' => 78000.00,
                'job_outlook' => 'Average'
            ],
            [
                'code' => '27-1024.00',
                'name' => 'Graphic Designers',
                'description' => 'Design or create graphics to meet specific commercial or promotional needs.',
                'median_salary' => 57990.00,
                'job_outlook' => 'Average'
            ],
            [
                'code' => '25-2021.00',
                'name' => 'Elementary School Teachers',
                'description' => 'Teach students basic academic, social, and other formative skills.',
                'median_salary' => 61690.00,
                'job_outlook' => 'Average'
            ],
            [
                'code' => '11-9111.00',
                'name' => 'Medical and Health Services Managers',
                'description' => 'Plan, direct, or coordinate medical and health services.',
                'median_salary' => 104830.00,
                'job_outlook' => 'Bright Outlook'
            ],
            [
                'code' => '15-2031.00',
                'name' => 'Operations Research Analysts',
                'description' => 'Formulate and apply mathematical modeling and other optimizing methods to develop and interpret information.',
                'median_salary' => 86200.00,
                'job_outlook' => 'Bright Outlook'
            ],
        ];
    }
}
