import React, { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addDays, addMonths } from 'date-fns';

interface Event {
  id: string;
  date: Date;
  title: string;
  time: string;
  guestCount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface UnavailableDate {
  date: Date;
  reason?: string;
}

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Mock events data (in real app, this would come from API)
  const mockEvents: Event[] = [
    {
      id: '1',
      date: new Date(2025, 1, 15), // Feb 15, 2025
      title: 'Birthday Party - Sarah Johnson',
      time: '6:00 PM',
      guestCount: 25,
      status: 'confirmed'
    },
    {
      id: '2',
      date: new Date(2025, 1, 22), // Feb 22, 2025
      title: 'Corporate Event - TechCorp',
      time: '12:00 PM',
      guestCount: 50,
      status: 'confirmed'
    },
    {
      id: '3',
      date: new Date(2025, 1, 24), // Feb 24, 2025
      title: 'Wedding Reception - Smith Family',
      time: '7:00 PM',
      guestCount: 100,
      status: 'pending'
    },
    {
      id: '4',
      date: new Date(2025, 2, 2), // Mar 2, 2025
      title: 'Graduation Party - Mike Davis',
      time: '5:00 PM',
      guestCount: 30,
      status: 'confirmed'
    }
  ];

  // Mock unavailable dates (in real app, this would come from API)
  const unavailableDates: UnavailableDate[] = [
    { date: new Date(2025, 1, 10), reason: 'Personal day' }, // Feb 10, 2025
    { date: new Date(2025, 1, 28), reason: 'Equipment maintenance' }, // Feb 28, 2025
    { date: new Date(2025, 2, 15), reason: 'Vacation' }, // Mar 15, 2025
  ];

  // Generate available dates dynamically for the next 6 months
  const generateAvailableDates = () => {
    const availableDates: Date[] = [];
    const startDate = new Date();
    const endDate = addMonths(startDate, 6);
    
    let currentDate = startDate;
    while (currentDate <= endDate) {
      // All dates are available by default unless booked or marked unavailable
      availableDates.push(new Date(currentDate));
      currentDate = addDays(currentDate, 1);
    }
    
    return availableDates;
  };

  const availableDates = generateAvailableDates();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDate = (date: Date) => {
    return mockEvents.filter(event => isSameDay(event.date, date));
  };

  const isDateUnavailable = (date: Date) => {
    return unavailableDates.some(unavailableDate => isSameDay(unavailableDate.date, date));
  };

  const getDateStatus = (date: Date) => {
    const events = getEventsForDate(date);
    if (events.length > 0) {
      const confirmedEvents = events.filter(event => event.status === 'confirmed');
      const pendingEvents = events.filter(event => event.status === 'pending');
      
      if (confirmedEvents.length > 0) return 'booked';
      if (pendingEvents.length > 0) return 'pending';
    }
    
    // Check if date is marked as unavailable by owner
    if (isDateUnavailable(date)) return 'unavailable';
    
    // All other dates are available by default
    return 'available';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'booked':
        return 'bg-pizza-red text-white';
      case 'pending':
        return 'bg-pizza-yellow text-gray-900';
      case 'available':
        return 'bg-green-100 text-green-800 border border-green-300';
      case 'unavailable':
        return 'bg-gray-100 text-gray-400';
      default:
        return 'bg-green-100 text-green-800 border border-green-300';
    }
  };



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
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-pizza-yellow rounded"></div>
              <span className="text-sm text-gray-700">Pending</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-100 rounded"></div>
              <span className="text-sm text-gray-700">Unavailable</span>
            </div>
          </div>
        </div>

        {/* Calendar Navigation */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                className="px-4 py-2 text-gray-600 hover:text-pizza-red transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 bg-pizza-red text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Today
              </button>
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                className="px-4 py-2 text-gray-600 hover:text-pizza-red transition-colors"
              >
                Next
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
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
                    {status === 'pending' && 'Pending'}
                    {status === 'available' && 'Available'}
                    {status === 'unavailable' && 'Unavailable'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events - Simplified for customers */}
        <div className="card">
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2 text-pizza-red" />
            Upcoming Events
          </h3>
          
          <div className="space-y-4">
            {mockEvents
              .filter(event => event.date >= new Date())
              .sort((a, b) => a.date.getTime() - b.date.getTime())
              .slice(0, 5)
              .map(event => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div>
                    <h4 className="font-semibold text-gray-900">Event Booked</h4>
                    <p className="text-sm text-gray-600">
                      {format(event.date, 'EEEE, MMMM d, yyyy')} at {event.time}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    event.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-pizza-yellow text-gray-900'
                  }`}>
                    {event.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Event Details Modal - Removed for customer view */}
      </div>
    </div>
  );
};

export default Calendar; 