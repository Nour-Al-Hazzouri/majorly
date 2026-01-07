<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PasswordResetController;
use App\Http\Controllers\Api\SkillController;
use App\Http\Controllers\Api\AssessmentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public Authentication Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink']);
Route::post('/reset-password', [PasswordResetController::class, 'reset']);

// Skills Search
Route::get('/skills', [SkillController::class, 'index']);

// Assessment Flow (Public/Guest access supported in controller)
Route::get('/assessments/questions', [AssessmentController::class, 'questions']);
Route::post('/assessments', [AssessmentController::class, 'store']);
Route::patch('/assessments/{assessment}', [AssessmentController::class, 'update']);
Route::post('/assessments/{assessment}/submit', [AssessmentController::class, 'submit']);

// Major Details
Route::get('/majors', [\App\Http\Controllers\Api\MajorController::class, 'index']);
Route::get('/majors/{slug}', [\App\Http\Controllers\Api\MajorController::class, 'show']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/assessments', [AssessmentController::class, 'index']);
    Route::get('/assessments/{assessment}', [AssessmentController::class, 'show']);
    
    // User Profile Routes
    Route::get('/profile', [\App\Http\Controllers\Api\UserController::class, 'show']);
    Route::patch('/profile', [\App\Http\Controllers\Api\UserController::class, 'update']);
    
    // Major Interaction Routes
    Route::post('/majors/{major}/favorite', [\App\Http\Controllers\Api\MajorController::class, 'toggleFavorite']);
    Route::get('/majors/favorites', [\App\Http\Controllers\Api\MajorController::class, 'favorites']);
});

