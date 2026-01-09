<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    /**
     * Display a listing of the skills with search and filtering.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $query = Skill::query();

        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $driver = $query->getConnection()->getDriverName();
            if ($driver === 'pgsql') {
                $query->where('name', 'ilike', "%{$searchTerm}%");
            } else {
                // SQLite is case-insensitive by default for LIKE on ASCII
                $query->where('name', 'like', "%{$searchTerm}%");
            }
        }

        if ($request->has('category')) {
            $query->where('category', $request->input('category'));
        }

        $skills = $query->paginate($request->input('per_page', 20));

        return response()->json($skills);
    }
}
