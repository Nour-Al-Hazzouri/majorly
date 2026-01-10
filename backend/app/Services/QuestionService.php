<?php

namespace App\Services;

class QuestionService
{
    /**
     * Get the Tier 1 assessment questions and structure.
     *
     * @return array
     */
    public function getTier1Questions(): array
    {
        return [
            [
                'id' => 'strengths_weaknesses',
                'title' => 'Strengths & Weaknesses',
                'description' => 'Rate yourself on the following attributes (1 = Weak, 5 = Strong).',
                'type' => 'rating_scale',
                'required' => true,
                'questions' => [
                    ['id' => 'analytical_thinking', 'text' => 'Analytical Thinking'],
                    ['id' => 'creative_problem_solving', 'text' => 'Creative Problem Solving'],
                    ['id' => 'communication', 'text' => 'Communication & Interpersonal Skills'],
                    ['id' => 'leadership', 'text' => 'Leadership & Influence'],
                    ['id' => 'technical_aptitude', 'text' => 'Technical Aptitude'],
                    ['id' => 'detail_orientation', 'text' => 'Attention to Detail'],
                    ['id' => 'adaptability', 'text' => 'Adaptability & Flexibility'],
                ],
            ],
            [
                'id' => 'interests',
                'title' => 'Interest Profiler',
                'description' => 'How much would you enjoy doing these activities? (1 = Dislike, 5 = Enjoy)',
                'type' => 'rating_scale',
                'required' => true,
                'questions' => [
                    ['id' => 'scientific_research', 'text' => 'Conducting scientific experiments or research'],
                    ['id' => 'artistic_expression', 'text' => 'Creating art, music, or writing'],
                    ['id' => 'social_service', 'text' => 'Helping or teaching others'],
                    ['id' => 'business_management', 'text' => 'Managing people or projects in a business setting'],
                    ['id' => 'technical_work', 'text' => 'Working with machinery, computers, or tools'],
                    ['id' => 'data_analysis', 'text' => 'Analyzing data and finding patterns'],
                    ['id' => 'community_organizing', 'text' => 'Organizing community events or initiatives'],
                    ['id' => 'outdoor_activity', 'text' => 'Working outdoors or with physical environment'],
                    ['id' => 'mathematical_puzzles', 'text' => 'Solving complex mathematical or logical puzzles'],
                    ['id' => 'writing_copy', 'text' => 'Writing articles, blogs, or marketing content'],
                ],
            ],
        ];
    }

    /**
     * Get deep dive questions for a specific major.
     *
     * @param \App\Models\Major $major
     * @return array
     */
    /**
     * Get deep dive questions for a specific major.
     *
     * @param \App\Models\Major $major
     * @return array
     */
    public function getDeepDiveQuestions(\App\Models\Major $major): array
    {
        // Check for curated questions first based on category
        $curated = $this->getCuratedQuestions($major->category);
        
        // We aim for about 25 questions for a "Longer, Bigger" test
        $dynamicLimit = max(0, 25 - count($curated));
        
        $dynamicQuestions = [];
        if ($dynamicLimit > 0) {
            $occupations = $major->occupations()
                ->whereNotNull('tasks')
                ->inRandomOrder()
                ->limit($dynamicLimit)
                ->get();

            foreach ($occupations as $occupation) {
                // Phrasing strategy: situational and expectation-based
                // We use the first sentence of the description as a "vibe" indicator
                $desc = $occupation->description;
                $vibe = strtolower(explode('.', $desc)[0] ?? "activities in this field");
                
                // Clean up vibe to make it more situational
                $vibe = str_replace(['conduct ', 'provide ', 'manage ', 'perform '], ['conducting ', 'providing ', 'managing ', 'performing '], $vibe);

                $dynamicQuestions[] = [
                    'id' => 'occupation_' . $occupation->id,
                    'text' => "How would you feel about a daily work environment focused on " . $vibe . "?",
                ];
            }
        }

        $allQuestions = array_merge($curated, $dynamicQuestions);

        // Shuffle questions to keep it fresh
        shuffle($allQuestions);

        return [
            [
                'id' => 'deep_dive_comprehensive',
                'title' => $major->name . ' - Comprehensive Deep Dive',
                'description' => 'This is a detailed assessment to precisely match your personality with the best career paths in ' . $major->name . '. (1 = Not for me, 5 = Exactly me)',
                'type' => 'rating_scale',
                'required' => true,
                'questions' => $allQuestions,
            ],
        ];
    }

    private function getCuratedQuestions(string $category): array
    {
        $curated = [
            'STEM' => [
                ['id' => 'st1', 'text' => 'How likely would you be able to handle sitting for hours at a screen, searching for a single hidden error that is breaking everything you built?'],
                ['id' => 'st2', 'text' => 'How enjoyable would you find a situation where you have to outsmart someone else to find vulnerabilities in their work?'],
                ['id' => 'st3', 'text' => 'Do you find satisfaction in organizing very small details that others might ignore, even if it takes a long time?'],
                ['id' => 'st4', 'text' => 'Would you enjoy building a complex physical or digital structure knowing that one wrong measurement could make it fail?'],
                ['id' => 'st5', 'text' => 'Do you like the idea of learning a "new language" every few years just to keep up with how the world works?'],
                ['id' => 'st6', 'text' => 'How comfortable are you with "pure logic" problems that don\'t have an emotional or human element?'],
                ['id' => 'st7', 'text' => 'Would you prefer to work in a "controlled environment" (like a lab or clean office) rather than a dynamic, unpredictable one?'],
                ['id' => 'st8', 'text' => 'Does the idea of discovering a new law of nature or a more efficient algorithm excite you?'],
                ['id' => 'st9', 'text' => 'Are you willing to fail hundreds of times in a row if it leads to one definitive proof or working solution?'],
                ['id' => 'st10', 'text' => 'Do you enjoy taking things apart (mechanically or logically) just to see how they function?'],
                ['id' => 'st11', 'text' => 'How much do you value "objective truth" over personal opinion or social harmony?'],
                ['id' => 'st12', 'text' => 'Would you enjoy managing a system that handles millions of automated tasks simultaneously?'],
                ['id' => 'st13', 'text' => 'Do you find math or formulas to be a "beautiful" way to describe reality?'],
                ['id' => 'st14', 'text' => 'How much do you enjoy the feeling of "flow" when lost in a deep, technical puzzle?'],
                ['id' => 'st15', 'text' => 'Are you interested in how "invisible" things (like atoms, code, or signals) shape the visible world?'],
                ['id' => 'st16', 'text' => 'Would you enjoy spending weeks researching why a mechanical part failed after only 1,000 hours of use?'],
                ['id' => 'st17', 'text' => 'How do you feel about working in a job where you rarely see the final "human" user of your work?'],
                ['id' => 'st18', 'text' => 'Does "optimization" (making things 1% faster or 1% lighter) feel like a worthy life goal?'],
                ['id' => 'st19', 'text' => 'Are you more comfortable with "Yes/No" or "True/False" situations than shades of gray?'],
                ['id' => 'st20', 'text' => 'Do you enjoy the challenge of explaining a very complex, technical idea to someone who doesn\'t understand it?'],
            ],
            'Business' => [
                ['id' => 'bu1', 'text' => 'How would you feel about having to convince a room full of strangers to trust you with their money or their future?'],
                ['id' => 'bu2', 'text' => 'Does the idea of "calculating a risk" and then taking it excite you more than playing it safe?'],
                ['id' => 'bu3', 'text' => 'How much do you enjoy the "game" of negotiation—trying to find the middle ground where both sides win?'],
                ['id' => 'bu4', 'text' => 'Could you handle the pressure of being responsible for whether or not 50 people get paid at the end of the month?'],
                ['id' => 'bu5', 'text' => 'Do you enjoy looking at a spreadsheet or a market and trying to predict what people will want six months from now?'],
                ['id' => 'bu6', 'text' => 'How comfortable are you with "networking"—meeting people specifically to build professional connections?'],
                ['id' => 'bu7', 'text' => 'Would you enjoy the challenge of turning a failing project or company into a profitable one?'],
                ['id' => 'bu8', 'text' => 'Do you value "efficiency" and "optimization" above almost anything else in a business workflow?'],
                ['id' => 'bu9', 'text' => 'How likely are you to step up as a leader in a group when no one else knows what to do?'],
                ['id' => 'bu10', 'text' => 'Do you find "scaling" something—making it bigger and more impactful—to be a rewarding challenge?'],
                ['id' => 'bu11', 'text' => 'Are you good at identifying what makes a product or person "valuable" or "attractive" to others?'],
                ['id' => 'bu12', 'text' => 'How would you feel about working in a highly competitive environment where your results are measured in numbers?'],
                ['id' => 'bu13', 'text' => 'Do you enjoy the "logistics" of planning a large event where many moving parts have to align?'],
                ['id' => 'bu14', 'text' => 'How much do you value "strategic thinking" (planning 10 steps ahead) in your daily life?'],
                ['id' => 'bu15', 'text' => 'Would you enjoy being the "bridge" between technical experts and the general public?'],
                ['id' => 'bu16', 'text' => 'Are you comfortable making "hard decisions" that might upset people but benefit the organization?'],
                ['id' => 'bu17', 'text' => 'How much do you enjoy studying the "psychology" of why people buy certain things?'],
                ['id' => 'bu18', 'text' => 'Does the idea of "investing" time and money now for a potential gain years later appeal to you?'],
                ['id' => 'bu19', 'text' => 'How would you feel about a job where you are constantly switching between many different tasks and people?'],
                ['id' => 'bu20', 'text' => 'Do you find the "global economy" and its interconnectedness to be a fascinating topic?'],
            ],
            'Arts & Humanities' => [
                ['id' => 'ar1', 'text' => 'How much do you enjoy the process of creating something from nothing (a story, a song, a design)?'],
                ['id' => 'ar2', 'text' => 'Would you prefer a job where there is "no single right answer" and you can express your own perspective?'],
                ['id' => 'ar3', 'text' => 'How much do you value "emotional impact" over logical efficiency in your work?'],
                ['id' => 'ar4', 'text' => 'Do you find yourself analyzing the "subtext" or "deeper meaning" behind the art or media you consume?'],
                ['id' => 'ar5', 'text' => 'Would you enjoy researching the historical and cultural context of a community you\'ve never visited?'],
                ['id' => 'ar6', 'text' => 'How do you feel about "advocating" for a cause or a group of people who are being ignored?'],
                ['id' => 'ar7', 'text' => 'Do you enjoy the "physicality" of creating—working with your hands to mold, draw, or build?'],
                ['id' => 'ar8', 'text' => 'How comfortable are you with "ambiguity"—situations where there is a lot of room for interpretation?'],
                ['id' => 'ar9', 'text' => 'Do you find satisfaction in storytelling and finding the "narrative arc" in everyday life?'],
                ['id' => 'ar10', 'text' => 'How much do you enjoy "critiquing" work—finding ways to improve it while respecting its vision?'],
                ['id' => 'ar11', 'text' => 'Would you be happy with a job where your primary tool is language and communication?'],
                ['id' => 'ar12', 'text' => 'How would you feel about spending years studying one specific person or era in history?'],
                ['id' => 'ar13', 'text' => 'Do you value "aesthetics"—how things look and feel—as much as their functionality?'],
                ['id' => 'ar14', 'text' => 'Would you enjoy working in a museum, library, or gallery environment?'],
                ['id' => 'ar15', 'text' => 'How likely are you to get "lost" in a creative project, losing track of time entirely?'],
                ['id' => 'ar16', 'text' => 'Are you interested in "deconstructing" societal norms to understand why we behave the way we do?'],
                ['id' => 'ar17', 'text' => 'How comfortable are you with performing or presenting your ideas to an audience?'],
                ['id' => 'ar18', 'text' => 'Do you find "translation"—moving ideas between languages or mediums—to be an interesting challenge?'],
                ['id' => 'ar19', 'text' => 'How much does "originality" matter to you in your work?'],
                ['id' => 'ar20', 'text' => 'Would you enjoy a career where you are constantly learning about different cultures and viewpoints?'],
            ],
            'Health Sciences' => [
                ['id' => 'he1', 'text' => 'How would you feel about being responsible for the physical well-being of someone who is in pain or afraid?'],
                ['id' => 'he2', 'text' => 'Could you handle the pressure of having to make a critical, life-altering decision in a matter of seconds?'],
                ['id' => 'he3', 'text' => 'How much do you enjoy the "mystery" of diagnosing a problem based on hidden symptoms?'],
                ['id' => 'he4', 'text' => 'Are you comfortable working in a high-intensity environment with long hours and unpredictable emergencies?'],
                ['id' => 'he5', 'text' => 'Do you have the "stomach" for the messy side of science—blood, injuries, and the biological reality of life?'],
                ['id' => 'he6', 'text' => 'How much do you value the "human connection"—the feeling of helping a specific individual recover?'],
                ['id' => 'he7', 'text' => 'Would you enjoy the "scientific rigor" of testing new treatments with extreme precision?'],
                ['id' => 'he8', 'text' => 'How do you feel about working with complex medical machinery that requires constant calibration?'],
                ['id' => 'he9', 'text' => 'Do you find "preventative care" (helping people avoid getting sick) as interesting as curing them?'],
                ['id' => 'he10', 'text' => 'How comfortable are you with "repetition"—performing the same surgery or test hundreds of times to master it?'],
                ['id' => 'he11', 'text' => 'Are you patient enough to work with individuals whose progress might take months or years to see?'],
                ['id' => 'he12', 'text' => 'How would you feel about a job where you are constantly exposed to illness and public health risks?'],
                ['id' => 'he13', 'text' => 'Do you enjoy "teaching" people how to take better care of their own bodies and minds?'],
                ['id' => 'he14', 'text' => 'How much do you value "ethics" and "privacy" in a professional setting?'],
                ['id' => 'he15', 'text' => 'Would you enjoy "collaborating" with a large team of specialists to solve one patient\'s problem?'],
                ['id' => 'he16', 'text' => 'Are you interested in how "habits" and "environment" impact long-term health?'],
                ['id' => 'he17', 'text' => 'How comfortable are you with the "authority" of being the expert who has all the answers?'],
                ['id' => 'he18', 'text' => 'Do you find "mental health" and the mechanics of the brain to be as fascinating as physical health?'],
                ['id' => 'he19', 'text' => 'How do you feel about a career that requires a lifetime of constant study and re-certification?'],
                ['id' => 'he20', 'text' => 'Would you be happy in a role where you help families navigate difficult medical transitions?'],
            ],
            'Agriculture' => [
                ['id' => 'ag1', 'text' => 'How much do you enjoy working outdoors, regardless of the weather conditions?'],
                ['id' => 'ag2', 'text' => 'Are you comfortable working in a job that follows the cycles of nature rather than a 9-to-5 schedule?'],
                ['id' => 'ag3', 'text' => 'Do you find it rewarding to care for living things (plants or animals) and watch them grow?'],
                ['id' => 'ag4', 'text' => 'Would you enjoy the physical challenge of working with heavy machinery and tools?'],
                ['id' => 'ag5', 'text' => 'How do you feel about the responsibility of managing sustainable resources for a community?'],
                ['id' => 'ag6', 'text' => 'Do you enjoy troubleshooting mechanical or biological problems on the fly?'],
                ['id' => 'ag7', 'text' => 'Are you interested in the "invisible" chemistry of soil, water, and environment?'],
                ['id' => 'ag8', 'text' => 'How comfortable are you with the "unpredictable" nature of a season where a single storm can change everything?'],
                ['id' => 'ag9', 'text' => 'Would you enjoy a career that mixes laboratory research with hands-on field work?'],
                ['id' => 'ag10', 'text' => 'How much do you value the feeling of "producing" something tangible that people need?'],
                ['id' => 'ag11', 'text' => 'Do you enjoy the solitude of working in large open spaces?'],
                ['id' => 'ag12', 'text' => 'Are you interested in the logistics of how food and resources move around the world?'],
                ['id' => 'ag13', 'text' => 'How do you feel about working with animals and understanding their signals?'],
                ['id' => 'ag14', 'text' => 'Would you enjoy the challenge of identifying and managing pests or diseases in a crop?'],
                ['id' => 'ag15', 'text' => 'Are you comfortable with the "dirtier" aspects of working with nature and the earth?'],
            ],
            'Trades' => [
                ['id' => 'tr1', 'text' => 'How much do you enjoy the feeling of fixing something that was completely broken?'],
                ['id' => 'tr2', 'text' => 'Would you prefer a job where you are on your feet and moving all day?'],
                ['id' => 'tr3', 'text' => 'Do you find satisfaction in "visible progress"—seeing exactly what you accomplished by the end of the day?'],
                ['id' => 'tr4', 'text' => 'How comfortable are you with high-precision work where a mistake of a few millimeters matters?'],
                ['id' => 'tr5', 'text' => 'Would you enjoy the challenge of specialized troubleshooting in a complex electrical or mechanical system?'],
                ['id' => 'tr6', 'text' => 'Are you comfortable working in tight spaces or at heights?'],
                ['id' => 'tr7', 'text' => 'How much do you value having a skill that allows you to be self-employed or start your own business?'],
                ['id' => 'tr8', 'text' => 'Do you enjoy working with blueprints and technical drawings to build something real?'],
                ['id' => 'tr9', 'text' => 'How do you feel about working in environments that might be loud, dusty, or intense?'],
                ['id' => 'tr10', 'text' => 'Are you good at visualizing how many different parts (wires, pipes, gears) fit together into a whole?'],
                ['id' => 'tr11', 'text' => 'Do you enjoy the "puzzle" of finding the source of a leak, a short circuit, or a mechanical failure?'],
                ['id' => 'tr12', 'text' => 'How likely are you to read the "technical manual" to understand how a tool works?'],
                ['id' => 'tr13', 'text' => 'Would you enjoy the physically demanding nature of mastering a craft?'],
                ['id' => 'tr14', 'text' => 'Do you find it rewarding to know your work makes a building safe for people to live and work in?'],
                ['id' => 'tr15', 'text' => 'Are you comfortable with the responsibility of following strict safety protocols to prevent accidents?'],
            ],
            'Education' => [
                ['id' => 'ed1', 'text' => 'How much do you enjoy explaining a difficult concept to someone and seeing the moment they "get it"?'],
                ['id' => 'ed2', 'text' => 'Would you be happy with a job where your daily goal is to inspire and guide others?'],
                ['id' => 'ed3', 'text' => 'How comfortable are you with "public speaking"—managing the attention of a group of people?'],
                ['id' => 'ed4', 'text' => 'Do you have the patience to repeat the same information in many different ways until it is understood?'],
                ['id' => 'ed5', 'text' => 'Would you enjoy the challenge of creating a "curriculum"—a step-by-step path for someone to learn a new skill?'],
                ['id' => 'ed6', 'text' => 'How much do you value being a "mentor" or a positive influence in someone else\'s life?'],
                ['id' => 'ed7', 'text' => 'Are you comfortable managing the "dynamics" and behaviors of a large group of individuals?'],
                ['id' => 'ed8', 'text' => 'Do you find "lifelong learning" and staying updated on your subject to be an exciting prospect?'],
                ['id' => 'ed9', 'text' => 'How do you feel about having to assess and grade the progress of others objectively?'],
                ['id' => 'ed10', 'text' => 'Would you enjoy working in an environment dedicated to curiosity and knowledge?'],
                ['id' => 'ed11', 'text' => 'Are you interested in the "psychology" of how people learn and process information?'],
                ['id' => 'ed12', 'text' => 'How would you handle a situation where a student or learner is struggling and needs extra support?'],
                ['id' => 'ed13', 'text' => 'Do you enjoy the "theatrical" aspect of presenting information in an engaging and creative way?'],
                ['id' => 'ed14', 'text' => 'How much do you value the "impact" of shaping the future generation?'],
                ['id' => 'ed15', 'text' => 'Would you be happy in a role that involves constant communication with parents, colleagues, and administrators?'],
            ],
            'Social Sciences' => [
                ['id' => 'ss1', 'text' => 'How much do you enjoy observing and analyzing how people interact in different social settings?'],
                ['id' => 'ss2', 'text' => 'Are you interested in "deconstructing" societal structures to understand why things are the way they are?'],
                ['id' => 'ss3', 'text' => 'Would you enjoy spending months researching the history and patterns of a specific human behavior?'],
                ['id' => 'ss4', 'text' => 'How do you feel about using "data and statistics" to describe human emotions and social trends?'],
                ['id' => 'ss5', 'text' => 'Are you comfortable with "complex social problems" that don\'t have an easy or fast solution?'],
                ['id' => 'ss6', 'text' => 'Do you find "interviews and surveys" to be a fascinating way to gather information?'],
                ['id' => 'ss7', 'text' => 'How much do you value "objectivity" when studying topics that can be very emotional?'],
                ['id' => 'ss8', 'text' => 'Would you enjoy writing long reports that explain the results of your social research?'],
                ['id' => 'ss9', 'text' => 'Are you interested in how "policy and laws" impact the daily lives of different communities?'],
                ['id' => 'ss10', 'text' => 'How do you feel about working in a job where your success is measured by the quality of your insights and theories?'],
                ['id' => 'ss11', 'text' => 'Do you enjoy debating "ethics" and "social justice"—finding the fairest way for a society to function?'],
                ['id' => 'ss12', 'text' => 'How would you feel about a career in counseling or helping individuals navigate life transitions?'],
                ['id' => 'ss13', 'text' => 'Are you interested in the "invisible" psychological factors that drive our decisions?'],
                ['id' => 'ss14', 'text' => 'How much do you value "cultural competence"—the ability to understand and respect different worldviews?'],
                ['id' => 'ss15', 'text' => 'Would you enjoy "archival research"—looking through old documents to solve a modern-day mystery?'],
            ],
            'Public Service' => [
                ['id' => 'ps1', 'text' => 'How do you feel about the idea of dedicated "service" to your community, even if it goes unrecognized?'],
                ['id' => 'ps2', 'text' => 'Could you handle the responsibility of enforcing "rules and laws" to keep a community safe?'],
                ['id' => 'ps3', 'text' => 'Would you enjoy working in a highly "structured and disciplined" environment with clear chains of command?'],
                ['id' => 'ps4', 'text' => 'How comfortable are you with being in the "public eye" and representing a government or institution?'],
                ['id' => 'ps5', 'text' => 'Do you have the "calmness" needed to handle emergency situations where people are looking to you for guidance?'],
                ['id' => 'ps6', 'text' => 'How much do you value "integrity and honesty" in your professional life?'],
                ['id' => 'ps7', 'text' => 'Would you enjoy the "administrative" side of making sure a city or government runs smoothly?'],
                ['id' => 'ps8', 'text' => 'Are you comfortable working in a job where your primary mission is to protect or assist others?'],
                ['id' => 'ps9', 'text' => 'How do you feel about the idea of having to follow "strict protocols" to ensure every citizen is treated fairly?'],
                ['id' => 'ps10', 'text' => 'Would you enjoy being the person who "organizes resources" during a crisis or large event?'],
                ['id' => 'ps11', 'text' => 'Are you interested in how "urban planning and infrastructure" affects how people live?'],
                ['id' => 'ps12', 'text' => 'How would you handle having to manage "conflicts" between different groups of people in a town?'],
                ['id' => 'ps13', 'text' => 'Do you find satisfaction in "bureaucracy"—ensuring that every form is filled and every process is followed?'],
                ['id' => 'ps14', 'text' => 'How much do you value "safety and order" in your daily environment?'],
                ['id' => 'ps15', 'text' => 'Would you feel a sense of pride in maintaining the public parks, libraries, or infrastructure of your city?'],
            ],
            'Service Industry' => [
                ['id' => 'si1', 'text' => 'How much do you enjoy the fast-paced energy of a busy environment with lots of people?'],
                ['id' => 'si2', 'text' => 'Would you be happy in a job where "making people smile" or "making them comfortable" is your main goal?'],
                ['id' => 'si3', 'text' => 'How comfortable are you with "multitasking"—handling several requests from different people at the same time?'],
                ['id' => 'si4', 'text' => 'Do you have the "stamina" for a job that involves being on your feet and active for long periods?'],
                ['id' => 'si5', 'text' => 'How well do you handle "complaints" or difficult customers while staying professional and polite?'],
                ['id' => 'si6', 'text' => 'Do you enjoy the "hospitality" of hosting and ensuring everyone has what they need?'],
                ['id' => 'si7', 'text' => 'How much do you value "teamwork" and working closely with others in a shift-based environment?'],
                ['id' => 'si8', 'text' => 'Would you enjoy the challenge of "perfectionism" in service—getting the details exactly as the customer wants?'],
                ['id' => 'si9', 'text' => 'How do you feel about working in a job with a "performance-based" element where your interaction is key?'],
                ['id' => 'si10', 'text' => 'Are you interested in "global travel or tourism" and helping people experience new places?'],
                ['id' => 'si11', 'text' => 'Do you find "culinary arts or mixology" to be an interesting way to mix creativity and service?'],
                ['id' => 'si12', 'text' => 'How would you handle a situation where you have to "think on your feet" to solve a guest\'s problem?'],
                ['id' => 'si13', 'text' => 'Do you enjoy being the "face" of a business and welcoming people as they arrive?'],
                ['id' => 'si14', 'text' => 'How much do you value a "dynamic and social" work environment over a quiet and solitary one?'],
                ['id' => 'si15', 'text' => 'Would you be happy in a role where every day brings completely different people and challenges?'],
            ],
        ];

        return $curated[$category] ?? [];
    }
}
