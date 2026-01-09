<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Get the authenticated user's profile with assessment history and saved majors.
     */
    public function show(Request $request)
    {
        $user = $request->user();

        // Load assessments with top 3 results per assessment, and all saved items
        $user->load([
            'assessments' => function ($query) {
                $query->orderBy('created_at', 'desc');
            },
            'assessments.results' => function ($query) {
                $query->with(['major', 'specialization'])->orderBy('rank', 'asc')->limit(3);
            },
            'savedMajors',
            'savedSpecializations',
            'savedOccupations',
        ]);

        return response()->json([
            'user' => $user,
        ]);
    }

    /**
     * Update the authenticated user's profile.
     */
    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'regex:/^[\p{L}\p{M}\s.\'-]+$/u'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user,
        ]);
    }
}
