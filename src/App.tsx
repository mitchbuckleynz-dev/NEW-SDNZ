/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  Shield, 
  Building2, 
  FileText, 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  Menu, 
  X, 
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Clock,
  Briefcase
} from 'lucide-react';

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2">
              <Flame className="text-white w-6 h-6" />
            </div>
            <span className={`text-xl font-bold tracking-tight ${isScrolled ? 'text-text-primary' : 'text-white'}`}>
              Sprinkler<span className="text-primary">Design</span><span className="ml-1 text-xs uppercase tracking-widest opacity-70">NZ</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${isScrolled ? 'text-gray-600' : 'text-white/90'}`}
              >
                {link.name}
              </a>
            ))}
            <a
              href="#contact"
              className="bg-primary hover:opacity-90 text-white px-6 py-3 text-sm font-bold transition-all transform hover:scale-105 shadow-lg shadow-primary/20"
            >
              Get a Quote
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`${isScrolled ? 'text-gray-900' : 'text-white'}`}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-4 text-base font-medium text-text-primary hover:text-primary hover:bg-gray-50 transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4">
                <a
                  href="#contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center bg-primary text-white px-5 py-3 font-bold"
                >
                  Get a Quote
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-gray-900">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=2000"
          alt="Modern Construction"
          className="w-full h-full object-cover opacity-40"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
              <Shield className="w-3 h-3" />
              Trusted Fire Protection Experts
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
              Igniting Excellence in <span className="text-primary">Fire Protection</span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl">
              Unleashing the power of BIM. We provide top-notch fire protection design and consulting services tailored to your unique needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#services"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:opacity-90 text-white px-10 py-5 font-bold text-lg transition-all transform hover:scale-105 shadow-xl shadow-primary/20"
              >
                Our Services
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="#projects"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-10 py-5 font-bold text-lg transition-all"
              >
                View Projects
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-8"
          >
            <div>
              <p className="text-3xl font-bold text-white mb-1">20+</p>
              <p className="text-sm text-gray-400 uppercase tracking-wider">Years Experience</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white mb-1">500+</p>
              <p className="text-sm text-gray-400 uppercase tracking-wider">Projects Completed</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white mb-1">100%</p>
              <p className="text-sm text-gray-400 uppercase tracking-wider">Compliance Rate</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white mb-1">24/7</p>
              <p className="text-sm text-gray-400 uppercase tracking-wider">Consulting Support</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  const services = [
    {
      title: 'BIM Fire Protection Design',
      description: 'Comprehensive 3D modeling and design services using cutting-edge BIM technology for maximum efficiency.',
      icon: Building2,
      color: 'bg-blue-500',
    },
    {
      title: 'Professional Consulting',
      description: 'Expert advice and strategic planning for fire safety systems, ensuring code compliance and safety.',
      icon: Users,
      color: 'bg-primary',
    },
    {
      title: 'BIM Coordination',
      description: 'Seamless integration with other building services to eliminate clashes and optimize installation.',
      icon: Shield,
      color: 'bg-green-600',
    },
    {
      title: 'Construction Documentation',
      description: 'Detailed drawings and specifications that meet all regulatory standards for smooth project execution.',
      icon: FileText,
      color: 'bg-text-primary',
    },
  ];

  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-3">What We Do</h2>
          <h3 className="text-4xl md:text-5xl font-black text-text-primary mb-6">Comprehensive Fire Solutions</h3>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We provide a full suite of fire protection services, from initial concept to final documentation, leveraging the latest in BIM technology.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-8 bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500"
            >
              <div className={`w-14 h-14 ${service.color} flex items-center justify-center mb-6 transform group-hover:rotate-6 transition-transform`}>
                <service.icon className="text-white w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-text-primary mb-4">{service.title}</h4>
              <p className="text-gray-600 leading-relaxed mb-6">
                {service.description}
              </p>
              <a href="#contact" className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:gap-3 transition-all">
                Learn More <ChevronRight className="w-4 h-4" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const About = () => {
  return (
    <section id="about" className="py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative z-10 overflow-hidden shadow-2xl"
            >
              <img
                src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=1000"
                alt="BIM Engineering"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-primary -z-0" />
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-gray-200 -z-0" />
            
            <div className="absolute bottom-8 left-8 bg-white p-6 shadow-xl z-20 max-w-[200px]">
              <p className="text-4xl font-black text-primary mb-1">20+</p>
              <p className="text-sm font-bold text-text-primary uppercase tracking-wider">Years of Industry Expertise</p>
            </div>
          </div>

          <div>
            <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-3">About Us</h2>
            <h3 className="text-4xl md:text-5xl font-black text-text-primary mb-8 leading-tight">
              Your Reliable Partner for Exceptional BIM Design
            </h3>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              With decades of industry expertise, Sprinkler Design provides comprehensive solutions including professional consulting, BIM coordination, and construction documentation.
            </p>
            
            <div className="space-y-4 mb-10">
              {[
                'High-quality, efficient fire protection services',
                'Cost-effective solutions tailored to your needs',
                'Decades of deep industry knowledge',
                'Advanced BIM coordination & clash detection'
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="text-primary w-6 h-6 flex-shrink-0" />
                  <span className="text-gray-800 font-medium">{item}</span>
                </div>
              ))}
            </div>

            <button className="bg-text-primary hover:opacity-90 text-white px-10 py-5 font-bold transition-all shadow-lg shadow-text-primary/20">
              Learn More About Our Story
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const Projects = () => {
  const projects = [
    {
      title: 'Auckland Commercial Hub',
      category: 'Commercial',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
    },
    {
      title: 'Wellington Logistics Center',
      category: 'Industrial',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800',
    },
    {
      title: 'Christchurch Medical Plaza',
      category: 'Healthcare',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
    },
  ];

  return (
    <section id="projects" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-3">Our Work</h2>
            <h3 className="text-4xl md:text-5xl font-black text-text-primary">Showcasing Our Latest Projects</h3>
          </div>
          <button className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all">
            View All Projects <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden aspect-[4/5]"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-text-primary via-text-primary/20 to-transparent opacity-80" />
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <span className="text-primary text-xs font-bold uppercase tracking-widest mb-2 block">
                  {project.category}
                </span>
                <h4 className="text-2xl font-bold text-white mb-4">{project.title}</h4>
                <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-4 py-2 text-sm font-semibold transition-all">
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-text-primary relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 transform translate-x-1/4" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-3">Contact Us</h2>
            <h3 className="text-4xl md:text-5xl font-black text-white mb-8">Let's Discuss Your Next Project</h3>
            <p className="text-xl text-gray-400 mb-12">
              Ready to elevate your fire protection design? Get in touch with our experts today for a consultation.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="bg-white/5 p-4 border border-white/10">
                  <Phone className="text-primary w-6 h-6" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Call Us</p>
                  <p className="text-xl font-bold text-white">+64 (0) 21 123 4567</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="bg-white/5 p-4 border border-white/10">
                  <Mail className="text-primary w-6 h-6" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Email Us</p>
                  <p className="text-xl font-bold text-white">info@sprinklerdesign.co.nz</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="bg-white/5 p-4 border border-white/10">
                  <MapPin className="text-primary w-6 h-6" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Location</p>
                  <p className="text-xl font-bold text-white">Auckland, New Zealand</p>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 md:p-12 shadow-2xl"
          >
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-primary">Full Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-primary">Email Address</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-primary">Subject</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="Project Inquiry"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-primary">Message</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                  placeholder="Tell us about your project..."
                />
              </div>
              <button className="w-full bg-primary hover:opacity-90 text-white py-4 font-bold text-lg transition-all shadow-lg shadow-primary/20">
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="bg-primary p-2">
                <Flame className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight">
                Sprinkler<span className="text-primary">Design</span><span className="ml-1 text-xs uppercase tracking-widest opacity-70">NZ</span>
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Leading the way in BIM-driven fire protection design and consulting across New Zealand. Decades of expertise at your service.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {['Home', 'Services', 'About', 'Projects', 'Contact'].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase()}`} className="text-gray-400 hover:text-primary transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Services</h4>
            <ul className="space-y-4">
              {['BIM Design', 'Consulting', 'Coordination', 'Documentation'].map((service) => (
                <li key={service}>
                  <a href="#services" className="text-gray-400 hover:text-primary transition-colors">
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Newsletter</h4>
            <p className="text-gray-400 mb-6">Stay updated with the latest in fire protection technology.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email address"
                className="bg-white/5 border border-white/10 px-4 py-2 outline-none focus:border-primary flex-grow"
              />
              <button className="bg-primary p-2 hover:opacity-90 transition-colors">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Sprinkler Design Ltd. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-primary/10 selection:text-primary">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <About />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
