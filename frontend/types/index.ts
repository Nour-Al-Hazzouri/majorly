export interface Skill {
    id: number;
    name: string;
    category?: string;
}

export interface Occupation {
    id: number;
    code: string;
    name: string;
    description?: string;
    median_salary?: string;
    job_outlook?: string;
}

export interface Specialization {
    id: number;
    major_id: number;
    name: string;
    slug: string;
    description: string;
    ideal_interests: Record<string, number>;
    ideal_strengths: Record<string, number>;
    occupations?: Occupation[];
}

export interface Major {
    id: number;
    name: string;
    slug: string;
    category: string;
    description: string;
    skills?: Skill[];
    occupations?: Occupation[];
    is_favorite?: boolean;
}

export interface AssessmentResult {
    id: number;
    major_id?: number;
    major?: Major;
    specialization_id?: number;
    specialization?: Specialization;
    match_percentage: number;
    rank: number;
    reasoning: string[];
}

export interface SpecializationResult {
    specialization_id?: number | null;
    specialization?: Specialization | null;
    occupation_id?: number | null;
    occupation?: Occupation | null;
    match_percentage: number;
    scores: {
        interests: number;
        strengths: number;
    };
}

export interface Assessment {
    id: number;
    user_id: number | null;
    type: 'tier1' | 'deep_dive';
    status: 'started' | 'completed';
    metadata: {
        major_id?: number;
        [key: string]: any;
    };
    results?: AssessmentResult[];
    created_at: string;
}

// Re-export shared assessment types
export interface Question {
    id: string;
    text: string;
}

export interface AssessmentSection {
    id: string;
    title: string;
    description: string;
    type: 'skills_search' | 'rating_scale';
    required: boolean;
    min_selections?: number;
    questions?: Question[];
}
