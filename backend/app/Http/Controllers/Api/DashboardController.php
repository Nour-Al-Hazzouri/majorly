<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Stats
        $stats = [
            'assessments_completed' => $user->assessments()->count(),
            'majors_favorited' => $user->savedMajors()->count(),
            'specializations_favorited' => $user->savedSpecializations()->count(),
            'occupations_favorited' => $user->savedOccupations()->count(),
        ];

        // Primary Match
        // Assuming "Primary Match" is the highest ranked result from the most recent completed assessment
        $latestAssessment = $user->assessments()
            ->latest()
            ->with(['results' => function ($query) {
                $query->orderBy('match_percentage', 'desc');
            }])
            ->first();

        $primaryMatch = null;
        if ($latestAssessment && $latestAssessment->results->isNotEmpty()) {
            $topResult = $latestAssessment->results->first();
            $primaryMatch = [
                'type' => 'major', // Or determine if it's specialization/career based on result type
                'name' => $topResult->major->name ?? 'Unknown',
                'affinity' => $topResult->match_percentage,
                'id' => $topResult->major_id,
            ];
            
            // If result has specialization, prioritize showing that as it's more specific
            if ($topResult->specialization) {
                 $primaryMatch = [
                    'type' => 'specialization',
                    'name' => $topResult->specialization->name,
                    'affinity' => $topResult->match_percentage,
                    'id' => $topResult->specialization_id,
                 ];
            }
        }

        return response()->json([
            'stats' => $stats,
            'primary_match' => $primaryMatch,
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
            ]
        ]);
    }
}
