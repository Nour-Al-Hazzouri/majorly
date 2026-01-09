<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function assessments()
    {
        return $this->hasMany(Assessment::class);
    }

    public function savedMajors()
    {
        return $this->belongsToMany(Major::class, 'saved_majors')->withTimestamps();
    }

    public function savedSpecializations()
    {
        return $this->belongsToMany(Specialization::class, 'saved_specializations')->withTimestamps();
    }

    public function savedOccupations()
    {
        return $this->belongsToMany(Occupation::class, 'saved_occupations')->withTimestamps();
    }
}
