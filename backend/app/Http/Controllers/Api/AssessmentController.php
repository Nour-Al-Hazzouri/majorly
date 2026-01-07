<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Assessment;
use App\Models\AssessmentResponse;
use App\Services\QuestionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AssessmentController extends Controller
{
    protected $questionService;

    public function __construct(QuestionService $questionService)
    {
        $this->questionService = $questionService;
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
     * Get the Tier 1 assessment questions.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function questions()
    {
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

        // TODO: Trigger matching algorithm (Tier 1 results calculation)
        
        return response()->json([
            'message' => 'Assessment submitted successfully. Results are being processed.',
            'assessment' => $assessment
        ]);
    }
}
