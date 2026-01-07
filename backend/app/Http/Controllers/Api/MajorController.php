<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Major;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MajorController extends Controller
{
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
