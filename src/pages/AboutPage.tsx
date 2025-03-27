
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-24">
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="heading-primary mb-6">About Baraqah</h1>
            <p className="text-xl text-gray-600 mb-8">
              Providing authentic Islamic and spiritual products with a focus on quality, tradition, and spiritual significance.
            </p>
            <div className="islamic-divider">
              <span className="relative px-4 font-arabic text-islamic-gold">﷽</span>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-12 md:py-16 bg-islamic-cream/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="perspective-container order-2 md:order-1">
              <div className="rotate-y-hover transform-gpu">
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1606214151826-25a91b4397fe?auto=format&fit=crop&q=80"
                    alt="Our team"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            
            <div className="order-1 md:order-2">
              <h2 className="heading-secondary mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Baraqah began with a simple mission: to provide authentic, high-quality Islamic products that enhance spiritual practice and bring beauty into the lives of our customers.
                </p>
                <p>
                  Founded by a team of dedicated Muslims who saw a need for premium Islamic goods that combine traditional craftsmanship with modern design sensibilities, we've grown from a small collection to a carefully curated catalog of products.
                </p>
                <p>
                  The name "Baraqah" (بركة) refers to the blessings that flow from God, and it's this concept of divine blessing that guides our approach to business. We believe that when products are created and sold with the right intention, they can bring blessings into people's lives.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at Baraqah
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md transition-transform hover:-translate-y-1 duration-300">
              <div className="w-16 h-16 bg-islamic-gold/10 flex items-center justify-center rounded-lg mb-6 text-islamic-gold">
                <span className="font-arabic text-2xl">أمانة</span>
              </div>
              <h3 className="font-serif text-xl font-semibold mb-3">Amanah (Trust)</h3>
              <p className="text-gray-600">
                We uphold the highest standards of integrity and trustworthiness in every aspect of our business, from product descriptions to customer service.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md transition-transform hover:-translate-y-1 duration-300">
              <div className="w-16 h-16 bg-islamic-gold/10 flex items-center justify-center rounded-lg mb-6 text-islamic-gold">
                <span className="font-arabic text-2xl">إحسان</span>
              </div>
              <h3 className="font-serif text-xl font-semibold mb-3">Ihsan (Excellence)</h3>
              <p className="text-gray-600">
                We strive for excellence in everything we do, from curating high-quality products to providing exceptional customer service.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md transition-transform hover:-translate-y-1 duration-300">
              <div className="w-16 h-16 bg-islamic-gold/10 flex items-center justify-center rounded-lg mb-6 text-islamic-gold">
                <span className="font-arabic text-2xl">صدق</span>
              </div>
              <h3 className="font-serif text-xl font-semibold mb-3">Sidq (Truthfulness)</h3>
              <p className="text-gray-600">
                We are committed to honesty and transparency in all our business dealings, ensuring our customers can shop with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Commitment */}
      <section className="py-12 md:py-16 bg-islamic-navy text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">Our Commitment</h2>
            <p className="text-white/80 mb-8">
              At Baraqah, we're committed to providing products that not only meet the highest standards of quality but also adhere to Islamic principles. We carefully vet our suppliers and products to ensure they align with our values and the needs of our customers.
            </p>
            <div className="islamic-divider">
              <span className="relative px-4 font-arabic text-islamic-gold">﷽</span>
            </div>
            <p className="text-white/80 mt-8">
              We believe that beautiful, well-crafted products can enhance spiritual practice and bring joy to everyday life. That's why we focus on offering items that combine aesthetic beauty with functional excellence and spiritual significance.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="heading-secondary mb-6">Experience Baraqah Today</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Discover our curated collection of Islamic products and begin your journey with Baraqah.
            </p>
            <Link to="/products">
              <Button className="bg-islamic-green hover:bg-islamic-green/90">
                Explore Our Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
