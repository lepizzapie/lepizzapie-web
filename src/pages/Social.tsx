import React from 'react';
import { Instagram, Facebook, Twitter, Star, Quote } from 'lucide-react';

const Social: React.FC = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      event: 'Birthday Party',
      rating: 5,
      text: 'Le Pizza Pie made my daughter\'s birthday party absolutely magical! The pizzas were delicious and the service was impeccable. Everyone raved about how fresh and authentic the pizza tasted.'
    },
    {
      name: 'Mike Davis',
      event: 'Corporate Event',
      rating: 5,
      text: 'We hired Le Pizza Pie for our company holiday party and they exceeded all expectations. Professional, punctual, and the pizza was outstanding. Highly recommend!'
    },
    {
      name: 'Jennifer Smith',
      event: 'Wedding Reception',
      rating: 5,
      text: 'Having Le Pizza Pie at our wedding was the best decision we made! The guests loved the interactive pizza making experience and the quality was restaurant-worthy.'
    },
    {
      name: 'Robert Wilson',
      event: 'Graduation Party',
      rating: 5,
      text: 'Amazing service from start to finish. The team was friendly, the setup was quick, and the pizza was the highlight of our graduation celebration.'
    }
  ];

  const socialLinks = [
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://instagram.com/lepizzapie',
      followers: '2.5K',
      color: 'text-pink-600'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: 'https://facebook.com/lepizzapie',
      followers: '1.8K',
      color: 'text-blue-600'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: 'https://twitter.com/lepizzapie',
      followers: '950',
      color: 'text-blue-400'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="section-title">Connect With Us</h1>
          <p className="section-subtitle">
            Follow our journey and see the magic we create at events
          </p>
        </div>

        {/* Instagram Gallery */}
        <div className="card mb-16">
          {/* Instagram Feed - Using Instagram's Public Embed */}
          <div className="grid md:grid-cols-3 gap-2">
            {/* Instagram Profile Embed */}
            <div className="md:col-span-3">
              <div className="bg-white rounded-lg p-1 border border-gray-200">
                <div className="flex items-center justify-center mb-1">
                  <Instagram className="w-6 h-6 text-pink-600 mr-2" />
                  <span className="text-lg font-semibold text-gray-900">@lepizzapie</span>
                </div>
                
                {/* Instagram Profile Embed */}
                <div className="flex justify-center">
                  <iframe
                    src="https://www.instagram.com/lepizzapie/embed"
                    width="800"
                    height="800"
                    frameBorder="0"
                    scrolling="no"
                    allowTransparency={true}
                    className="rounded-lg"
                    title="Instagram feed for @lepizzapie"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>

          {/* Instagram Profile Embed */}
          <div className="text-center mt-8">
            <a
              href="https://instagram.com/lepizzapie"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
            >
              <Instagram className="w-5 h-5 mr-2" />
              Follow @lepizzapie on Instagram
            </a>
          </div>
        </div>

        {/* Customer Testimonials */}
        <div className="card">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What Our Customers Say</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-pizza-yellow fill-current" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-pizza-red mb-4" />
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.event}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Social; 