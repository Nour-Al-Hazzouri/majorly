<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OnetOccupationTechSkill extends Model
{
    use HasFactory;

    protected $table = 'onet_occupation_tech_skills';

    protected $fillable = ['soc_code', 'skill_name', 'hot_tech'];

    protected $hidden = ['occupation'];

    public function occupation()
    {
        return $this->belongsTo(Occupation::class, 'soc_code', 'soc_code');
    }
}
