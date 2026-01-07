<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Assessment;
use App\Models\AssessmentResponse;
use App\Models\Major;
use App\Services\QuestionService;
use App\Services\MatchingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AssessmentController extends Controller
{
    protected $questionService;
    protected $matchingService;

    public function __construct(QuestionService $questionService, MatchingService $matchingService)
    {
        $this->questionService = $questionService;
        $this->matchingService = $matchingService;
    }

    /**
     * Display a listing of the assessments for the authenticated user.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $assessments = Auth::user()->assessments()->latest()->get();
        return response()->json($assessments);
    }

    /**
     * Get the assessment questions.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function questions(Request $request)
    {
        $majorId = $request->query('major_id');

        if ($majorId) {
            $major = Major::find($majorId);
            if (!$major) {
                return response()->json(['message' => 'Major not found'], 404);
            }
            return response()->json($this->questionService->getDeepDiveQuestions($major));
        }

        return response()->json($this->questionService->getTier1Questions());
    }

    /**
     * Start a new assessment.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $user = Auth::guard('sanctum')->user();

        $assessment = Assessment::create([
            'user_id' => $user ? $user->id : null,
            'type' => $request->input('type', 'tier1'),
            'status' => 'started',
            'metadata' => $request->input('metadata', []),
        ]);

        return response()->json($assessment, 201);
    }

    /**
     * Update/Save partial responses for an assessment.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Assessment  $assessment
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Assessment $assessment)
    {
        // For guest assessments, we don't check user_id
        if ($assessment->user_id && $assessment->user_id !== Auth::guard('sanctum')->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $responses = $request->input('responses', []);

        foreach ($responses as $questionId => $value) {
            AssessmentResponse::updateOrCreate(
                ['assessment_id' => $assessment->id, 'question_id' => $questionId],
                ['response_value' => $value]
            );
        }

        return response()->json(['message' => 'Responses saved successfully']);
    }

    /**
     * Submit assessment and finalize it.
     *
     * @param  \App\Models\Assessment  $assessment
     * @return \Illuminate\Http\JsonResponse
     */
    public function submit(Assessment $assessment)
    {
        if ($assessment->user_id && $assessment->user_id !== Auth::guard('sanctum')->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $assessment->update(['status' => 'completed']);

        if ($assessment->type === 'deep_dive') {
            $majorId = $assessment->metadata['major_id'] ?? null;
            if (!$majorId) {
                return response()->json(['message' => 'Major ID missing in assessment metadata'], 400);
            }
            
            $major = Major::find($majorId);
            if (!$major) {
                return response()->json(['message' => 'Major not found'], 404);
            }

            $recommendations = $this->matchingService->generateSpecializationRecommendations($assessment, $major);
            
            return response()->json([
                'message' => 'Deep dive assessment submitted successfully.',
                'assessment' => $assessment,
                'recommendations' => $recommendations
            ]);
        }

        $recommendations = $this->matchingService->generateRecommendations($assessment);
        
        return response()->json([
            'message' => 'Assessment submitted successfully. Results processed.',
            'assessment' => $assessment->load('results.major'),
            'recommendations' => $recommendations
        ]);
    }
}
