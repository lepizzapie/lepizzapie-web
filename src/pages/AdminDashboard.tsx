import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pizza, Calendar, Users, Phone, Mail, MapPin, Edit, Trash2, CheckCircle, XCircle, LogOut, Send, RefreshCw } from 'lucide-react';
import GoogleCalendarService from '../utils/googleCalendar';

interface Event {
  id: string;
  date: string;
  time: string;
  title: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  guestCount: number;
  eventLocation: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  specialRequests: string;
  pizzaPreferences: string[];
  completedAt?: string;
  notes?: string;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [emailType, setEmailType] = useState<'all' | 'confirmed' | 'pending'>('all');
  const [googleCalendarService, setGoogleCalendarService] = useState<GoogleCalendarService | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string>('');
  const [showPastEvents, setShowPastEvents] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [unavailableDates, setUnavailableDates] = useState<string[]>([
    '2025-01-15',
    '2025-01-20',
    '2025-02-10',
    '2025-02-25',
    '2026-01-10',
    '2026-01-25',
    '2026-02-05',
    '2026-02-20'
  ]);

  // Mock events data (in real app, this would come from API)
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      date: '2025-02-15',
      time: '6:00 PM',
      title: 'Birthday Party - Sarah Johnson',
      contactName: 'Sarah Johnson',
      contactPhone: '(555) 123-4567',
      contactEmail: 'sarah.johnson@email.com',
      guestCount: 25,
      eventLocation: '123 Main St, Anytown, CA 90210',
      status: 'confirmed',
      specialRequests: 'Gluten-free options needed for 3 guests',
      pizzaPreferences: ['Margarita Pie', 'Pepperoni Pie', 'Vegetable Pie']
    },
    {
      id: '2',
      date: '2025-02-22',
      time: '12:00 PM',
      title: 'Corporate Event - TechCorp',
      contactName: 'Mike Davis',
      contactPhone: '(555) 987-6543',
      contactEmail: 'mike.davis@techcorp.com',
      guestCount: 50,
      eventLocation: '456 Business Ave, Suite 100, Anytown, CA 90210',
      status: 'confirmed',
      specialRequests: 'Need vegetarian options for 15 people',
      pizzaPreferences: ['Pepperoni Pie', 'Vegetable Pie', 'Sausage Pie']
    },
    {
      id: '3',
      date: '2025-02-24',
      time: '7:00 PM',
      title: 'Wedding Reception - Smith Family',
      contactName: 'Jennifer Smith',
      contactPhone: '(555) 456-7890',
      contactEmail: 'jennifer.smith@email.com',
      guestCount: 100,
      eventLocation: '789 Wedding Blvd, Anytown, CA 90210',
      status: 'pending',
      specialRequests: 'Elegant presentation, cocktail hour service',
      pizzaPreferences: ['Margarita Pie', 'Pepperoni Pie', 'White Pie', 'Vegetable Pie']
    },
    {
      id: '4',
      date: '2026-01-15',
      time: '5:00 PM',
      title: 'Corporate New Year Party - XYZ Corp',
      contactName: 'Lisa Chen',
      contactPhone: '(555) 777-8888',
      contactEmail: 'lisa.chen@xyzcorp.com',
      guestCount: 80,
      eventLocation: 'XYZ Corp Office, 500 Corporate Dr, Anytown, CA 90210',
      status: 'confirmed',
      specialRequests: 'New Year themed decorations, Champagne service, Additional Pizzas',
      pizzaPreferences: ['Pepperoni Pie', 'Vegetable Pie', 'White Pie', 'Sausage Pie']
    },
    {
      id: '5',
      date: '2026-01-30',
      time: '6:30 PM',
      title: 'Anniversary Celebration - Wilson Family',
      contactName: 'David Wilson',
      contactPhone: '(555) 999-0000',
      contactEmail: 'david.wilson@email.com',
      guestCount: 40,
      eventLocation: 'Wilson Residence, 600 Celebration Ave, Anytown, CA 90210',
      status: 'pending',
      specialRequests: 'Romantic setup, Wine pairing suggestions, Meatballs',
      pizzaPreferences: ['Margarita Pie', 'Pepperoni Pie', 'Vegetable Pie']
    },
    {
      id: '6',
      date: '2026-02-12',
      time: '12:00 PM',
      title: 'Valentine\'s Day Event - Love Corp',
      contactName: 'Maria Rodriguez',
      contactPhone: '(555) 111-3333',
      contactEmail: 'maria.rodriguez@lovecorp.com',
      guestCount: 60,
      eventLocation: 'Love Corp Headquarters, 700 Heart St, Anytown, CA 90210',
      status: 'confirmed',
      specialRequests: 'Valentine\'s Day theme, Rose decorations, Chicken Wings',
      pizzaPreferences: ['Margarita Pie', 'Pepperoni Pie', 'White Pie', 'Vegetable Pie']
    }
  ]);

  // Mock past events data
  const [pastEvents, setPastEvents] = useState<Event[]>([
    {
      id: 'past-1',
      date: '2025-01-15',
      time: '5:00 PM',
      title: 'Corporate Holiday Party - ABC Corp',
      contactName: 'John Wilson',
      contactPhone: '(555) 111-2222',
      contactEmail: 'john.wilson@abccorp.com',
      guestCount: 75,
      eventLocation: 'ABC Corp Headquarters, 100 Business St, Anytown, CA 90210',
      status: 'completed',
      specialRequests: 'Holiday themed presentation, Additional Pizzas, Eggplant Parmigiana',
      pizzaPreferences: ['Pepperoni Pie', 'Vegetable Pie', 'Sausage Pie', 'White Pie'],
      completedAt: '2025-01-15T22:00:00Z',
      notes: 'Great event! All pizzas were a hit. Guests loved the wood-fired oven setup. Received many compliments on the quality and presentation. Eggplant Parmigiana was very popular.'
    },
    {
      id: 'past-2',
      date: '2025-01-20',
      time: '6:30 PM',
      title: 'Birthday Party - Emma Thompson',
      contactName: 'Emma Thompson',
      contactPhone: '(555) 333-4444',
      contactEmail: 'emma.thompson@email.com',
      guestCount: 30,
      eventLocation: 'Thompson Residence, 200 Family Ave, Anytown, CA 90210',
      status: 'completed',
      specialRequests: 'Gluten-free options for 2 guests, Meatballs',
      pizzaPreferences: ['Margarita Pie', 'Pepperoni Pie', 'White Pie'],
      completedAt: '2025-01-20T23:30:00Z',
      notes: 'Excellent party! Gluten-free pizzas were perfect. Emma was thrilled with the service. Parents appreciated the cleanup. Meatballs were a big hit with the kids.'
    },
    {
      id: 'past-3',
      date: '2025-01-28',
      time: '12:00 PM',
      title: 'Graduation Celebration - Davis Family',
      contactName: 'Robert Davis',
      contactPhone: '(555) 555-6666',
      contactEmail: 'robert.davis@email.com',
      guestCount: 60,
      eventLocation: 'Davis Family Home, 300 Celebration Dr, Anytown, CA 90210',
      status: 'completed',
      specialRequests: 'Graduation themed decorations, Additional Pizzas, Chicken Wings, Sausage and Peppers',
      pizzaPreferences: ['Pepperoni Pie', 'Vegetable Pie', 'Sausage Pie', 'White Pie'],
      completedAt: '2025-01-28T16:00:00Z',
      notes: 'Wonderful graduation celebration! Perfect weather for outdoor pizza making. All 60 guests were served efficiently. Great feedback on the variety of pizzas. Chicken wings were very popular.'
    }
  ]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  const updateEventStatus = async (eventId: string, newStatus: 'confirmed' | 'cancelled') => {
    try {
      console.log('updateEventStatus called with:', { eventId, newStatus });
      console.log('Current events:', events);
      
      // Update the event status
      const updatedEvents = events.map(event => 
        event.id === eventId ? { ...event, status: newStatus } : event
      );
      console.log('Updated events:', updatedEvents);
      setEvents(updatedEvents);
      
      // If event is being confirmed, try to sync to Google Calendar
      if (newStatus === 'confirmed') {
        const confirmedEvent = updatedEvents.find(event => event.id === eventId);
        if (confirmedEvent) {
          // Show immediate confirmation
          alert(`Event "${confirmedEvent.title}" has been confirmed!`);
          
          // Try to sync to Google Calendar if available
          if (googleCalendarService) {
            try {
              setSyncStatus('Syncing newly confirmed event...');
              const result = await googleCalendarService.syncAllEvents([confirmedEvent]);
              
              if (result.success > 0) {
                setSyncStatus(`Event confirmed and synced to Google Calendar!`);
                setTimeout(() => {
                  alert(`Event "${confirmedEvent.title}" has been synced to Google Calendar!\n\nYou can now view this event in your Google Calendar app, which will sync to your iPhone Calendar.`);
                }, 500);
              } else {
                setSyncStatus('Event confirmed but sync failed');
                console.log('Google Calendar sync failed, but event was confirmed locally');
              }
            } catch (error) {
              console.error('Auto-sync failed:', error);
              setSyncStatus('Event confirmed but sync failed');
              console.log('Google Calendar sync failed, but event was confirmed locally');
            }
          } else {
            setSyncStatus('Event confirmed - Google Calendar not available');
            console.log('Google Calendar not available, but event was confirmed locally');
          }
        }
      } else if (newStatus === 'cancelled') {
        const cancelledEvent = updatedEvents.find(event => event.id === eventId);
        if (cancelledEvent) {
          setSyncStatus('Event cancelled');
          alert(`Event "${cancelledEvent.title}" has been cancelled.`);
        }
      }
    } catch (error) {
      console.error('Error updating event status:', error);
      alert('There was an error updating the event status. Please try again.');
    }
  };

  const deleteEvent = (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(event => event.id !== eventId));
    }
  };

  const markEventAsCompleted = (eventId: string, notes: string = '') => {
    const eventToComplete = events.find(event => event.id === eventId);
    if (eventToComplete) {
      const completedEvent = {
        ...eventToComplete,
        status: 'completed' as const,
        completedAt: new Date().toISOString(),
        notes: notes
      };
      
      // Remove from current events and add to past events
      setEvents(events.filter(event => event.id !== eventId));
      setPastEvents([completedEvent, ...pastEvents]);
      
      alert(`Event "${eventToComplete.title}" has been marked as completed and moved to past events.`);
    }
  };


  const sendEmailToCustomers = () => {
    let targetCustomers: string[] = [];
    
    switch (emailType) {
      case 'all':
        targetCustomers = events.map(event => event.contactEmail);
        break;
      case 'confirmed':
        targetCustomers = events.filter(event => event.status === 'confirmed').map(event => event.contactEmail);
        break;
      case 'pending':
        targetCustomers = events.filter(event => event.status === 'pending').map(event => event.contactEmail);
        break;
    }
    
    // Remove duplicates
    const uniqueEmails = [...new Set(targetCustomers)];
    
    // In real app, this would send emails via API
    alert(`Email will be sent to ${uniqueEmails.length} customers:\n\nSubject: ${emailSubject}\n\nMessage: ${emailMessage}\n\nRecipients: ${uniqueEmails.join(', ')}`);
    
    // Reset form
    setEmailSubject('');
    setEmailMessage('');
    setShowEmailModal(false);
  };

  const getCustomerStats = () => {
    const allEmails = events.map(event => event.contactEmail);
    const uniqueEmails = [...new Set(allEmails)];
    const confirmedEmails = [...new Set(events.filter(event => event.status === 'confirmed').map(event => event.contactEmail))];
    const pendingEmails = [...new Set(events.filter(event => event.status === 'pending').map(event => event.contactEmail))];
    
    return {
      total: uniqueEmails.length,
      confirmed: confirmedEmails.length,
      pending: pendingEmails.length
    };
  };

  // Initialize Google Calendar service
  useEffect(() => {
    const initGoogleCalendar = async () => {
      try {
        const service = new GoogleCalendarService();
        const initialized = await service.initialize();
        if (initialized) {
          setGoogleCalendarService(service);
          setSyncStatus('Google Calendar ready');
        } else {
          setSyncStatus('Google Calendar not configured');
          console.log('Google Calendar not configured - events can still be confirmed locally');
        }
      } catch (error) {
        console.error('Failed to initialize Google Calendar:', error);
        setSyncStatus('Google Calendar initialization failed');
        console.log('Google Calendar initialization failed - events can still be confirmed locally');
      }
    };

    // Initialize Google Calendar in the background
    initGoogleCalendar();
  }, []);

  // Sync events to Google Calendar
  const syncToGoogleCalendar = async () => {
    if (!googleCalendarService) {
      alert('Google Calendar service not available. Please check your configuration.');
      return;
    }

    setIsSyncing(true);
    setSyncStatus('Syncing events...');

    try {
      const confirmedEvents = events.filter(event => event.status === 'confirmed');
      
      if (confirmedEvents.length === 0) {
        setSyncStatus('No confirmed events to sync');
        setIsSyncing(false);
        return;
      }

      const result = await googleCalendarService.syncAllEvents(confirmedEvents);
      
      setSyncStatus(`Synced ${result.success} events successfully${result.failed > 0 ? `, ${result.failed} failed` : ''}`);
      
      if (result.success > 0) {
        alert(`Successfully synced ${result.success} events to Google Calendar!\n\nYou can now view these events in your Google Calendar app, which will sync to your iPhone Calendar.`);
      }
    } catch (error) {
      console.error('Sync failed:', error);
      setSyncStatus('Sync failed - check console for details');
      alert('Failed to sync events to Google Calendar. Please check your Google Calendar configuration.');
    } finally {
      setIsSyncing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-pizza-yellow text-gray-900';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    return { daysInMonth, startingDay };
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getEventsForDate = (dateString: string) => {
    return events.filter(event => event.date === dateString);
  };

  const isDateUnavailable = (dateString: string) => {
    return unavailableDates.includes(dateString);
  };

  const toggleDateAvailability = (dateString: string) => {
    if (isDateUnavailable(dateString)) {
      setUnavailableDates(unavailableDates.filter(date => date !== dateString));
    } else {
      setUnavailableDates([...unavailableDates, dateString]);
    }
  };

  const getDateStatus = (dateString: string) => {
    const dateEvents = getEventsForDate(dateString);
    const isUnavailable = isDateUnavailable(dateString);
    
    if (isUnavailable) return 'unavailable';
    if (dateEvents.length > 0) {
      const hasConfirmed = dateEvents.some(event => event.status === 'confirmed');
      const hasPending = dateEvents.some(event => event.status === 'pending');
      if (hasConfirmed) return 'booked';
      if (hasPending) return 'pending';
    }
    return 'available';
  };

  const getDateColor = (dateString: string) => {
    const status = getDateStatus(dateString);
    switch (status) {
      case 'booked':
        return 'bg-red-500 text-white';
      case 'pending':
        return 'bg-pizza-yellow text-gray-900';
      case 'unavailable':
        return 'bg-gray-400 text-white';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDay } = getDaysInMonth(currentMonth);
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200 bg-gray-50"></div>);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dateString = formatDate(date);
      const dateEvents = getEventsForDate(dateString);
      const status = getDateStatus(dateString);
      
      days.push(
        <div 
          key={day} 
          className={`h-24 border border-gray-200 p-1 cursor-pointer hover:bg-gray-50 transition-colors ${getDateColor(dateString)}`}
          onClick={() => toggleDateAvailability(dateString)}
          title={`${dateString} - ${status}`}
        >
          <div className="text-xs font-medium mb-1">{day}</div>
          <div className="space-y-1">
            {dateEvents.map((event, index) => (
              <div 
                key={event.id} 
                className="text-xs p-1 rounded bg-white bg-opacity-80 truncate"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedEvent(event);
                }}
              >
                {event.title}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-pizza-red rounded-full flex items-center justify-center">
                <Pizza className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-pizza-red transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-2xl font-bold text-pizza-red mb-2">
              {events.length}
            </div>
            <div className="text-gray-600">Total Events</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {events.filter(e => e.status === 'confirmed').length}
            </div>
            <div className="text-gray-600">Confirmed</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-pizza-yellow mb-2">
              {events.filter(e => e.status === 'pending').length}
            </div>
            <div className="text-gray-600">Pending</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-gray-600 mb-2">
              {events.reduce((sum, e) => sum + e.guestCount, 0)}
            </div>
            <div className="text-gray-600">Total Guests</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {getCustomerStats().total}
            </div>
            <div className="text-gray-600">Customers</div>
          </div>
        </div>

        {/* Calendar Management */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Calendar Management</h2>
              <p className="text-gray-600">Sync events to Google Calendar (syncs to iPhone Calendar)</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={syncToGoogleCalendar}
                disabled={isSyncing || !googleCalendarService}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSyncing ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <RefreshCw className="w-5 h-5" />
                )}
                <span>{isSyncing ? 'Syncing...' : 'Sync to Google Calendar'}</span>
              </button>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Google Calendar Status</h4>
                <p className="text-sm text-gray-600">{syncStatus}</p>
                {googleCalendarService && (
                  <p className="text-xs text-green-600 mt-1">✓ Auto-sync enabled for confirmed events</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  {events.filter(e => e.status === 'confirmed').length} confirmed events
                </p>
                <p className="text-xs text-gray-500">
                  {events.filter(e => e.status === 'pending').length} pending events
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mailing List Management */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Mailing List Management</h2>
              <p className="text-gray-600">Send emails to customers about specials and updates</p>
            </div>
            <button
              onClick={() => setShowEmailModal(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Send className="w-5 h-5" />
              <span>Send Email</span>
            </button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">{getCustomerStats().total}</div>
              <div className="text-sm text-gray-600">Total Customers</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">{getCustomerStats().confirmed}</div>
              <div className="text-sm text-gray-600">Confirmed Events</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 mb-1">{getCustomerStats().pending}</div>
              <div className="text-sm text-gray-600">Pending Events</div>
            </div>
          </div>
        </div>

        {/* Calendar View */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Calendar View</h2>
              <p className="text-gray-600">View bookings and manage availability</p>
            </div>
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="btn-primary flex items-center space-x-2"
            >
              <Calendar className="w-5 h-5" />
              <span>{showCalendar ? 'Hide Calendar' : 'Show Calendar'}</span>
            </button>
          </div>
          
          {showCalendar && (
            <div>
              {/* Calendar Navigation */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  className="p-2 text-gray-600 hover:text-pizza-red transition-colors"
                >
                  ← Previous
                </button>
                <div className="flex items-center space-x-4">
                  <h3 className="text-lg font-semibold">
                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h3>
                  <select
                    value={currentMonth.getFullYear()}
                    onChange={(e) => setCurrentMonth(new Date(parseInt(e.target.value), currentMonth.getMonth(), 1))}
                    className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-pizza-red"
                  >
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                  </select>
                </div>
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  className="p-2 text-gray-600 hover:text-pizza-red transition-colors"
                >
                  Next →
                </button>
              </div>

              {/* Calendar Legend */}
              <div className="flex flex-wrap gap-4 mb-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span>Booked</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-pizza-yellow rounded"></div>
                  <span>Pending</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-400 rounded"></div>
                  <span>Unavailable</span>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-gray-600 bg-gray-100">
                    {day}
                  </div>
                ))}
                {renderCalendar()}
              </div>

              <div className="text-sm text-gray-600">
                <p>• Click on any date to mark it as unavailable/available</p>
                <p>• Click on event names to view details</p>
                <p>• Red = Confirmed booking, Yellow = Pending booking, Gray = Unavailable</p>
              </div>

              {/* Upcoming Bookings Summary */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Upcoming Bookings Summary</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">2025 Bookings</h5>
                    <div className="space-y-1 text-sm">
                      {events
                        .filter(event => event.date.startsWith('2025'))
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        .map(event => (
                          <div key={event.id} className="flex justify-between items-center">
                            <span className="text-gray-600">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            <span className={`px-2 py-1 rounded text-xs ${getStatusColor(event.status)}`}>
                              {event.status}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">2026 Bookings</h5>
                    <div className="space-y-1 text-sm">
                      {events
                        .filter(event => event.date.startsWith('2026'))
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        .map(event => (
                          <div key={event.id} className="flex justify-between items-center">
                            <span className="text-gray-600">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            <span className={`px-2 py-1 rounded text-xs ${getStatusColor(event.status)}`}>
                              {event.status}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Events List */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Management</h2>
          
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                    <p className="text-gray-600">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })} at {event.time}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="p-2 text-gray-600 hover:text-pizza-red transition-colors"
                      title="View Details"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteEvent(event.id)}
                      className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                      title="Delete Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{event.guestCount} guests</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{event.contactPhone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{event.contactEmail}</span>
                  </div>
                </div>

                {event.status === 'pending' && (
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={async () => {
                        console.log('Confirm button clicked for event:', event.id);
                        try {
                          await updateEventStatus(event.id, 'confirmed');
                        } catch (error) {
                          console.error('Error confirming event:', error);
                          alert('Failed to confirm event. Please try again.');
                        }
                      }}
                      className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Confirm</span>
                    </button>
                    <button
                      onClick={async () => {
                        console.log('Cancel button clicked for event:', event.id);
                        try {
                          await updateEventStatus(event.id, 'cancelled');
                        } catch (error) {
                          console.error('Error cancelling event:', error);
                          alert('Failed to cancel event. Please try again.');
                        }
                      }}
                      className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}

                {event.status === 'confirmed' && (
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => {
                        const notes = prompt('Add any notes about the event (optional):');
                        markEventAsCompleted(event.id, notes || '');
                      }}
                      className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Mark Complete</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Past Events */}
        <div className="card mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Past Events</h2>
            <button
              onClick={() => setShowPastEvents(!showPastEvents)}
              className="text-pizza-red hover:text-red-700 transition-colors"
            >
              {showPastEvents ? 'Hide Past Events' : `Show Past Events (${pastEvents.length})`}
            </button>
          </div>
          
          {showPastEvents && (
            <div className="space-y-4">
              {pastEvents.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No past events found.</p>
              ) : (
                pastEvents.map((event) => (
                  <div key={event.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                        <p className="text-gray-600">
                          {new Date(event.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })} at {event.time}
                        </p>
                        {event.completedAt && (
                          <p className="text-sm text-blue-600">
                            Completed: {new Date(event.completedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                          Completed
                        </span>
                        <button
                          onClick={() => setSelectedEvent(event)}
                          className="p-2 text-gray-600 hover:text-pizza-red transition-colors"
                          title="View Details"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 text-sm mb-4">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{event.guestCount} guests</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{event.contactPhone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{event.contactEmail}</span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Pizza Varieties Ordered:</h4>
                        <div className="flex flex-wrap gap-2">
                          {event.pizzaPreferences.map((pref, index) => (
                            <span key={index} className="px-2 py-1 bg-pizza-cream text-gray-700 rounded text-xs">
                              {pref}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Additional Options:</h4>
                        <div className="text-sm text-gray-600">
                          {event.specialRequests ? (
                            <p>{event.specialRequests}</p>
                          ) : (
                            <p className="text-gray-500 italic">No additional options</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {event.notes && (
                      <div className="bg-white p-3 rounded border">
                        <h4 className="font-medium text-gray-900 mb-1">Event Notes:</h4>
                        <p className="text-gray-700 text-sm">{event.notes}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Event Details</h3>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Event Information</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Event:</label>
                      <p className="text-gray-900">{selectedEvent.title}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Date & Time:</label>
                      <p className="text-gray-900">
                        {new Date(selectedEvent.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })} at {selectedEvent.time}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Guests:</label>
                      <p className="text-gray-900">{selectedEvent.guestCount}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Status:</label>
                      <p className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedEvent.status)}`}>
                        {selectedEvent.status.charAt(0).toUpperCase() + selectedEvent.status.slice(1)}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Name:</label>
                      <p className="text-gray-900">{selectedEvent.contactName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Phone:</label>
                      <p className="text-gray-900">{selectedEvent.contactPhone}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-700">Email:</label>
                      <p className="text-gray-900">{selectedEvent.contactEmail}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Location</h4>
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <p className="text-gray-900">{selectedEvent.eventLocation}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Pizza Preferences</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.pizzaPreferences.map((pref, index) => (
                      <span key={index} className="px-3 py-1 bg-pizza-cream text-gray-700 rounded-full text-sm">
                        {pref}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedEvent.specialRequests && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Special Requests & Additional Options</h4>
                    <p className="text-gray-900">{selectedEvent.specialRequests}</p>
                  </div>
                )}

                {selectedEvent.status === 'completed' && selectedEvent.notes && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Event Notes</h4>
                    <p className="text-gray-900">{selectedEvent.notes}</p>
                  </div>
                )}

                {selectedEvent.status === 'pending' && (
                  <div className="flex space-x-3 pt-4 border-t">
                    <button
                      onClick={async () => {
                        console.log('Modal confirm button clicked for event:', selectedEvent.id);
                        try {
                          await updateEventStatus(selectedEvent.id, 'confirmed');
                          setSelectedEvent(null);
                        } catch (error) {
                          console.error('Error confirming event from modal:', error);
                          alert('Failed to confirm event. Please try again.');
                        }
                      }}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Confirm Event</span>
                    </button>
                    <button
                      onClick={async () => {
                        console.log('Modal cancel button clicked for event:', selectedEvent.id);
                        try {
                          await updateEventStatus(selectedEvent.id, 'cancelled');
                          setSelectedEvent(null);
                        } catch (error) {
                          console.error('Error cancelling event from modal:', error);
                          alert('Failed to cancel event. Please try again.');
                        }
                      }}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Cancel Event</span>
                    </button>
                  </div>
                )}

                {selectedEvent.status === 'confirmed' && (
                  <div className="flex space-x-3 pt-4 border-t">
                    <button
                      onClick={() => {
                        const notes = prompt('Add any notes about the event (optional):');
                        markEventAsCompleted(selectedEvent.id, notes || '');
                        setSelectedEvent(null);
                      }}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Mark Complete</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

        {/* Email Modal */}
        {showEmailModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Send Email to Customers</h3>
                  <button
                    onClick={() => setShowEmailModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Type
                    </label>
                    <select
                      value={emailType}
                      onChange={(e) => setEmailType(e.target.value as 'all' | 'confirmed' | 'pending')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pizza-red"
                    >
                      <option value="all">All Customers ({getCustomerStats().total})</option>
                      <option value="confirmed">Confirmed Events Only ({getCustomerStats().confirmed})</option>
                      <option value="pending">Pending Events Only ({getCustomerStats().pending})</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pizza-red"
                      placeholder="Enter email subject..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      value={emailMessage}
                      onChange={(e) => setEmailMessage(e.target.value)}
                      rows={8}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pizza-red"
                      placeholder="Enter your message here..."
                      required
                    />
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Email Preview</h4>
                    <div className="text-sm text-gray-600">
                      <p><strong>To:</strong> {emailType === 'all' ? getCustomerStats().total : emailType === 'confirmed' ? getCustomerStats().confirmed : getCustomerStats().pending} customers</p>
                      <p><strong>Subject:</strong> {emailSubject || 'No subject'}</p>
                      <p><strong>Message:</strong></p>
                      <div className="mt-2 p-3 bg-white rounded border">
                        {emailMessage || 'No message content'}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4 border-t">
                    <button
                      onClick={sendEmailToCustomers}
                      disabled={!emailSubject || !emailMessage}
                      className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send Email</span>
                    </button>
                    <button
                      onClick={() => setShowEmailModal(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default AdminDashboard; 