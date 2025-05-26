-- User accounts are managed by Supabase Auth
-- This table stores additional user data
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User progress tracking
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  career_path TEXT NOT NULL,
  completed_modules INTEGER[] DEFAULT '{}',
  current_module INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, career_path)
);

-- Quiz results
CREATE TABLE quiz_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  module_id INTEGER NOT NULL,
  career_path TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  passed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Achievements
CREATE TABLE achievements (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  condition TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User achievements
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  achievement_id TEXT NOT NULL REFERENCES achievements(id),
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Learning resources
CREATE TABLE learning_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  module_id INTEGER NOT NULL,
  career_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert some initial achievements
INSERT INTO achievements (id, name, description, icon, condition)
VALUES
  ('first_module', 'First Step', 'Complete your first module', 'rocket', 'completedModules >= 1'),
  ('five_modules', 'Halfway There', 'Complete 5 modules', 'milestone', 'completedModules >= 5'),
  ('engineer_master', 'Engineering Master', 'Complete all modules in the engineer path', 'award', 'completedModules >= 6'),
  ('doctor_master', 'Medical Master', 'Complete all modules in the doctor path', 'award', 'completedModules >= 6'),
  ('pilot_master', 'Aviation Master', 'Complete all modules in the pilot path', 'award', 'completedModules >= 6'),
  ('perfect_quiz', 'Perfect Score', 'Get 100% on a quiz', 'target', 'score === totalQuestions'),
  ('fast_learner', 'Fast Learner', 'Complete a module in under 10 minutes', 'clock', 'completionTime < 600');

-- Insert sample learning resources for engineering path
INSERT INTO learning_resources (title, description, url, resource_type, module_id, career_path)
VALUES
  ('Introduction to Physics for Engineers', 'A comprehensive guide to basic physics concepts for engineering students', 'https://example.com/physics-engineers', 'ebook', 1, 'engineer'),
  ('Vector Mathematics for Engineers', 'Learn how to work with vectors in engineering applications', 'https://example.com/vector-math', 'video', 1, 'engineer'),
  ('Basic Measurement Techniques', 'Precision and accuracy in engineering measurements', 'https://example.com/measurement', 'article', 1, 'engineer'),
  ('Scientific Method in Engineering', 'How the scientific method is applied in engineering problems', 'https://example.com/scientific-method', 'interactive', 1, 'engineer'),
  ('Physics Visualization Tools', 'Interactive tools to visualize physics concepts', 'https://example.com/physics-tools', 'tool', 1, 'engineer');
