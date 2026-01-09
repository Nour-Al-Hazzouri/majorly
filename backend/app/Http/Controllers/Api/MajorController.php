<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Major;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MajorController extends Controller
{
    /**
     * Display a listing of the majors.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request)
    {
        $query = Major::query();

        // Search filtering
        if ($request->has('search')) {
            $search = strtolower($request->query('search'));
            $query->where(function($q) use ($search) {
                $q->whereRaw('LOWER(name) LIKE ?', ["%{$search}%"])
                  ->orWhereRaw('LOWER(description) LIKE ?', ["%{$search}%"]);
            });
        }

        // Category filtering
        if ($request->has('category')) {
            $query->where('category', $request->query('category'));
        }

        // Pagination
        $majors = $query->paginate($request->query('per_page', 12));

        return response()->json($majors);
    }

    /**
     * Display the specified major.
     *
     * @param string $slug
     * @return JsonResponse
     */
    public function show(string $slug)
    {
        $major = Major::where('slug', $slug)
            ->with([
                'skills' => function($q) {
                    $q->distinct()->limit(20);
                },
                'occupations' => function($q) {
                    $q->select('occupations.id', 'occupations.name', 'occupations.code', 'occupations.soc_code', 'occupations.description', 'occupations.median_salary', 'occupations.job_outlook', 'occupations.tasks');
                },
                'occupations.techSkills' => function($q) {
                    $q->select('id', 'soc_code', 'skill_name', 'hot_tech')->limit(15);
                },
                'occupations.onetKnowledge' => function($q) {
                    $q->select('onet_knowledge.id', 'onet_knowledge.name', 'onet_knowledge.type')
                      ->withPivot('importance', 'level')
                      ->orderBy('importance', 'desc');
                },
                'specializations.skills',
                'specializations.occupations' => function($q) {
                    $q->select('occupations.id', 'occupations.name', 'occupations.code', 'occupations.soc_code', 'occupations.description', 'occupations.median_salary', 'occupations.job_outlook', 'occupations.tasks');
                },
                'specializations.occupations.techSkills' => function($q) {
                    $q->select('id', 'soc_code', 'skill_name', 'hot_tech')->limit(15);
                },
                'specializations.occupations.onetKnowledge' => function($q) {
                    $q->select('onet_knowledge.id', 'onet_knowledge.name', 'onet_knowledge.type')
                      ->withPivot('importance', 'level')
                      ->orderBy('importance', 'desc');
                }
            ])
            ->firstOrFail();

        return response()->json($major);
    }

    /**
     * Toggle the favorite status of a major for the authenticated user.
     *
     * @param Major $major
     * @return \Illuminate\Http\JsonResponse
     */
    public function toggleFavorite(Major $major)
    {
        $user = Auth::user();
        
        $status = $user->savedMajors()->toggle($major->id);
        
        $attached = count($status['attached']) > 0;
        
        return response()->json([
            'message' => $attached ? 'Major saved to favorites.' : 'Major removed from favorites.',
            'is_favorite' => $attached
        ]);
    }

    /**
     * List all majors favorited by the user.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function favorites()
    {
        $favorites = Auth::user()->savedMajors()->with(['skills' => function($q) {
            $q->limit(20);
        }, 'occupations'])->get();
        
        return response()->json([
            'favorites' => $favorites
        ]);
    }

    /**
     * Get paginated skills for a major.
     *
     * @param Major $major
     * @param Request $request
     * @return JsonResponse
     */
    public function skills(Major $major, Request $request)
    {
        $skills = $major->skills()->distinct()->paginate($request->query('per_page', 10));
        return response()->json($skills);
    }
}
