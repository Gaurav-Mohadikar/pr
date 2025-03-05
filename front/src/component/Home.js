import React, { useState, useEffect } from 'react';
import { Menu, X, TextSelection as PipeSection, ArrowRight, Shield, Truck, Award, History, Users, Factory, Mail, Phone, MapPin, ChevronLeft, ChevronRight, Star, ShoppingCart, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import {Link} from 'react-router-dom'


function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const carouselSlides = [
    {
      image: "https://i.pinimg.com/736x/e0/6a/6b/e06a6be2e7f90910fc9a9868f05cee78.jpg",
      title: "Premium Industrial Pipes",
      subtitle: "Engineered for Excellence"
    },
    {
      image: "https://i.pinimg.com/736x/a5/c5/68/a5c568770bc70207c2916d64dd145a1e.jpg",
      title: "Advanced Manufacturing",
      subtitle: "State-of-the-art Production"
    },
    {
      image: "https://i.pinimg.com/736x/b9/2b/da/b92bdab8f912a9af9327f18bb4110929.jpg",
      title: "Quality Assurance",
      subtitle: "Meeting Global Standards"
    }
  ];

  const products = [
    {
      name: "Industrial Steel Pipe",
      category: "Steel Pipes",
      price: 299,
    //   rating: 4.8,
      image: "https://i.pinimg.com/736x/2e/86/0f/2e860f8a90de163689dff4a81f4ffe08.jpg"
    },
    {
      name: "PVC Pressure Pipe",
      category: "PVC Pipes",
      price: 149,
    //   rating: 4.5,
      image: "https://i.pinimg.com/736x/0d/a8/70/0da870cb6a6b83025559e26d6ad37fd1.jpg"
    },
    {
      name: "Copper Fitting Set",
      category: "Fittings",
      price: 89,
    //   rating: 4.7,
      image: "https://i.pinimg.com/736x/d4/3f/82/d43f82e34754f148736310f8396de89d.jpg"
    },
    {
      name: "HDPE Water Pipe",
      category: "HDPE Pipes",
      price: 199,
    //   rating: 4.6,
      image: "https://i.pinimg.com/736x/4a/7b/c5/4a7bc531b98d7571b5cf731645b9265d.jpg"
    },
    {
        name: "Industrial Steel Pipe",
        category: "Steel Pipes",
        price: 299,
      //   rating: 4.8,
        image: "https://i.pinimg.com/736x/2e/86/0f/2e860f8a90de163689dff4a81f4ffe08.jpg"
      },
      {
        name: "PVC Pressure Pipe",
        category: "PVC Pipes",
        price: 149,
      //   rating: 4.5,
        image: "https://i.pinimg.com/736x/0d/a8/70/0da870cb6a6b83025559e26d6ad37fd1.jpg"
      },
      {
        name: "Copper Fitting Set",
        category: "Fittings",
        price: 89,
      //   rating: 4.7,
        image: "https://i.pinimg.com/736x/d4/3f/82/d43f82e34754f148736310f8396de89d.jpg"
      },
      {
        name: "HDPE Water Pipe",
        category: "HDPE Pipes",
        price: 199,
      //   rating: 4.6,
        image: "https://i.pinimg.com/736x/4a/7b/c5/4a7bc531b98d7571b5cf731645b9265d.jpg"
      },
    
  ];

  const testimonials = [
    {
      name: "John Smith",
      position: "Construction Manager",
      company: "BuildTech Solutions",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80",
      text: "The quality of PipeMaster Pro's products is unmatched. Their industrial steel pipes have significantly improved our construction efficiency.",
      rating: 5
    },
    {
      name: "Sarah Johnson",
      position: "Project Director",
      company: "Industrial Dynamics",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80",
      text: "Outstanding service and product quality. The technical support team is incredibly knowledgeable and always ready to help.",
      rating: 5
    },
    {
      name: "Michael Chen",
      position: "Facility Manager",
      company: "Global Manufacturing Inc.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80",
      text: "We've been using PipeMaster Pro for all our industrial piping needs. Their products are reliable and meet all industry standards.",
      rating: 5
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const testimonialTimer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(testimonialTimer);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
      setIsMenuOpen(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-slate-900 text-white fixed w-full z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-2">
              <PipeSection className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold">PipeMaster Pro</span>
            </div>
            
            <div className="hidden md:flex space-x-8">
              {['home', 'products', 'testimonials', 'about', 'contact'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`capitalize hover:text-blue-400 transition-colors ${
                    activeSection === section ? 'text-blue-400' : ''
                  }`}
                >
                  {section}
                </button>
              ))}
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to='/login' className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-6 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 shadow-lg">
                <span>Login</span>
              </Link>
              
              <button
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-800 p-4">
            {['home', 'products', 'testimonials', 'about', 'contact'].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className="block w-full text-left py-2 px-4 hover:bg-slate-700 rounded capitalize"
              >
                {section}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Hero Section with Carousel */}
      <section id="home" className="h-screen relative overflow-hidden">
        <div className="absolute inset-0 transition-transform duration-1000 ease-out flex"
             style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {carouselSlides.map((slide, index) => (
            <div
              key={index}
              className="w-full h-full flex-shrink-0 bg-cover bg-center relative"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50">
                <div className="container mx-auto px-4 h-full flex items-center">
                  <div className="max-w-3xl text-white">
                    <h1 className="text-6xl font-bold mb-6 animate-fade-in">{slide.title}</h1>
                    <p className="text-2xl mb-8">{slide.subtitle}</p>
                    <button
                      onClick={() => scrollToSection('products')}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-8 py-4 rounded-lg flex items-center space-x-3 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <span className="text-lg">Explore Products</span>
                      <ArrowRight className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Carousel Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition-all duration-300"
        >
          <ChevronLeft className="h-8 w-8 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition-all duration-300"
        >
          <ChevronRight className="h-8 w-8 text-white" />
        </button>
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index ? 'bg-white scale-125' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Our Products</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Discover our premium range of industrial pipes and fittings, engineered to meet the highest standards of quality and durability.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300">
                <div className="h-48 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="text-sm text-blue-500 font-semibold mb-2">{product.category}</div>
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      {/* <Star className="h-5 w-5 text-yellow-400 fill-current" /> */}
                      {/* <span className="ml-1 text-gray-600">{product.rating}</span> */}
                    </div>
                    <span className="text-xl font-bold">₹{product.price}</span>
                  </div>
                  {/* <button className="w-full bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center space-x-2">
                    <ShoppingCart className="h-5 w-5" />
                    <span>Add to Cart</span>
                  </button> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-blue-500 opacity-5 transform -skew-y-6"></div>
        </div>
        <div className="container mx-auto px-4 relative">
          <h2 className="text-4xl font-bold text-center mb-4">What Our Clients Say</h2>
          <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what industry professionals have to say about our products and services.
          </p>
          
          <div className="relative">
            <div className="flex transition-transform duration-700 ease-out"
                 style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}>
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 relative">
                      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
                          <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="w-full h-full object-cover rounded-full border-4 border-blue-100"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex mb-4">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                            ))}
                          </div>
                          <blockquote className="text-xl md:text-2xl text-gray-700 italic mb-6">
                            "{testimonial.text}"
                          </blockquote>
                          <div className="text-right">
                            <div className="font-bold text-lg">{testimonial.name}</div>
                            <div className="text-blue-500">{testimonial.position}</div>
                            <div className="text-gray-500 text-sm">{testimonial.company}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Testimonial Navigation */}
            <div className="flex justify-center mt-8 space-x-4">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentTestimonial === index
                      ? 'bg-blue-500 scale-125'
                      : 'bg-blue-200 hover:bg-blue-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">About Us</h2>
          <p className="text-gray-300 text-center mb-12 max-w-2xl mx-auto">
            With over two decades of experience, we're committed to delivering the best piping solutions.
          </p>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: History, title: 'Our History', desc: '25+ years of excellence in providing quality piping solutions' },
              { icon: Users, title: 'Expert Team', desc: 'Dedicated professionals with decades of combined experience' },
              { icon: Factory, title: 'Manufacturing', desc: 'State-of-the-art facilities ensuring highest quality' }
            ].map(({ icon: Icon, title, desc }, index) => (
              <div
                key={index}
                className="text-center transform hover:scale-105 transition-all duration-300"
              >
                <div className="inline-block p-4 bg-slate-800 rounded-full mb-6">
                  <Icon className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-4">{title}</h3>
                <p className="text-gray-300">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Get in Touch</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Have questions? We're here to help. Contact us for expert assistance.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-6">
                {[
                  { icon: Phone, title: 'Phone', info: '9587459855' },
                  { icon: Mail, title: 'Email', info: 'contact@pipemasterpro.com' },
                  { icon: MapPin, title: 'Address', info: '123 Industrial Avenue, Dighori Nagpur'}
                ].map(({ icon: Icon, title, info }, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <Icon className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-semibold">{title}</p>
                      <p className="text-gray-600">{info}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Your message"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <PipeSection className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold">PipeMaster Pro</span>
              </div>
              <p className="text-gray-400 mb-6">
                Leading provider of high-quality industrial pipes and fittings, serving industries worldwide.
              </p>
              {/* <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Youtube className="h-6 w-6" />
                </a>
              </div> */}
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-6">Quick Links</h4>
              <ul className="space-y-4">
                {['Home', 'About Us', 'Products', 'Testimonials', 'Contact'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-6">Products</h4>
              <ul className="space-y-4">
                {['Steel Pipes', 'PVC Pipes', 'HDPE Pipes', 'Copper Fittings', 'Valves', 'Accessories'].map((product) => (
                  <li key={product}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      {product}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-6">Newsletter</h4>
              <p className="text-gray-400 mb-4">
                Subscribe to our newsletter for the latest updates and offers.
              </p>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-white"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-400">
                © 2025 Design by. PSK Technologies Pvt. Ltd.
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home
