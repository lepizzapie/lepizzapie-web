import React from 'react';
import { Pizza, Users, MapPin, Clock, Star } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="section-title">About Le Pizza Pie</h1>
          <p className="section-subtitle">
            Bringing authentic Italian pizza to your special events since 2018
          </p>
        </div>

        {/* Hero Section */}
        <div className="card mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Le Pizza Pie started with a simple mission: to bring the authentic taste of Italy to every celebration. 
                What began as a small family operation has grown into the region's most trusted mobile pizza catering service.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                We believe that great pizza brings people together. Whether it's a birthday party, corporate event, 
                or wedding reception, our hand-crafted pizzas create memorable moments that last a lifetime.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-pizza-yellow fill-current" />
                  <Star className="w-5 h-5 text-pizza-yellow fill-current" />
                  <Star className="w-5 h-5 text-pizza-yellow fill-current" />
                  <Star className="w-5 h-5 text-pizza-yellow fill-current" />
                  <Star className="w-5 h-5 text-pizza-yellow fill-current" />
                </div>
                <span className="text-gray-600">200+ Happy Events</span>
              </div>
            </div>
            <div className="text-center">
              <div className="w-64 h-64 mx-auto bg-gradient-to-br from-pizza-red to-pizza-orange rounded-full flex items-center justify-center">
                <Pizza className="w-32 h-32 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="card text-center">
            <div className="w-16 h-16 bg-pizza-red rounded-full flex items-center justify-center mx-auto mb-4">
              <Pizza className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Authentic Quality</h3>
            <p className="text-gray-600">
              We use only the finest ingredients, traditional recipes, and time-honored techniques to create pizzas that taste like they came straight from Naples.
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-pizza-orange rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Personal Service</h3>
            <p className="text-gray-600">
              Every event is unique, and we treat it that way. Our team works closely with you to ensure your pizza catering experience exceeds expectations.
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-pizza-yellow rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Mobile Convenience</h3>
            <p className="text-gray-600">
              We bring our pizza oven and everything needed right to your venue. No need to worry about setup or cleanup - we handle it all.
            </p>
          </div>
        </div>



        {/* Stats Section */}
        <div className="card">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-pizza-red mb-2">200+</div>
              <div className="text-gray-600">Events Catered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pizza-orange mb-2">10,000+</div>
              <div className="text-gray-600">Happy Guests</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pizza-yellow mb-2">3</div>
              <div className="text-gray-600">Years of Service</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pizza-red mb-2">5.0</div>
              <div className="text-gray-600">Star Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 