import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, MapPin, Award } from "lucide-react";

const stats = [
  {
    icon: Users,
    number: "2,500+",
    label: "Students Empowered",
    description: "Rural youths gaining digital skills"
  },
  {
    icon: MapPin,
    number: "45",
    label: "Communities Reached",
    description: "Across Kenya, Uganda, and Tanzania"
  },
  {
    icon: Award,
    number: "1,200+",
    label: "Certificates Issued",
    description: "Recognized skills and achievements"
  },
  {
    icon: TrendingUp,
    number: "78%",
    label: "Income Increase",
    description: "Average improvement after completion"
  }
];

const testimonials = [
  {
    name: "Grace Wanjiku",
    location: "Nakuru, Kenya",
    course: "Digital Literacy",
    quote: "Ujuzi Skills changed my life! I now run my own online business selling crafts to customers worldwide.",
    avatar: "👩🏿"
  },
  {
    name: "Joseph Mukasa",
    location: "Kampala, Uganda", 
    course: "Agricultural Technology",
    quote: "Using weather apps and market platforms, I've increased my farm yield by 40% and found better buyers.",
    avatar: "👨🏿"
  },
  {
    name: "Amina Hassan",
    location: "Arusha, Tanzania",
    course: "Mobile Money",
    quote: "I learned to manage my finances digitally and started a savings group in my village. Now 20 families benefit!",
    avatar: "👩🏿‍🦱"
  }
];

const Impact = () => {
  return (
    <section className="py-16 bg-accent/30" id="impact">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            Our Impact
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Transforming Rural Communities
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every student who learns with Ujuzi Skills becomes a catalyst for change in their community.
            See the real impact we're making together.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center p-6 bg-background border-border/50">
              <CardContent className="p-0">
                <div className="bg-gradient-primary w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">{stat.number}</div>
                <div className="font-semibold text-foreground mb-1">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonials */}
        <div>
          <h3 className="text-2xl font-bold text-center mb-8">Student Success Stories</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 bg-background border-border/50">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <div className="text-3xl mr-3">{testimonial.avatar}</div>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {testimonial.course}
                      </Badge>
                    </div>
                  </div>
                  <blockquote className="text-muted-foreground italic">
                    "{testimonial.quote}"
                  </blockquote>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Impact;