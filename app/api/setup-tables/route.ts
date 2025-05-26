import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST() {
  try {
    // Enable UUID extension
    await supabase.rpc("exec_sql", {
      sql: 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";',
    })

    // Create users table
    const { error: usersError } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY REFERENCES auth.users(id),
          email TEXT NOT NULL,
          full_name TEXT NOT NULL,
          avatar_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    if (usersError) throw usersError

    // Create user_progress table
    const { error: progressError } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS user_progress (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL REFERENCES auth.users(id),
          career_path TEXT NOT NULL,
          completed_modules INTEGER[] DEFAULT '{}',
          current_module INTEGER DEFAULT 1,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(user_id, career_path)
        );
      `,
    })

    if (progressError) throw progressError

    // Create quiz_results table
    const { error: quizError } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS quiz_results (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL REFERENCES auth.users(id),
          module_id INTEGER NOT NULL,
          career_path TEXT NOT NULL,
          score INTEGER NOT NULL,
          total_questions INTEGER NOT NULL,
          passed BOOLEAN NOT NULL DEFAULT FALSE,
          completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    if (quizError) throw quizError

    // Create achievements table
    const { error: achievementsError } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS achievements (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT NOT NULL,
          icon TEXT NOT NULL,
          condition TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    if (achievementsError) throw achievementsError

    // Create user_achievements table
    const { error: userAchievementsError } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS user_achievements (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL REFERENCES auth.users(id),
          achievement_id TEXT NOT NULL REFERENCES achievements(id),
          earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(user_id, achievement_id)
        );
      `,
    })

    if (userAchievementsError) throw userAchievementsError

    // Create learning_resources table
    const { error: resourcesError } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS learning_resources (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          url TEXT NOT NULL,
          resource_type TEXT NOT NULL,
          module_id INTEGER NOT NULL,
          career_path TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    if (resourcesError) throw resourcesError

    // Insert initial achievements
    const { error: insertAchievementsError } = await supabase.rpc("exec_sql", {
      sql: `
        INSERT INTO achievements (id, name, description, icon, condition)
        VALUES
          ('first_module', 'First Step', 'Complete your first module', 'rocket', 'completedModules >= 1'),
          ('five_modules', 'Halfway There', 'Complete 5 modules', 'milestone', 'completedModules >= 5'),
          ('engineer_master', 'Engineering Master', 'Complete all modules in the engineer path', 'award', 'completedModules >= 6'),
          ('doctor_master', 'Medical Master', 'Complete all modules in the doctor path', 'award', 'completedModules >= 6'),
          ('pilot_master', 'Aviation Master', 'Complete all modules in the pilot path', 'award', 'completedModules >= 6'),
          ('perfect_quiz', 'Perfect Score', 'Get 100% on a quiz', 'target', 'score === totalQuestions'),
          ('fast_learner', 'Fast Learner', 'Complete a module in under 10 minutes', 'clock', 'completionTime < 600')
        ON CONFLICT (id) DO NOTHING;
      `,
    })

    if (insertAchievementsError) throw insertAchievementsError

    // Insert sample learning resources
    const { error: insertResourcesError } = await supabase.rpc("exec_sql", {
      sql: `
        INSERT INTO learning_resources (title, description, url, resource_type, module_id, career_path)
        VALUES
          ('Introduction to Physics for Engineers', 'A comprehensive guide to basic physics concepts for engineering students', 'https://example.com/physics-engineers', 'ebook', 1, 'engineer'),
          ('Vector Mathematics for Engineers', 'Learn how to work with vectors in engineering applications', 'https://example.com/vector-math', 'video', 1, 'engineer'),
          ('Basic Measurement Techniques', 'Precision and accuracy in engineering measurements', 'https://example.com/measurement', 'article', 1, 'engineer'),
          ('Scientific Method in Engineering', 'How the scientific method is applied in engineering problems', 'https://example.com/scientific-method', 'interactive', 1, 'engineer'),
          ('Physics Visualization Tools', 'Interactive tools to visualize physics concepts', 'https://example.com/physics-tools', 'tool', 1, 'engineer'),
          ('Biomechanics Fundamentals', 'Understanding human movement and body mechanics', 'https://example.com/biomechanics', 'ebook', 1, 'doctor'),
          ('Medical Imaging Basics', 'Introduction to X-rays, CT, and MRI', 'https://example.com/medical-imaging', 'video', 2, 'doctor'),
          ('Flight Principles', 'Understanding lift, thrust, drag, and weight', 'https://example.com/flight-principles', 'interactive', 1, 'pilot'),
          ('Weather and Aviation', 'How atmospheric conditions affect flight', 'https://example.com/weather-aviation', 'article', 2, 'pilot')
        ON CONFLICT DO NOTHING;
      `,
    })

    if (insertResourcesError) throw insertResourcesError

    return NextResponse.json({
      message: "Database setup completed successfully",
      details: "All tables created and sample data inserted",
    })
  } catch (error: any) {
    console.error("Error setting up database:", error)
    return NextResponse.json(
      {
        error: "Failed to setup database",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
