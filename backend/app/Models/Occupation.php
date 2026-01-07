<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Occupation extends Model
{
    protected $fillable = ['name', 'code', 'description', 'median_salary', 'job_outlook'];

    public function majors()
    {
        return $this->belongsToMany(Major::class);
    }
}
