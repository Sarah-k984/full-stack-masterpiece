import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Star, ArrowRight } from "lucide-react";

const courses = [
  {
    id: 1,
    title: "Digital Literacy Fundamentals",
    description: "Learn essential computer skills, internet navigation, and digital communication for rural communities.",
    duration: "6 weeks",
    students: 127,
    rating: 4.8,
    level: "Beginner",
    category: "Technology",
    image: "🖥️"
  },
  {
    id: 2,
    title: "Agricultural Technology",
    description: "Modern farming techniques using mobile apps, weather tracking, and digital market platforms.",
    duration: "8 weeks",
    students: 89,
    rating: 4.9,
    level: "Intermediate",
    category: "Agriculture",
    image: "🌾"
  },
  {
    id: 3,
    title: "Small Business Management",
    description: "Start and grow your business with digital tools, online marketing, and financial planning.",
    duration: "10 weeks",
    students: 156,
    rating: 4.7,
    level: "Beginner",
    category: "Business",
    image: "💼"
  },
  {
    id: 4,
    title: "Mobile Money & Finance",
    description: "Master mobile banking, digital payments, and financial literacy for rural entrepreneurs.",
    duration: "4 weeks",
    students: 203,
    rating: 4.9,
    level: "Beginner",
    category: "Finance",
    image: "📱"
  }
];

const FeaturedCourses = () => {
  return (
    <section className="py-16 bg-background" id="courses">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            Featured Courses
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Learn Skills That Matter
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our carefully curated courses are designed specifically for rural communities, 
            focusing on practical skills that create real opportunities.
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {courses.map((course) => (
            <Card key={course.id} className="group hover:shadow-card transition-all duration-300 border-border/50">
              <CardHeader className="pb-4">
                <div className="text-4xl mb-3">{course.image}</div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {course.category}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {course.level}
                  </Badge>
                </div>
                <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {course.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {course.duration}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {course.students}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-sm font-medium">{course.rating}</span>
                  </div>
                  <Button size="sm" variant="ghost" className="group/btn" onClick={() => window.location.href = `/course/${course.id}`}>
                    Learn More
                    <ArrowRight className="h-3 w-3 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button size="lg" className="bg-gradient-primary shadow-elegant" onClick={() => window.location.href = '/courses'}>
            View All Courses
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;