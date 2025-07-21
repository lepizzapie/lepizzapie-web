import React from 'react';
import { Link } from 'react-router-dom';
import { Pizza, Calendar, Users, Star } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pizza-red via-pizza-orange to-pizza-yellow min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-white rounded-full"></div>
          <div className="absolute bottom-32 left-32 w-28 h-28 bg-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-20 h-20 bg-white rounded-full"></div>
        </div>

        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8">
          {/* Main Pizza Icon */}
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Pizza className="w-20 h-20 text-white" />
            </div>
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6">
            Le Pizza Pie
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Bringing authentic pizza magic to your events, parties, and celebrations
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/book-event"
              className="btn-primary text-lg px-8 py-4 bg-white text-pizza-red hover:bg-gray-100"
            >
              Book Your Event
            </Link>
            <Link
              to="/calendar"
              className="btn-secondary text-lg px-8 py-4 bg-white bg-opacity-20 text-white hover:bg-opacity-30"
            >
              View Calendar
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">Why Choose Le Pizza Pie?</h2>
            <p className="section-subtitle">
              We bring the authentic pizza experience right to your doorstep
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-16 h-16 bg-pizza-red rounded-full flex items-center justify-center mx-auto mb-4">
                <Pizza className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Fresh & Authentic</h3>
              <p className="text-gray-600">
                Hand-tossed dough, premium ingredients, and traditional recipes that bring Italy to your event.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-pizza-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Easy Booking</h3>
              <p className="text-gray-600">
                Simple online booking system with real-time calendar availability and instant confirmation.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-pizza-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Event Specialists</h3>
              <p className="text-gray-600">
                From intimate gatherings to large corporate events, we handle everything with professionalism.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">Ready to Make Your Event Unforgettable?</h2>
          <p className="section-subtitle">
            Check our availability and book your pizza catering experience today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book-event" className="btn-primary text-lg px-8 py-4">
              Book Now
            </Link>
            <Link to="/menu" className="btn-secondary text-lg px-8 py-4">
              View Menu
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 