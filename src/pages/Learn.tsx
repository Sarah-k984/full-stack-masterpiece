import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  PlayCircle, 
  FileText,
  Video,
  HelpCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Course {
  id: string;
  title: string;
  description: string;
}

interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string;
  content_type: 'video' | 'text' | 'quiz';
  content: string;
  duration_minutes: number;
  order_index: number;
}

interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  completed_at?: string;
}

interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  progress: number;
}

const Learn = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [lessonProgress, setLessonProgress] = useState<LessonProgress[]>([]);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (courseId) {
      loadCourseData();
    }
  }, [courseId, user]);

  const loadCourseData = async () => {
    try {
      // Check enrollment
      const { data: enrollmentData, error: enrollmentError } = await supabase
        .from('enrollments')
        .select('*')
        .eq('user_id', user?.id)
        .eq('course_id', courseId)
        .single();

      if (enrollmentError) {
        toast({
          title: "Access Denied",
          description: "You need to enroll in this course first.",
          variant: "destructive",
        });
        navigate(`/course/${courseId}`);
        return;
      }

      setEnrollment(enrollmentData);

      // Load course
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('id, title, description')
        .eq('id', courseId)
        .single();

      if (courseError) {
        console.error('Error loading course:', courseError);
        return;
      }

      setCourse(courseData);

      // Load lessons
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index');

      if (lessonsError) {
        console.error('Error loading lessons:', lessonsError);
        return;
      }

      setLessons(lessonsData || []);

      // Load lesson progress
      const { data: progressData, error: progressError } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', user?.id)
        .in('lesson_id', (lessonsData || []).map(l => l.id));

      if (!progressError) {
        setLessonProgress(progressData || []);
      }

    } catch (error) {
      console.error('Error loading course data:', error);
    } finally {
      setLoading(false);
    }
  };

  const markLessonComplete = async (lessonId: string) => {
    if (!user) return;

    try {
      // Mark lesson as complete
      const { error: progressError } = await supabase
        .from('lesson_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          completed: true
        });

      if (progressError) {
        console.error('Error updating lesson progress:', progressError);
        return;
      }

      // Update local state
      setLessonProgress(prev => {
        const existing = prev.find(p => p.lesson_id === lessonId);
        if (existing) {
          return prev.map(p => 
            p.lesson_id === lessonId 
              ? { ...p, completed: true, completed_at: new Date().toISOString() }
              : p
          );
        } else {
          return [...prev, {
            id: crypto.randomUUID(),
            user_id: user.id,
            lesson_id: lessonId,
            completed: true,
            completed_at: new Date().toISOString()
          }];
        }
      });

      // Update overall course progress
      const completedCount = lessonProgress.filter(p => p.completed).length + 1;
      const totalLessons = lessons.length;
      const newProgress = (completedCount / totalLessons) * 100;

      const { error: enrollmentError } = await supabase
        .from('enrollments')
        .update({ 
          progress: newProgress,
          completed_at: newProgress === 100 ? new Date().toISOString() : null
        })
        .eq('id', enrollment?.id);

      if (!enrollmentError && enrollment) {
        setEnrollment({ ...enrollment, progress: newProgress });
      }

      toast({
        title: "Lesson Completed",
        description: "Great job! Keep up the excellent work.",
      });

    } catch (error) {
      console.error('Error marking lesson complete:', error);
    }
  };

  const nextLesson = () => {
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };

  const previousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };

  const isLessonCompleted = (lessonId: string) => {
    return lessonProgress.some(p => p.lesson_id === lessonId && p.completed);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course || lessons.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Course Not Available</h1>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const currentLesson = lessons[currentLessonIndex];
  const completedLessons = lessonProgress.filter(p => p.completed).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/dashboard')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <div>
                <h1 className="font-semibold">{course.title}</h1>
                <p className="text-sm text-muted-foreground">
                  Lesson {currentLessonIndex + 1} of {lessons.length}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground">
                {completedLessons}/{lessons.length} completed
              </div>
              <Progress 
                value={(completedLessons / lessons.length) * 100} 
                className="w-32"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Lesson List */}
        <div className="w-80 bg-card border-r h-screen overflow-y-auto">
          <div className="p-4">
            <h2 className="font-semibold mb-4">Course Content</h2>
            <div className="space-y-2">
              {lessons.map((lesson, index) => (
                <button
                  key={lesson.id}
                  onClick={() => setCurrentLessonIndex(index)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    index === currentLessonIndex
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {isLessonCompleted(lesson.id) ? (
                        <CheckCircle className="h-5 w-5 text-success" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-1 mb-1">
                        {lesson.content_type === 'video' && <Video className="h-3 w-3" />}
                        {lesson.content_type === 'text' && <FileText className="h-3 w-3" />}
                        {lesson.content_type === 'quiz' && <HelpCircle className="h-3 w-3" />}
                        <span className="text-xs font-medium">
                          {lesson.content_type.toUpperCase()}
                        </span>
                      </div>
                      <p className="font-medium text-sm truncate">{lesson.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {lesson.duration_minutes} min
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Lesson Header */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="outline">
                  {currentLesson.content_type.toUpperCase()}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {currentLesson.duration_minutes} minutes
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-2">{currentLesson.title}</h1>
              <p className="text-muted-foreground">{currentLesson.description}</p>
            </div>

            {/* Lesson Content */}
            <Card className="mb-6">
              <CardContent className="p-8">
                {currentLesson.content_type === 'video' && (
                  <div className="aspect-video bg-gradient-hero rounded-lg flex items-center justify-center mb-6">
                    <div className="text-center text-white">
                      <PlayCircle className="h-16 w-16 mx-auto mb-4" />
                      <p>Video content would be displayed here</p>
                      <p className="text-sm opacity-80">Duration: {currentLesson.duration_minutes} minutes</p>
                    </div>
                  </div>
                )}
                
                <div className="prose max-w-none">
                  <div className="whitespace-pre-line text-foreground">
                    {currentLesson.content || "Lesson content will be available here. This could include detailed explanations, examples, and practical exercises tailored for rural communities."}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={previousLesson}
                disabled={currentLessonIndex === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <div className="flex items-center space-x-4">
                {!isLessonCompleted(currentLesson.id) && (
                  <Button
                    onClick={() => markLessonComplete(currentLesson.id)}
                    className="bg-gradient-success"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Complete
                  </Button>
                )}

                <Button
                  onClick={nextLesson}
                  disabled={currentLessonIndex === lessons.length - 1}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn;