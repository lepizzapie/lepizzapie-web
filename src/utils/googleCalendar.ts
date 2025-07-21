// Google Calendar API Integration
// Note: This requires Google Cloud Console setup and OAuth2 credentials

interface GoogleCalendarEvent {
  summary: string;
  description: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  location?: string;
  attendees?: Array<{ email: string; displayName?: string }>;
}

export class GoogleCalendarService {
  private apiKey: string;
  private clientId: string;
  private calendarId: string;

  constructor() {
    this.apiKey = process.env.REACT_APP_GOOGLE_API_KEY || '';
    this.clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';
    this.calendarId = process.env.REACT_APP_GOOGLE_CALENDAR_ID || 'primary';
  }

  // Initialize Google Calendar API
  async initialize(): Promise<boolean> {
    try {
      // Load Google API script
      await this.loadGoogleApiScript();
      
      // Initialize the API
      await new Promise((resolve, reject) => {
        window.gapi.load('client:auth2', async () => {
          try {
            await window.gapi.client.init({
              apiKey: this.apiKey,
              clientId: this.clientId,
              scope: 'https://www.googleapis.com/auth/calendar.events',
              discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
            });
            resolve(true);
          } catch (error) {
            reject(error);
          }
        });
      });

      return true;
    } catch (error) {
      console.error('Failed to initialize Google Calendar API:', error);
      return false;
    }
  }

  // Load Google API script
  private loadGoogleApiScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.gapi) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google API script'));
      document.head.appendChild(script);
    });
  }

  // Authenticate user
  async authenticate(): Promise<boolean> {
    try {
      const authInstance = window.gapi.auth2.getAuthInstance();
      if (!authInstance.isSignedIn.get()) {
        await authInstance.signIn();
      }
      return true;
    } catch (error) {
      console.error('Authentication failed:', error);
      return false;
    }
  }

  // Create event in Google Calendar
  async createEvent(eventData: {
    title: string;
    date: string;
    time: string;
    location: string;
    description: string;
    contactEmail: string;
    contactName: string;
    contactPhone?: string;
    guestCount: number;
  }): Promise<string | null> {
    try {
      const isAuthenticated = await this.authenticate();
      if (!isAuthenticated) {
        throw new Error('Authentication required');
      }

      // Parse date and time
      const eventDate = new Date(`${eventData.date}T${eventData.time}`);
      const endDate = new Date(eventDate.getTime() + 3 * 60 * 60 * 1000); // 3 hours duration

      const googleEvent: GoogleCalendarEvent = {
        summary: eventData.title,
        description: `${eventData.description}\n\nContact: ${eventData.contactName}\nEmail: ${eventData.contactEmail}\nPhone: ${eventData.contactPhone || 'N/A'}\nGuests: ${eventData.guestCount}`,
        start: {
          dateTime: eventDate.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        end: {
          dateTime: endDate.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        location: eventData.location,
        attendees: [
          { email: eventData.contactEmail, displayName: eventData.contactName }
        ]
      };

      const response = await window.gapi.client.calendar.events.insert({
        calendarId: this.calendarId,
        resource: googleEvent,
        sendUpdates: 'all'
      });

      return response.result.id || null;
    } catch (error) {
      console.error('Failed to create Google Calendar event:', error);
      return null;
    }
  }

  // Update existing event
  async updateEvent(eventId: string, eventData: any): Promise<boolean> {
    try {
      const isAuthenticated = await this.authenticate();
      if (!isAuthenticated) {
        throw new Error('Authentication required');
      }

      const eventDate = new Date(`${eventData.date}T${eventData.time}`);
      const endDate = new Date(eventDate.getTime() + 3 * 60 * 60 * 1000);

      const googleEvent: GoogleCalendarEvent = {
        summary: eventData.title,
        description: `${eventData.description}\n\nContact: ${eventData.contactName}\nEmail: ${eventData.contactEmail}\nPhone: ${eventData.contactPhone || 'N/A'}\nGuests: ${eventData.guestCount}`,
        start: {
          dateTime: eventDate.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        end: {
          dateTime: endDate.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        location: eventData.location
      };

      await window.gapi.client.calendar.events.update({
        calendarId: this.calendarId,
        eventId: eventId,
        resource: googleEvent,
        sendUpdates: 'all'
      });

      return true;
    } catch (error) {
      console.error('Failed to update Google Calendar event:', error);
      return false;
    }
  }

  // Delete event
  async deleteEvent(eventId: string): Promise<boolean> {
    try {
      const isAuthenticated = await this.authenticate();
      if (!isAuthenticated) {
        throw new Error('Authentication required');
      }

      await window.gapi.client.calendar.events.delete({
        calendarId: this.calendarId,
        eventId: eventId,
        sendUpdates: 'all'
      });

      return true;
    } catch (error) {
      console.error('Failed to delete Google Calendar event:', error);
      return false;
    }
  }

  // Sync all confirmed events to Google Calendar
  async syncAllEvents(events: any[]): Promise<{ success: number; failed: number }> {
    const confirmedEvents = events.filter(event => event.status === 'confirmed');
    let success = 0;
    let failed = 0;

    for (const event of confirmedEvents) {
      try {
        const eventId = await this.createEvent(event);
        if (eventId) {
          success++;
        } else {
          failed++;
        }
      } catch (error) {
        failed++;
        console.error(`Failed to sync event ${event.id}:`, error);
      }
    }

    return { success, failed };
  }
}

// Global Google API types
declare global {
  interface Window {
    gapi: any;
  }
}

export default GoogleCalendarService; 