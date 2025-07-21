# Le Pizza Pie - Mobile Pizza Catering Website

A modern, responsive website for a mobile pizza catering business. Built with React, TypeScript, and Tailwind CSS.

## Features

### Public Features
- **Splash Home Page** - Eye-catching landing page with pizza graphics and call-to-action
- **About Page** - Company story, team information, and values
- **Menu Page** - Pizza selection and catering packages
- **Book Event** - Comprehensive booking form with date/time selection
- **Calendar** - Visual calendar showing available dates and booked events
- **Social** - Customer testimonials and social media links

### Admin Features
- **Admin Login** - Secure access via pizza icon in top-right corner
- **Event Management** - View, edit, confirm, and cancel events
- **Customer Information** - Access to all customer details and preferences
- **Calendar Management** - Edit event status and availability

### Key Features
- **Real-time Calendar** - Shows available dates and booked events in red
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **iPhone Calendar Integration** - Download iCal files for iPhone Calendar app
- **Event Status Management** - Pending, confirmed, and cancelled states
- **Customer Data Management** - Complete event details and preferences

## Technology Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Hook Form** - Form handling and validation
- **Lucide React** - Beautiful icons
- **date-fns** - Date manipulation utilities

### Backend (Recommended)
- **Node.js** with **Express** - API server
- **MongoDB** - Database for events and user data
- **JWT** - Authentication for admin access
- **iCal/ICS** - Calendar file generation

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lepizzapieweb
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable components
│   └── Navigation.tsx   # Main navigation with admin access
├── pages/              # Page components
│   ├── Home.tsx        # Splash page with pizza graphics
│   ├── About.tsx       # Company information
│   ├── Menu.tsx        # Pizza menu and packages
│   ├── BookEvent.tsx   # Event booking form
│   ├── Calendar.tsx    # Visual calendar component
│   ├── Social.tsx      # Testimonials and social links
│   ├── AdminLogin.tsx  # Admin authentication
│   └── AdminDashboard.tsx # Event management dashboard
├── App.tsx             # Main app with routing
├── index.tsx           # React entry point
└── index.css           # Global styles and Tailwind imports
```

## Admin Access

- **URL**: `/admin`
- **Demo Credentials**: 
  - Username: `admin`
  - Password: `pizza123`
- **Access**: Click the pizza icon in the top-right corner of any page

## Calendar Integration

The calendar system supports:
- **Visual Calendar** - Monthly view with color-coded availability
- **Event Details** - Click events to see full information
- **Status Management** - Pending, confirmed, and cancelled states
- **iCal Export** - Download calendar files for iPhone Calendar app

## Customization

### Colors
The website uses a custom pizza-themed color palette defined in `tailwind.config.js`:
- `pizza-red`: #DC2626
- `pizza-orange`: #EA580C  
- `pizza-yellow`: #F59E0B
- `pizza-cream`: #FEF3C7

### Fonts
- **Display**: Playfair Display (headings)
- **Body**: Inter (body text)

## Deployment

### Recommended Platforms
- **Frontend**: Vercel, Netlify, or GitHub Pages
- **Backend**: Railway, Render, or Heroku

### Environment Variables
Create a `.env` file for production:
```env
REACT_APP_API_URL=your-backend-url
REACT_APP_ADMIN_EMAIL=admin@lepizzapie.com
```

## Future Enhancements

### Backend Integration
- [ ] API endpoints for event management
- [ ] Real-time calendar updates
- [ ] Email notifications
- [ ] Payment processing
- [ ] Customer portal

### Features
- [ ] Photo gallery from events
- [ ] Customer reviews system
- [ ] SMS notifications
- [ ] Multi-location support
- [ ] Inventory management

### Mobile App
- [ ] React Native app for admin
- [ ] Push notifications
- [ ] Offline capability
- [ ] GPS tracking for deliveries

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please contact:
- Email: info@lepizzapie.com
- Phone: (555) 123-4567

---

**Le Pizza Pie** - Bringing authentic pizza magic to your events since 2018 🍕 