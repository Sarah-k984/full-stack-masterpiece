-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  total_courses_completed INTEGER NOT NULL DEFAULT 0,
  total_certificates INTEGER NOT NULL DEFAULT 0,
  points_earned INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  category TEXT, -- For backward compatibility
  level TEXT NOT NULL CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
  duration TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  students_count INTEGER NOT NULL DEFAULT 0,
  instructor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lessons table
CREATE TABLE public.lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  content_type TEXT NOT NULL CHECK (content_type IN ('video', 'text', 'quiz')),
  duration_minutes INTEGER NOT NULL DEFAULT 0,
  order_index INTEGER NOT NULL,
  video_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create enrollments table
CREATE TABLE public.enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  progress DECIMAL(5,2) NOT NULL DEFAULT 0,
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, course_id)
);

-- Create lesson_progress table
CREATE TABLE public.lesson_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, lesson_id)
);

-- Create orders table for course purchases
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method TEXT,
  payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for categories (public read access)
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);

-- RLS Policies for courses (public read access for published courses)
CREATE POLICY "Anyone can view published courses" ON public.courses FOR SELECT USING (is_published = true OR auth.uid() = instructor_id);
CREATE POLICY "Instructors can manage their courses" ON public.courses FOR ALL USING (auth.uid() = instructor_id);

-- RLS Policies for lessons (accessible to enrolled users)
CREATE POLICY "Anyone can view lessons of published courses" ON public.lessons 
FOR SELECT USING (
  is_published = true AND 
  EXISTS (
    SELECT 1 FROM public.courses 
    WHERE courses.id = lessons.course_id AND courses.is_published = true
  )
);

-- RLS Policies for enrollments
CREATE POLICY "Users can view their own enrollments" ON public.enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own enrollments" ON public.enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own enrollments" ON public.enrollments FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for lesson progress
CREATE POLICY "Users can view their own lesson progress" ON public.lesson_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own lesson progress" ON public.lesson_progress FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for orders
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for reviews
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can manage their own reviews" ON public.reviews FOR ALL USING (auth.uid() = user_id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON public.lessons FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample categories
INSERT INTO public.categories (name, description, icon) VALUES
  ('Agriculture', 'Modern farming techniques and sustainable agriculture practices', '🌾'),
  ('Technology', 'Digital literacy and technology skills for rural communities', '💻'),
  ('Business', 'Entrepreneurship and small business management', '💼'),
  ('Health', 'Community health and wellness programs', '🏥'),
  ('Education', 'Teaching methods and educational resources', '📚'),
  ('Environment', 'Environmental conservation and sustainability', '🌍');

-- Insert sample courses
INSERT INTO public.courses (title, description, category, level, duration, price, rating, students_count, is_published) VALUES
  (
    'Sustainable Farming Techniques',
    'Learn modern sustainable farming methods that increase yield while protecting the environment. This comprehensive course covers soil management, water conservation, and organic farming practices.',
    'Agriculture',
    'Beginner',
    '6 weeks',
    29.99,
    4.5,
    234,
    true
  ),
  (
    'Digital Marketing for Small Businesses',
    'Master the essentials of digital marketing to grow your small business. Learn social media marketing, email campaigns, and online advertising strategies.',
    'Business',
    'Intermediate',
    '8 weeks',
    49.99,
    4.7,
    156,
    true
  ),
  (
    'Water Conservation and Management',
    'Essential techniques for water conservation in rural communities. Learn about rainwater harvesting, efficient irrigation systems, and water quality management.',
    'Environment',
    'Beginner',
    '4 weeks',
    19.99,
    4.3,
    189,
    true
  ),
  (
    'Basic Computer Skills',
    'Introduction to computers and internet for beginners. Learn basic computer operations, internet browsing, and essential software applications.',
    'Technology',
    'Beginner',
    '5 weeks',
    24.99,
    4.4,
    312,
    true
  ),
  (
    'Community Health Basics',
    'Learn fundamental health practices for rural communities. Covers preventive care, nutrition, and basic first aid skills.',
    'Health',
    'Beginner',
    '6 weeks',
    34.99,
    4.6,
    278,
    true
  ),
  (
    'Starting Your Rural Business',
    'A complete guide to starting and managing a successful business in rural areas. Learn business planning, financing, and marketing strategies.',
    'Business',
    'Advanced',
    '10 weeks',
    79.99,
    4.8,
    145,
    true
  );

-- Insert sample lessons for the first course
INSERT INTO public.lessons (course_id, title, description, content_type, duration_minutes, order_index, content) 
SELECT 
  c.id,
  lesson_data.title,
  lesson_data.description,
  lesson_data.content_type,
  lesson_data.duration_minutes,
  lesson_data.order_index,
  lesson_data.content
FROM public.courses c,
(VALUES 
  ('Introduction to Sustainable Farming', 'Overview of sustainable farming principles and benefits', 'video', 15, 1, 'Welcome to sustainable farming! In this lesson, we will explore the fundamental principles of sustainable agriculture and how they can benefit both farmers and the environment.'),
  ('Soil Health and Management', 'Understanding soil composition and health indicators', 'text', 20, 2, 'Healthy soil is the foundation of sustainable farming. Learn about soil composition, pH levels, organic matter, and how to maintain soil health through proper management techniques.'),
  ('Composting Techniques', 'How to create and use compost effectively', 'video', 25, 3, 'Composting is a key component of sustainable farming. This lesson covers different composting methods, materials to use, and how to apply compost to improve soil fertility.'),
  ('Water Conservation Methods', 'Efficient water use in agriculture', 'text', 18, 4, 'Water is a precious resource. Learn various water conservation techniques including drip irrigation, mulching, and rainwater harvesting to optimize water use in your farming operations.'),
  ('Sustainable Farming Quiz', 'Test your knowledge of sustainable farming concepts', 'quiz', 10, 5, 'Test your understanding of the sustainable farming concepts covered in this course. This quiz covers soil health, composting, and water conservation.')
) AS lesson_data(title, description, content_type, duration_minutes, order_index, content)
WHERE c.title = 'Sustainable Farming Techniques';