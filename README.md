# Le Pizza Pie - Mobile Pizza Catering Website

A modern, responsive website for Le Pizza Pie mobile pizza catering business. Built with React, TypeScript, and Tailwind CSS.

## 🍕 Features

### Customer Features
- **Home Page**: Beautiful landing page with pizza branding
- **Menu**: Catering packages and pricing
- **Event Booking**: Easy online booking system
- **Calendar**: View available dates and book events
- **About**: Company story and team information
- **Social**: Instagram integration and social media links

### Admin Features
- **Admin Dashboard**: Complete event management system
- **Calendar View**: Visual calendar with booking management
- **Event Management**: Confirm, cancel, and track events
- **Past Events**: Historical event tracking with notes
- **Email Management**: Send emails to customers
- **Google Calendar Sync**: Automatic calendar integration

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Routing**: React Router v6
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **Database**: MongoDB Atlas
- **Hosting**: Railway (recommended) or Vercel

## 📋 Prerequisites

- Node.js 16+ 
- npm or yarn
- MongoDB Atlas account (free)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd lepizzapieweb
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb+srv://lepizzapie:ql50Tiqr9bZYDfDC@lepizzapie-db.pajhwi5.mongodb.net/?retryWrites=true&w=majority&appName=lepizzapie-db
   JWT_SECRET=lepizzapie-admin-secret-key-2025
   ```

4. **Start development server**
   ```bash
   npm start
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🌐 Deployment

### Railway (Recommended)
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub account
3. Import your repository
4. Add environment variables
5. Deploy automatically

### Vercel
1. Go to [vercel.com](https://vercel.com)
2. Connect your GitHub account
3. Import your repository
4. Add environment variables
5. Deploy automatically

## 🔐 Admin Access

**Default Admin Credentials:**
- **Username**: admin
- **Password**: lepizzapie2025
- **Admin URL**: `your-domain.com/admin`

## 📱 Pages

- **Home** (`/`): Landing page with hero section
- **About** (`/about`): Company story and statistics
- **Menu** (`/menu`): Catering packages and pricing
- **Book Event** (`/book`): Event booking form
- **Calendar** (`/calendar`): Available dates and bookings
- **Social** (`/social`): Instagram feed and social links
- **Admin Login** (`/admin`): Admin authentication
- **Admin Dashboard** (`/admin/dashboard`): Event management

## 🎨 Customization

### Colors
The website uses a custom color palette defined in `tailwind.config.js`:
- **Pizza Red**: `#DC2626`
- **Pizza Orange**: `#EA580C`
- **Pizza Yellow**: `#F59E0B`
- **Pizza Cream**: `#FEF3C7`

### Content
Update content in the respective page components:
- `src/pages/Home.tsx` - Home page content
- `src/pages/About.tsx` - About page content
- `src/pages/Menu.tsx` - Menu items and pricing
- `src/pages/AdminDashboard.tsx` - Mock event data

## 📊 Database Schema

### Events Collection
```javascript
{
  id: string,
  date: string,
  time: string,
  title: string,
  contactName: string,
  contactPhone: string,
  contactEmail: string,
  guestCount: number,
  eventLocation: string,
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed',
  specialRequests: string,
  pizzaPreferences: string[],
  completedAt?: string,
  notes?: string
}
```

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret for admin authentication | Yes |
| `REACT_APP_GOOGLE_API_KEY` | Google Calendar API key | No |
| `REACT_APP_GOOGLE_CLIENT_ID` | Google OAuth client ID | No |
| `REACT_APP_GOOGLE_CALENDAR_ID` | Google Calendar ID | No |

## 📞 Support

For deployment help, see `DEPLOYMENT_GUIDE.md` for detailed instructions.

## 📄 License

This project is for Le Pizza Pie business use.

---

**Built with ❤️ for Le Pizza Pie** 