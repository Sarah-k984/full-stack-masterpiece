import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary-dark text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-white/10 p-2 rounded-lg">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Ujuzi Skills</h3>
                <p className="text-sm opacity-80">Empowering Rural Youths</p>
              </div>
            </div>
            <p className="text-sm opacity-80 mb-4">
              Bridging the digital divide through accessible, high-quality education 
              that transforms rural communities across East Africa.
            </p>
            <div className="flex space-x-3">
              <Button size="sm" variant="ghost" className="text-primary-foreground hover:bg-white/10">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-primary-foreground hover:bg-white/10">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-primary-foreground hover:bg-white/10">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-primary-foreground hover:bg-white/10">
                <Instagram className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#courses" className="opacity-80 hover:opacity-100 transition-opacity">All Courses</a></li>
              <li><a href="#about" className="opacity-80 hover:opacity-100 transition-opacity">About Us</a></li>
              <li><a href="#impact" className="opacity-80 hover:opacity-100 transition-opacity">Our Impact</a></li>
              <li><a href="#instructors" className="opacity-80 hover:opacity-100 transition-opacity">Instructors</a></li>
              <li><a href="#blog" className="opacity-80 hover:opacity-100 transition-opacity">Blog</a></li>
              <li><a href="#careers" className="opacity-80 hover:opacity-100 transition-opacity">Careers</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#help" className="opacity-80 hover:opacity-100 transition-opacity">Help Center</a></li>
              <li><a href="#faq" className="opacity-80 hover:opacity-100 transition-opacity">FAQ</a></li>
              <li><a href="#contact" className="opacity-80 hover:opacity-100 transition-opacity">Contact Us</a></li>
              <li><a href="#community" className="opacity-80 hover:opacity-100 transition-opacity">Community</a></li>
              <li><a href="#privacy" className="opacity-80 hover:opacity-100 transition-opacity">Privacy Policy</a></li>
              <li><a href="#terms" className="opacity-80 hover:opacity-100 transition-opacity">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">Stay Connected</h4>
            <div className="space-y-3 text-sm mb-4">
              <div className="flex items-center space-x-2 opacity-80">
                <Mail className="h-4 w-4" />
                <span>info@ujuziskills.org</span>
              </div>
              <div className="flex items-center space-x-2 opacity-80">
                <Phone className="h-4 w-4" />
                <span>+254 700 123 456</span>
              </div>
              <div className="flex items-center space-x-2 opacity-80">
                <MapPin className="h-4 w-4" />
                <span>Nairobi, Kenya</span>
              </div>
            </div>
            
            <div>
              <p className="text-sm opacity-80 mb-2">Subscribe to our newsletter</p>
              <div className="flex gap-2">
                <Input 
                  placeholder="Your email"
                  className="bg-white/10 border-white/20 text-primary-foreground placeholder:text-white/60"
                />
                <Button size="sm" variant="secondary">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm opacity-80 mb-4 md:mb-0">
            © 2024 Ujuzi Skills. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <a href="#accessibility" className="opacity-80 hover:opacity-100 transition-opacity">
              Accessibility
            </a>
            <a href="#sitemap" className="opacity-80 hover:opacity-100 transition-opacity">
              Sitemap
            </a>
            <a href="#cookies" className="opacity-80 hover:opacity-100 transition-opacity">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;