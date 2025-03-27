
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call to send the email
      await new Promise((resolve) => setTimeout(resolve, 1200));
      
      toast({
        title: "Message Sent",
        description: "Thank you for your message. We'll respond shortly.",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send your message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24">
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="heading-primary mb-6">Contact Us</h1>
            <p className="text-xl text-gray-600 mb-8">
              Have questions or need assistance? We're here to help. Reach out to our team and we'll get back to you as soon as possible.
            </p>
            <div className="islamic-divider">
              <span className="relative px-4 font-arabic text-islamic-gold">﷽</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="heading-secondary mb-6">Get In Touch</h2>
              <p className="text-gray-600 mb-8">
                We value your feedback, questions, and concerns. Whether you need assistance with an order, have questions about our products, or simply want to share your experience, we're here to listen and assist.
              </p>
              
              <div className="space-y-6">
                <div className="bg-islamic-cream/50 p-6 rounded-xl">
                  <h3 className="font-serif text-lg font-semibold mb-2">Business Hours</h3>
                  <p className="text-gray-600">Monday - Friday: 9:00 AM - 5:00 PM</p>
                  <p className="text-gray-600">Saturday: 10:00 AM - 2:00 PM</p>
                  <p className="text-gray-600">Sunday: Closed</p>
                </div>
                
                <div className="bg-islamic-cream/50 p-6 rounded-xl">
                  <h3 className="font-serif text-lg font-semibold mb-2">Email</h3>
                  <p className="text-gray-600">
                    <a
                      href="mailto:info@baraqah.com"
                      className="text-islamic-green hover:underline"
                    >
                      info@baraqah.com
                    </a>
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    We aim to respond to all emails within 24-48 business hours.
                  </p>
                </div>
                
                <div className="bg-islamic-cream/50 p-6 rounded-xl">
                  <h3 className="font-serif text-lg font-semibold mb-2">Phone</h3>
                  <p className="text-gray-600">
                    <a
                      href="tel:+1-800-123-4567"
                      className="text-islamic-green hover:underline"
                    >
                      +1 (800) 123-4567
                    </a>
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Available during business hours.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div>
              <h2 className="heading-secondary mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your email address"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What is this regarding?"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your message"
                    rows={6}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-islamic-green hover:bg-islamic-green/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Sending...</span>
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 md:py-16 bg-islamic-cream/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="heading-secondary mb-4">Visit Our Office</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our office is located in the heart of the city. Feel free to visit us during business hours.
            </p>
          </div>
          
          <div className="rounded-xl overflow-hidden shadow-lg">
            <div className="aspect-[16/7] bg-gray-200 grid-pattern relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-md">
                  <h3 className="font-serif text-lg font-semibold mb-2">Baraqah Headquarters</h3>
                  <p className="text-gray-600">1234 Islamic Avenue</p>
                  <p className="text-gray-600">Suite 567</p>
                  <p className="text-gray-600">New York, NY 10001</p>
                  <Button variant="link" className="mt-2 text-islamic-green p-0">
                    Get Directions
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="heading-secondary mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find quick answers to common questions
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="font-serif text-lg font-semibold mb-2">What are your shipping times?</h3>
                <p className="text-gray-600">
                  We process most orders within 1-2 business days. Domestic shipping typically takes 3-5 business days, while international shipping can take 7-14 business days depending on the destination.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="font-serif text-lg font-semibold mb-2">Do you offer returns?</h3>
                <p className="text-gray-600">
                  Yes, we offer a 30-day return policy for most items. Products must be returned in their original condition and packaging. Please contact our customer service team to initiate a return.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="font-serif text-lg font-semibold mb-2">How can I track my order?</h3>
                <p className="text-gray-600">
                  Once your order ships, you'll receive a confirmation email with tracking information. You can also log into your account to view order status and tracking details.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="font-serif text-lg font-semibold mb-2">Do you ship internationally?</h3>
                <p className="text-gray-600">
                  Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location. Import duties and taxes may apply depending on your country's regulations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
