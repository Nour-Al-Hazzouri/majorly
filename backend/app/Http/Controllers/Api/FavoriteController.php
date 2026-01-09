<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function toggle(Request $request)
    {
        $request->validate([
            'type' => 'required|in:major,specialization,occupation',
            'id' => 'required|integer',
        ]);

        $user = $request->user();
        $type = $request->input('type');
        $id = $request->input('id');

        switch ($type) {
            case 'major':
                $user->savedMajors()->toggle($id);
                $isFavorited = $user->savedMajors()->where('major_id', $id)->exists();
                break;
            case 'specialization':
                $user->savedSpecializations()->toggle($id);
                $isFavorited = $user->savedSpecializations()->where('specialization_id', $id)->exists();
                break;
            case 'occupation':
                $user->savedOccupations()->toggle($id);
                $isFavorited = $user->savedOccupations()->where('occupation_id', $id)->exists();
                break;
        }

        return response()->json([
            'favorited' => $isFavorited,
            'message' => $isFavorited ? 'Added to favorites' : 'Removed from favorites'
        ]);
    }

    public function status(Request $request)
    {
        $request->validate([
            'type' => 'required|in:major,specialization,occupation',
            'id' => 'required|integer',
        ]);

        $user = $request->user();
        $type = $request->input('type');
        $id = $request->input('id');
        $isFavorited = false;

        switch ($type) {
            case 'major':
                $isFavorited = $user->savedMajors()->where('major_id', $id)->exists();
                break;
            case 'specialization':
                $isFavorited = $user->savedSpecializations()->where('specialization_id', $id)->exists();
                break;
            case 'occupation':
                $isFavorited = $user->savedOccupations()->where('occupation_id', $id)->exists();
                break;
        }

        return response()->json(['favorited' => $isFavorited]);
    }
}
