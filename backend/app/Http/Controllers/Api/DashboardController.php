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

        // Primary Match: Highest affinity across ALL assessments
        $bestToDate = \App\Models\AssessmentResult::whereHas('assessment', function($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->orderBy('match_percentage', 'desc')
            ->with(['major', 'specialization'])
            ->first();

        $primaryMatch = null;
        if ($bestToDate) {
            $primaryMatch = [
                'type' => $bestToDate->specialization ? 'specialization' : 'major',
                'name' => $bestToDate->specialization ? $bestToDate->specialization->name : ($bestToDate->major->name ?? 'Unknown'),
                'affinity' => round($bestToDate->match_percentage),
                'id' => $bestToDate->specialization_id ?? $bestToDate->major_id,
            ];
            // Format nice display name if possible, e.g. Major name
            if ($bestToDate->major) {
                $primaryMatch['major_name'] = $bestToDate->major->name;
            }
        }

        // Assessment History
        $history = $user->assessments()
            ->latest()
            ->with(['results' => function($q) {
                $q->orderBy('match_percentage', 'desc');
            }, 'results.major'])
            ->get()
            ->map(function ($assessment) {
                $topResult = $assessment->results->first();
                return [
                    'id' => $assessment->id,
                    'type' => ucfirst($assessment->type ?? 'General'),
                    'date' => $assessment->created_at->format('M d, Y'),
                    'top_match' => $topResult ? ($topResult->major->name ?? 'Unknown') : 'Incomplete',
                    'score' => $topResult ? round($topResult->match_percentage) : 0,
                    'status' => $assessment->status ?? 'completed',
                ];
            });

        return response()->json([
            'stats' => $stats,
            'primary_match' => $primaryMatch,
            'history' => $history,
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
            ]
        ]);
    }
}
