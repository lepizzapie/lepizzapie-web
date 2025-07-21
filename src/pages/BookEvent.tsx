import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, Clock, Users, MapPin, Phone, Mail, CheckCircle } from 'lucide-react';

interface BookingForm {
  eventDate: string;
  eventTime: string;
  eventType: string;
  guestCount: number;
  eventLocation: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  specialRequests: string;
  pizzaVarieties: string[];
  additionalOptions: string[];
}

const BookEvent: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm<BookingForm>();

  const eventTypes = [
    'Birthday Party',
    'Corporate Event',
    'Wedding Reception',
    'Graduation Party',
    'Holiday Celebration',
    'Other'
  ];

  const pizzaVarieties = [
    'Pepperoni Pie',
    'Margarita Pie',
    'White Pie',
    'Vegetable Pie',
    'Sausage Pie'
  ];

  const additionalOptions = [
    'Additional Pizzas',
    'Eggplant Parmigiana',
    'Meatballs',
    'Sausage and Peppers',
    'Chicken Wings'
  ];

  // Mock available dates (in real app, this would come from API)
  const availableDates = [
    '2024-02-15', '2024-02-16', '2024-02-17', '2024-02-22', '2024-02-23',
    '2024-02-24', '2024-03-01', '2024-03-02', '2024-03-03', '2024-03-08'
  ];

  const timeSlots = [
    '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
    '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'
  ];

  const onSubmit = (data: BookingForm) => {
    console.log('Booking submitted:', data);
    setIsSubmitted(true);
    // In real app, send to API
    setTimeout(() => {
      reset();
      setIsSubmitted(false);
    }, 5000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card text-center max-w-md mx-auto">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Booking Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your booking request. We'll review your event details and contact you within 24 hours to confirm.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="btn-primary"
          >
            Book Another Event
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="section-title">Book Your Pizza Event</h1>
          <p className="section-subtitle">
            Let us bring the authentic pizza experience to your special occasion
          </p>
        </div>

        {/* Package Information */}
        <div className="card mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Base Package: $775</h2>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <h3 className="font-semibold text-pizza-red mb-2">What's Included</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• 40 wood-fired pizzas (12" pies)</li>
                  <li>• Plates, napkins, utensils</li>
                  <li>• Togo boxes</li>
                  <li>• 3.5 hour onsite cooking</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-pizza-red mb-2">Pizza Varieties</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• Pepperoni Pie</li>
                  <li>• Margarita Pie</li>
                  <li>• White Pie</li>
                  <li>• Vegetable Pie</li>
                  <li>• Sausage Pie</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-pizza-red mb-2">Also Includes</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• Mixed greens salad</li>
                  <li>• Professional setup</li>
                  <li>• Complete cleanup</li>
                  <li>• Additional toppings available</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Event Details */}
            <div>
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-pizza-red" />
                Event Details
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Date *
                  </label>
                  <select
                    {...register('eventDate', { required: 'Event date is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pizza-red"
                  >
                    <option value="">Select a date</option>
                    {availableDates.map((date) => (
                      <option key={date} value={date}>
                        {new Date(date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </option>
                    ))}
                  </select>
                  {errors.eventDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.eventDate.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Time *
                  </label>
                  <select
                    {...register('eventTime', { required: 'Event time is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pizza-red"
                  >
                    <option value="">Select a time</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                  {errors.eventTime && (
                    <p className="text-red-500 text-sm mt-1">{errors.eventTime.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Type *
                  </label>
                  <select
                    {...register('eventType', { required: 'Event type is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pizza-red"
                  >
                    <option value="">Select event type</option>
                    {eventTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.eventType && (
                    <p className="text-red-500 text-sm mt-1">{errors.eventType.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Guests *
                  </label>
                  <input
                    type="number"
                    min="25"
                    max="200"
                    {...register('guestCount', { 
                      required: 'Guest count is required',
                      min: { value: 25, message: 'Minimum 25 guests for our base package' },
                      max: { value: 200, message: 'Maximum 200 guests' }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pizza-red"
                    placeholder="Number of guests"
                  />
                  <p className="text-sm text-gray-600 mt-1">Base package serves 25-50 guests with 40 pizzas</p>
                  {errors.guestCount && (
                    <p className="text-red-500 text-sm mt-1">{errors.guestCount.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-pizza-red" />
                Event Location
              </h3>
              <textarea
                {...register('eventLocation', { required: 'Event location is required' })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pizza-red"
                placeholder="Please provide the full address and any special delivery instructions..."
              />
              {errors.eventLocation && (
                <p className="text-red-500 text-sm mt-1">{errors.eventLocation.message}</p>
              )}
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <Phone className="w-5 h-5 mr-2 text-pizza-red" />
                Contact Information
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    {...register('contactName', { required: 'Contact name is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pizza-red"
                    placeholder="Your full name"
                  />
                  {errors.contactName && (
                    <p className="text-red-500 text-sm mt-1">{errors.contactName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    {...register('contactPhone', { required: 'Phone number is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pizza-red"
                    placeholder="(555) 123-4567"
                  />
                  {errors.contactPhone && (
                    <p className="text-red-500 text-sm mt-1">{errors.contactPhone.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    {...register('contactEmail', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pizza-red"
                    placeholder="your.email@example.com"
                  />
                  {errors.contactEmail && (
                    <p className="text-red-500 text-sm mt-1">{errors.contactEmail.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Pizza Varieties */}
            <div>
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-pizza-red" />
                Pizza Varieties (Included in Base Package)
              </h3>
              <p className="text-gray-600 mb-4">Your package includes 40 wood-fired pizzas. Select your preferred varieties:</p>
              <div className="grid md:grid-cols-2 gap-4">
                {pizzaVarieties.map((option) => (
                  <label key={option} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      value={option}
                      {...register('pizzaVarieties')}
                      className="w-4 h-4 text-pizza-red border-gray-300 rounded focus:ring-pizza-red"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Options */}
            <div>
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-pizza-red" />
                Additional Options
              </h3>
              <p className="text-gray-600 mb-4">Add these items to your catering package:</p>
              <div className="grid md:grid-cols-2 gap-4">
                {additionalOptions.map((option) => (
                  <label key={option} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      value={option}
                      {...register('additionalOptions')}
                      className="w-4 h-4 text-pizza-red border-gray-300 rounded focus:ring-pizza-red"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Requests or Dietary Restrictions
              </label>
              <textarea
                {...register('specialRequests')}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pizza-red"
                placeholder="Any special dietary requirements, allergies, additional pizzas, or specific requests for your event..."
              />
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="btn-primary text-lg px-12 py-4"
              >
                Submit Booking Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookEvent; 