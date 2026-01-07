export interface Skill {
    id: number;
    name: string;
    category?: string;
}

export interface Occupation {
    id: number;
    code: string;
    title: string;
    description?: string;
    median_salary?: string;
    outlook?: string;
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
    major_id: number;
    major: Major;
    match_percentage: number;
    rank: number;
    reasoning: string[];
}

export interface Assessment {
    id: number;
    user_id: number | null;
    type: 'tier1' | 'deep_dive';
    status: 'started' | 'completed';
    metadata: any;
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
