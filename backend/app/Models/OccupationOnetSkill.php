<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OccupationOnetSkill extends Model
{
    protected $table = 'occupation_onet_skills';
    protected $fillable = ['occupation_id', 'onet_skill_id', 'name', 'importance', 'level'];

    public function occupation()
    {
        return $this->belongsTo(Occupation::class);
    }
}
