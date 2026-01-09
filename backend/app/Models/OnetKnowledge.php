<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OnetKnowledge extends Model
{
    use HasFactory;

    protected $table = 'onet_knowledge';

    protected $fillable = ['element_id', 'name', 'description', 'type'];

    protected $hidden = ['occupations'];

    public function occupations()
    {
        return $this->belongsToMany(Occupation::class, 'onet_occupation_knowledge', 'element_id', 'soc_code', 'element_id', 'soc_code')
            ->withPivot('importance', 'level');
    }
}
