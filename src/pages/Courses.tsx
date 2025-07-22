import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Users, Star, ArrowRight, Search, Filter } from "lucide-react";

const allCourses = [
  {
    id: 1,
    title: "Digital Literacy Fundamentals",
    description: "Learn essential computer skills, internet navigation, and digital communication for rural communities.",
    duration: "6 weeks",
    students: 127,
    rating: 4.8,
    level: "Beginner",
    category: "Technology",
    image: "🖥️",
    price: "Free"
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
    image: "🌾",
    price: "Free"
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
    image: "💼",
    price: "Free"
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
    image: "📱",
    price: "Free"
  },
  {
    id: 5,
    title: "Social Media Marketing",
    description: "Learn to promote your business using Facebook, WhatsApp, and other social platforms.",
    duration: "5 weeks",
    students: 134,
    rating: 4.6,
    level: "Beginner",
    category: "Marketing",
    image: "📢",
    price: "Free"
  },
  {
    id: 6,
    title: "Basic Web Development",
    description: "Create simple websites and understand how the internet works.",
    duration: "12 weeks",
    students: 78,
    rating: 4.8,
    level: "Intermediate",
    category: "Technology",
    image: "🌐",
    price: "Free"
  },
  {
    id: 7,
    title: "Health & Safety Education",
    description: "Digital health resources, first aid basics, and community health management.",
    duration: "6 weeks",
    students: 165,
    rating: 4.7,
    level: "Beginner",
    category: "Health",
    image: "🏥",
    price: "Free"
  },
  {
    id: 8,
    title: "English Communication Skills",
    description: "Improve your English for better job opportunities and global communication.",
    duration: "8 weeks",
    students: 245,
    rating: 4.9,
    level: "Beginner",
    category: "Language",
    image: "🗣️",
    price: "Free"
  }
];

const Courses = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              All Courses
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Discover skills that will transform your future. All courses are designed 
              specifically for rural communities and completely free to access.
            </p>
          </div>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="py-8 bg-accent/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search courses..." 
                  className="pl-10 w-full sm:w-80"
                />
              </div>
              <Select>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="agriculture">Agriculture</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="language">Language</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span>{allCourses.length} courses available</span>
            </div>
          </div>
        </div>
      </section>

      {/* Course Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allCourses.map((course) => (
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
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm font-medium">{course.rating}</span>
                    </div>
                    <Badge variant="outline" className="text-success font-medium">
                      {course.price}
                    </Badge>
                  </div>

                  <Button 
                    className="w-full bg-gradient-primary shadow-elegant group/btn"
                    onClick={() => window.location.href = `/course/${course.id}`}
                  >
                    View Course
                    <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Courses;