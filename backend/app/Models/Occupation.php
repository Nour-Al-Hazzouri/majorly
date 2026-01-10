<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Occupation extends Model
{
    use HasFactory;
    
    protected $fillable = ['name', 'code', 'soc_code', 'description', 'median_salary', 'job_outlook', 'tasks'];
    
    protected $hidden = ['majors', 'specializations'];

    protected $casts = [
        'tasks' => 'array',
    ];

    /**
     * Get the technology skills associated with this occupation from O*NET data.
     */
    public function techSkills()
    {
        return $this->hasMany(OnetOccupationTechSkill::class, 'soc_code', 'soc_code');
    }

    /**
     * Get the knowledge/skills associated with this occupation from O*NET data.
     */
    public function onetKnowledge()
    {
        return $this->belongsToMany(OnetKnowledge::class, 'onet_occupation_knowledge', 'soc_code', 'element_id', 'soc_code', 'element_id')
            ->withPivot('importance', 'level')
            ->orderByPivot('importance', 'desc');
    }


    public function skills()
    {
        return $this->belongsToMany(Skill::class, 'occupation_skill');
    }

    public function onetSkills()
    {
        return $this->hasMany(OccupationOnetSkill::class);
    }

    public function majors()
    {
        return $this->belongsToMany(Major::class);
    }

    public function specializations()
    {
        return $this->belongsToMany(Specialization::class);
    }
}
