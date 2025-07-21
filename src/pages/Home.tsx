import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-pizza-yellow min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-white rounded-full"></div>
          <div className="absolute bottom-32 left-32 w-28 h-28 bg-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-20 h-20 bg-white rounded-full"></div>
        </div>

        <div className="relative z-10 flex flex-col text-center text-white h-full w-full justify-start items-center p-0 m-0">
          {/* Main Pizza Icon at the very top */}
          <div className="flex-none flex items-start justify-center p-0 m-0 max-w-2xl w-full pt-0 mt-0">
            <img 
              src="/lepizzapielogomouthopensolo.svg" 
              alt="Le Pizza Pie Logo" 
              className="w-full object-contain p-0 m-0" 
            />
          </div>
          <p className="text-xl md:text-2xl mb-2 max-w-2xl mx-auto mt-6">
            Bringing authentic pizza magic to your events, parties, and celebrations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6 mb-4">
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
                <Calendar className="w-8 h-8 text-white" />
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