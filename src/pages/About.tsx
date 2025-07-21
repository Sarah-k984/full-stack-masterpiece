import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Target, Eye, Users, ArrowRight } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <Badge variant="outline" className="mb-4 border-white/30 text-white">
              About Ujuzi Skills
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Empowering Rural Communities Through Digital Education
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
              We believe that geography should never limit potential. Ujuzi Skills bridges 
              the digital divide by bringing world-class education directly to rural communities.
            </p>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="text-center p-8 border-border/50">
              <CardContent className="p-0">
                <div className="bg-gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-4">Our Mission</h3>
                <p className="text-muted-foreground">
                  To democratize access to quality digital education, empowering rural youths 
                  with practical skills that create real economic opportunities and transform communities.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 border-border/50">
              <CardContent className="p-0">
                <div className="bg-gradient-success w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Eye className="h-8 w-8 text-success-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-4">Our Vision</h3>
                <p className="text-muted-foreground">
                  A future where every rural youth has access to the digital skills needed to 
                  thrive in the modern economy, regardless of their geographical location.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 border-border/50">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-orange-400 to-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Our Values</h3>
                <p className="text-muted-foreground">
                  Accessibility, Quality, Community Impact, Cultural Sensitivity, 
                  and Sustainable Development guide everything we do.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-accent/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Story</h2>
              <p className="text-lg text-muted-foreground">
                Born from a vision to bridge the digital divide in rural Africa
              </p>
            </div>

            <div className="prose prose-lg max-w-none">
              <div className="text-muted-foreground space-y-6">
                <p>
                  Ujuzi Skills was founded in 2023 when our team recognized a critical gap: 
                  while urban areas were rapidly adopting digital technologies, rural communities 
                  were being left behind, not due to lack of interest or capability, but due to 
                  lack of access to relevant, affordable education.
                </p>
                
                <p>
                  Our founders, who grew up in rural Kenya, understood firsthand the challenges 
                  faced by young people in remote areas. Despite having the same dreams and 
                  ambitions as their urban counterparts, they lacked access to the digital 
                  skills that were becoming essential for economic participation.
                </p>
                
                <p>
                  Today, Ujuzi Skills has grown into a platform that serves thousands of students 
                  across Kenya, Uganda, and Tanzania. We've partnered with local community centers, 
                  schools, and organizations to ensure our education reaches even the most remote areas.
                </p>
                
                <p>
                  Every course we create is designed with rural contexts in mind - from considering 
                  limited internet connectivity to ensuring cultural relevance and practical applicability 
                  in rural economies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Passionate educators, technologists, and community leaders working together 
              to make quality education accessible to all.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Sarah Kamau", role: "Founder & CEO", avatar: "👩🏿", bio: "Former rural teacher with 10+ years in education" },
              { name: "James Ochieng", role: "CTO", avatar: "👨🏿", bio: "Tech entrepreneur focused on accessible solutions" },
              { name: "Grace Nakato", role: "Head of Curriculum", avatar: "👩🏿‍🦱", bio: "Educational designer specializing in rural contexts" },
              { name: "David Mwangi", role: "Community Outreach", avatar: "👨🏿‍🦲", bio: "Community organizer connecting rural areas" }
            ].map((member, index) => (
              <Card key={index} className="text-center p-6 border-border/50">
                <CardContent className="p-0">
                  <div className="text-6xl mb-4">{member.avatar}</div>
                  <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-2">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Join Our Mission
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Whether you're a student ready to learn, an educator wanting to teach, 
              or a partner looking to make a difference - we welcome you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                <Users className="mr-2 h-4 w-4" />
                Become a Student
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10"
              >
                Partner With Us
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;