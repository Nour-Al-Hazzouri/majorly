<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Major extends Model
{
    protected $fillable = ['name', 'slug', 'category', 'description', 'ideal_interests', 'ideal_strengths'];

    protected $casts = [
        'ideal_interests' => 'array',
        'ideal_strengths' => 'array',
    ];

    public function skills()
    {
        return $this->belongsToMany(Skill::class);
    }

    public function occupations()
    {
        return $this->belongsToMany(Occupation::class);
    }

    public function usersWhoSaved()
    {
        return $this->belongsToMany(User::class, 'saved_majors')->withTimestamps();
    }
}
