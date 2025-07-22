import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Trophy, 
  Clock, 
  TrendingUp, 
  PlayCircle, 
  CheckCircle,
  Star,
  Calendar,
  User,
  Award
} from 'lucide-react';

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  total_courses_completed: number;
  total_certificates: number;
  points_earned: number;
  created_at: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  category: string;
  image_url?: string;
}

interface Enrollment {
  id: string;
  course_id: string;
  progress: number;
  enrolled_at: string;
  completed_at?: string;
  course: Course;
}

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [stats, setStats] = useState({
    inProgress: 0,
    completed: 0,
    totalHours: 0,
    avgProgress: 0
  });

  useEffect(() => {
    if (user) {
      loadProfile();
      loadEnrollments();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadEnrollments = async () => {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          course:courses(*)
        `)
        .eq('user_id', user?.id)
        .order('enrolled_at', { ascending: false });

      if (error) {
        console.error('Error loading enrollments:', error);
        return;
      }

      setEnrollments(data || []);
      
      // Calculate stats
      const inProgress = data?.filter(e => !e.completed_at && e.progress > 0).length || 0;
      const completed = data?.filter(e => e.completed_at).length || 0;
      const totalProgress = data?.reduce((sum, e) => sum + (e.progress || 0), 0) || 0;
      const avgProgress = data?.length ? totalProgress / data.length : 0;

      setStats({
        inProgress,
        completed,
        totalHours: completed * 8, // Estimated hours
        avgProgress
      });
    } catch (error) {
      console.error('Error loading enrollments:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    window.location.href = '/auth';
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-gradient-primary w-16 h-16 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Welcome back, {profile?.first_name || user.email?.split('@')[0]}!
              </h1>
              <p className="text-muted-foreground">
                Continue your learning journey with Ujuzi Skills
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-primary text-primary-foreground">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80 text-sm">Courses in Progress</p>
                  <p className="text-3xl font-bold">{stats.inProgress}</p>
                </div>
                <BookOpen className="h-8 w-8 text-primary-foreground/80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-success text-success-foreground">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-success-foreground/80 text-sm">Completed</p>
                  <p className="text-3xl font-bold">{stats.completed}</p>
                </div>
                <Trophy className="h-8 w-8 text-success-foreground/80" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Learning Hours</p>
                  <p className="text-3xl font-bold text-foreground">{stats.totalHours}</p>
                </div>
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Avg Progress</p>
                  <p className="text-3xl font-bold text-foreground">{Math.round(stats.avgProgress)}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-6">
            {enrollments.length === 0 ? (
              <Card className="text-center p-8">
                <CardContent>
                  <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Courses Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start your learning journey by enrolling in your first course
                  </p>
                  <Button onClick={() => window.location.href = '/courses'}>
                    Browse Courses
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrollments.map((enrollment) => (
                  <Card key={enrollment.id} className="group hover:shadow-card transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {enrollment.course.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {enrollment.course.level}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg line-clamp-2">
                        {enrollment.course.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {enrollment.course.description}
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{Math.round(enrollment.progress || 0)}%</span>
                        </div>
                        <Progress value={enrollment.progress || 0} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between">
                        {enrollment.completed_at ? (
                          <Badge variant="outline" className="text-success">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            <Clock className="h-3 w-3 mr-1" />
                            {enrollment.course.duration}
                          </Badge>
                        )}
                        
                        <Button size="sm" variant="ghost">
                          <PlayCircle className="h-4 w-4 mr-1" />
                          Continue
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Learning Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {enrollments.map((enrollment) => (
                    <div key={enrollment.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{enrollment.course.title}</h4>
                        <span className="text-sm text-muted-foreground">
                          {Math.round(enrollment.progress || 0)}%
                        </span>
                      </div>
                      <Progress value={enrollment.progress || 0} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Started {new Date(enrollment.enrolled_at).toLocaleDateString()}</span>
                        <span>{enrollment.course.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="text-center p-6">
                <CardContent className="p-0">
                  <div className="bg-gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">First Course</h3>
                  <p className="text-sm text-muted-foreground">Complete your first course</p>
                  {stats.completed > 0 ? (
                    <Badge className="mt-2">Achieved</Badge>
                  ) : (
                    <Badge variant="outline" className="mt-2">In Progress</Badge>
                  )}
                </CardContent>
              </Card>

              <Card className="text-center p-6">
                <CardContent className="p-0">
                  <div className="bg-gradient-success w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="h-8 w-8 text-success-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">Course Champion</h3>
                  <p className="text-sm text-muted-foreground">Complete 5 courses</p>
                  {stats.completed >= 5 ? (
                    <Badge className="mt-2">Achieved</Badge>
                  ) : (
                    <Badge variant="outline" className="mt-2">{stats.completed}/5</Badge>
                  )}
                </CardContent>
              </Card>

              <Card className="text-center p-6">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-br from-orange-400 to-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Learning Streak</h3>
                  <p className="text-sm text-muted-foreground">Learn for 7 days straight</p>
                  <Badge variant="outline" className="mt-2">Coming Soon</Badge>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;