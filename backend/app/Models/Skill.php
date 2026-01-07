<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'category', 'lightcast_id'];

    public function majors()
    {
        return $this->belongsToMany(Major::class);
    }
}
