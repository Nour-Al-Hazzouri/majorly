<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Occupation extends Model
{
    use HasFactory;
    
    protected $fillable = ['name', 'code', 'description', 'median_salary', 'job_outlook'];

    public function majors()
    {
        return $this->belongsToMany(Major::class);
    }

    public function specializations()
    {
        return $this->belongsToMany(Specialization::class);
    }
}
