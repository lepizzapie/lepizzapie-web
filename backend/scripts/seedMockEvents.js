const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const dbName = 'lepizzapie-db';
const collectionName = 'events';

const mockEvents = [
  {
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
    date: '2026-02-12',
    time: '12:00 PM',
    title: "Valentine's Day Event - Love Corp",
    contactName: 'Maria Rodriguez',
    contactPhone: '(555) 111-3333',
    contactEmail: 'maria.rodriguez@lovecorp.com',
    guestCount: 60,
    eventLocation: 'Love Corp Headquarters, 700 Heart St, Anytown, CA 90210',
    status: 'confirmed',
    specialRequests: "Valentine's Day theme, Rose decorations, Chicken Wings",
    pizzaPreferences: ['Margarita Pie', 'Pepperoni Pie', 'White Pie', 'Vegetable Pie']
  }
];

async function seedEvents() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const eventsCol = db.collection(collectionName);
    const result = await eventsCol.insertMany(mockEvents);
    console.log(`Inserted ${result.insertedCount} mock events.`);
  } catch (err) {
    console.error('Error seeding events:', err);
  } finally {
    await client.close();
  }
}

seedEvents(); 