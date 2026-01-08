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
            $search = $request->query('search');
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
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
            ->with(['skills', 'occupations', 'specializations.skills', 'specializations.occupations'])
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
        $favorites = Auth::user()->savedMajors()->with(['skills', 'occupations'])->get();
        
        return response()->json([
            'favorites' => $favorites
        ]);
    }
}
