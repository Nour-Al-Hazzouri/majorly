<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Specialization extends Model
{
    use HasFactory;

    protected $fillable = ['major_id', 'name', 'slug', 'description', 'ideal_interests', 'ideal_strengths'];

    protected $hidden = ['major'];

    protected $casts = [
        'ideal_interests' => 'array',
        'ideal_strengths' => 'array',
    ];

    public function major()
    {
        return $this->belongsTo(Major::class);
    }

    public function occupations()
    {
        return $this->belongsToMany(Occupation::class);
    }

    public function skills()
    {
        return $this->belongsToMany(Skill::class);
    }
}
