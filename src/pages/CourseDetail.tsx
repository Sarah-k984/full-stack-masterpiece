import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  PlayCircle, 
  Clock, 
  Users, 
  Star, 
  BookOpen, 
  CheckCircle,
  Award,
  ArrowLeft,
  FileText,
  Video
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Course {
  id: string;
  title: string;
  description: string;
  long_description?: string;
  duration: string;
  level: string;
  category: string;
  image_url?: string;
  instructor: string;
  rating: number;
  student_count: number;
  is_free: boolean;
  price?: number;
  created_at: string;
}

interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string;
  content_type: 'video' | 'text' | 'quiz';
  duration_minutes: number;
  order_index: number;
  is_free_preview: boolean;
}

interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  progress: number;
  enrolled_at: string;
  completed_at?: string;
}

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (id) {
      loadCourseData();
    }
  }, [id, user]);

  const loadCourseData = async () => {
    try {
      // Load course details
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();

      if (courseError) {
        console.error('Error loading course:', courseError);
        toast({
          title: "Error",
          description: "Course not found",
          variant: "destructive",
        });
        navigate('/courses');
        return;
      }

      setCourse(courseData);

      // Load lessons
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', id)
        .order('order_index');

      if (lessonsError) {
        console.error('Error loading lessons:', lessonsError);
      } else {
        setLessons(lessonsData || []);
      }

      // Check enrollment status if user is logged in
      if (user) {
        const { data: enrollmentData, error: enrollmentError } = await supabase
          .from('enrollments')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', id)
          .single();

        if (enrollmentError && enrollmentError.code !== 'PGRST116') {
          console.error('Error loading enrollment:', enrollmentError);
        } else {
          setEnrollment(enrollmentData);
        }
      }
    } catch (error) {
      console.error('Error loading course data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to enroll in courses",
      });
      navigate('/auth');
      return;
    }

    if (enrollment) {
      // Already enrolled, go to course
      navigate(`/learn/${course?.id}`);
      return;
    }

    setEnrolling(true);
    try {
      const { error } = await supabase
        .from('enrollments')
        .insert({
          user_id: user.id,
          course_id: course?.id,
          progress: 0
        });

      if (error) {
        console.error('Error enrolling:', error);
        toast({
          title: "Enrollment Error",
          description: "Failed to enroll in course. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Enrolled Successfully",
          description: "You have been enrolled in this course!",
        });
        // Reload to update enrollment status
        loadCourseData();
      }
    } catch (error) {
      console.error('Error enrolling:', error);
      toast({
        title: "Enrollment Error",
        description: "Failed to enroll in course. Please try again.",
        variant: "destructive",
      });
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading course details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
          <Button onClick={() => navigate('/courses')}>
            Back to Courses
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const totalDuration = lessons.reduce((sum, lesson) => sum + lesson.duration_minutes, 0);
  const completedLessons = 0; // TODO: Implement lesson progress tracking

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/courses')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Header */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center space-x-4 mb-4">
                  <Badge variant="secondary">{course.category}</Badge>
                  <Badge variant="outline">{course.level}</Badge>
                  {course.is_free && (
                    <Badge className="bg-gradient-success">Free</Badge>
                  )}
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
                <p className="text-lg text-muted-foreground mb-6">{course.description}</p>
                
                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {course.duration}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {course.student_count} students
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-500" />
                    {course.rating}
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    {lessons.length} lessons
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Content Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle>About This Course</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {course.long_description || course.description}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="curriculum">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Curriculum</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {lessons.length} lessons • {Math.round(totalDuration / 60)} hours total
                    </p>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {lessons.map((lesson, index) => (
                        <AccordionItem key={lesson.id} value={`lesson-${index}`}>
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center space-x-3 text-left">
                              <div className="flex-shrink-0 w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  {lesson.content_type === 'video' && <Video className="h-4 w-4" />}
                                  {lesson.content_type === 'text' && <FileText className="h-4 w-4" />}
                                  {lesson.content_type === 'quiz' && <CheckCircle className="h-4 w-4" />}
                                  <span className="font-medium">{lesson.title}</span>
                                  {lesson.is_free_preview && (
                                    <Badge variant="outline" className="text-xs">Free Preview</Badge>
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {lesson.duration_minutes} minutes
                                </div>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="pl-11">
                              <p className="text-muted-foreground">{lesson.description}</p>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="instructor">
                <Card>
                  <CardHeader>
                    <CardTitle>Instructor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="bg-gradient-primary w-12 h-12 rounded-full flex items-center justify-center text-primary-foreground font-bold">
                        {course.instructor.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{course.instructor}</h3>
                        <p className="text-sm text-muted-foreground">Course Instructor</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      Experienced educator specializing in rural community development and digital literacy.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enrollment Card */}
            <Card className="sticky top-6">
              <CardContent className="p-6">
                {enrollment && (
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Your Progress</span>
                      <span>{Math.round(enrollment.progress)}%</span>
                    </div>
                    <Progress value={enrollment.progress} className="h-2 mb-4" />
                    <div className="text-sm text-muted-foreground">
                      {completedLessons} of {lessons.length} lessons completed
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {enrollment ? (
                    <Button 
                      className="w-full bg-gradient-primary shadow-elegant"
                      onClick={() => navigate(`/learn/${course.id}`)}
                    >
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Continue Learning
                    </Button>
                  ) : (
                    <Button 
                      className="w-full bg-gradient-primary shadow-elegant"
                      onClick={handleEnroll}
                      disabled={enrolling}
                    >
                      {enrolling ? 'Enrolling...' : 'Enroll Now'}
                    </Button>
                  )}

                  {course.is_free && (
                    <p className="text-center text-sm text-success font-medium">
                      This course is completely free!
                    </p>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">{course.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Level</span>
                    <span className="font-medium">{course.level}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Category</span>
                    <span className="font-medium">{course.category}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Certificate</span>
                    <div className="flex items-center">
                      <Award className="h-4 w-4 mr-1 text-success" />
                      <span className="font-medium">Included</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Features */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What You'll Learn</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-success mr-2 mt-0.5 flex-shrink-0" />
                    <span>Practical skills applicable to rural contexts</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-success mr-2 mt-0.5 flex-shrink-0" />
                    <span>Step-by-step guidance and examples</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-success mr-2 mt-0.5 flex-shrink-0" />
                    <span>Certificate of completion</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-success mr-2 mt-0.5 flex-shrink-0" />
                    <span>Lifetime access to course materials</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CourseDetail;