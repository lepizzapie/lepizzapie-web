import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addDays, addMonths } from 'date-fns';

interface AvailableDate {
  date: string;
  available: boolean;
}

const Calendar: React.FC = () => {
  const API_BASE_URL = process.env.REACT_APP_API_URL || '';
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availableDates, setAvailableDates] = useState<AvailableDate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvailableDates = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/events/availability`);
        if (response.ok) {
          const data = await response.json();
          setAvailableDates(data);
        }
      } catch (error) {
        console.error('Failed to fetch available dates:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAvailableDates();
  }, [API_BASE_URL]);

  const isDateAvailable = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    const found = availableDates.find(d => d.date === dateString);
    return found ? found.available : true;
  };

  const getDateStatus = (date: Date) => {
    if (!isDateAvailable(date)) return 'booked';
    return 'available';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'booked':
        return 'bg-pizza-red text-white';
      case 'available':
      default:
        return 'bg-green-100 text-green-800 border border-green-300';
    }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="section-title">Event Calendar</h1>
            <p className="section-subtitle">Loading calendar data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="section-title">Event Calendar</h1>
          <p className="section-subtitle">
            Check our availability and see upcoming events
          </p>
        </div>

        {/* Calendar Legend */}
        <div className="card mb-8">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
              <span className="text-sm text-gray-700">Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-pizza-red rounded"></div>
              <span className="text-sm text-gray-700">Booked</span>
            </div>
          </div>
        </div>

        {/* Calendar Navigation */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setCurrentDate(addMonths(currentDate, -1))}
              className="p-2 text-gray-600 hover:text-pizza-red transition-colors"
            >
              ← Previous Month
            </button>
            <h2 className="text-2xl font-bold text-gray-900">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <button
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              className="p-2 text-gray-600 hover:text-pizza-red transition-colors"
            >
              Next Month →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {/* Day Headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-3 text-center font-semibold text-gray-700 bg-gray-50 rounded">
                {day}
              </div>
            ))}

            {/* Calendar Days */}
            {daysInMonth.map((day, index) => {
              const status = getDateStatus(day);
              
              return (
                <div
                  key={index}
                  className={`min-h-[100px] p-2 border border-gray-200 rounded ${
                    isToday(day) ? 'ring-2 ring-pizza-red' : ''
                  }`}
                >
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    {format(day, 'd')}
                  </div>
                  
                  <div className={`text-xs px-2 py-1 rounded-full ${getStatusColor(status)}`}>
                    {status === 'booked' && 'Booked'}
                    {status === 'available' && 'Available'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Booking Information */}
        <div className="card">
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2 text-pizza-red" />
            Book Your Event
          </h3>
          
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Ready to book your pizza event? Click the button below to get started!
            </p>
            <a
              href="/book-event"
              className="btn-primary inline-block"
            >
              Book Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar; 