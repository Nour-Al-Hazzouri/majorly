<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssessmentResult extends Model
{
    protected $fillable = ['assessment_id', 'major_id', 'match_percentage', 'reasoning', 'rank'];

    protected $casts = [
        'reasoning' => 'array',
        'match_percentage' => 'decimal:2',
    ];

    public function assessment()
    {
        return $this->belongsTo(Assessment::class);
    }

    public function major()
    {
        return $this->belongsTo(Major::class);
    }
}
