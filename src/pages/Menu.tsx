import React from 'react';
import { Users } from 'lucide-react';

const Menu: React.FC = () => {
  const mainPackage = {
    name: 'Minimum Pizza Package',
    description: '40 wood fired pizzas (12" pies)',
    price: '$775',
    includes: ['Plates, napkins, utensils', 'Togo boxes', '3.5 hour onsite cooking', 'Additional toppings available upon request']
  };

  const pizzaVarieties = [
    {
      name: 'Pepperoni Pie',
      description: 'Mozzarella, parmigiano reggiano, red sauce, oregano, pepperoni'
    },
    {
      name: 'Margarita Pie',
      description: 'Fresh mozzarella, fresh basil, red sauce, Sicilian olive oil'
    },
    {
      name: 'White Pie',
      description: 'Mozzarella, parmigiano reggiano, ricotta cheese'
    },
    {
      name: 'Vegetable Pie',
      description: 'Mozzarella, red sauce, spinach, garlic, peppers, shallots'
    },
    {
      name: 'Sausage Pie',
      description: 'Mozzarella, red sauce, spicy/sweet sausage, peppers, shallots'
    }
  ];

  const additions = [
    {
      name: '10 Additional Pizzas',
      description: 'Extra wood fired pizzas (12" pies)',
      price: '$160',
      serving: '10 Pizzas'
    },
    {
      name: 'Eggplant Parmigiana',
      description: 'Baked eggplant, red sauce, mozzarella, parmesan cheese, basil',
      price: '$100',
      serving: '1 Full Tray'
    },
    {
      name: 'Meatballs',
      description: 'Pork, beef, red sauce, parmesan cheese',
      price: '$130',
      serving: '1 Full Tray'
    },
    {
      name: 'Sausage and Peppers',
      description: 'Italian hot/sweet sausage, red sauce, peppers, and onions',
      price: '$125',
      serving: '1 Full Tray'
    },
    {
      name: 'Chicken Wings',
      description: '100pcs Drums & Flats - dry rub wood fired wings. Sauces: choice of buffalo wing or garlic herb (ranch & blue cheese dip included)',
      price: '$135',
      serving: '1 Full Tray'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="section-title">Our Menu</h1>
          <p className="section-subtitle">
            Professional catering packages for your special events
          </p>
        </div>

        {/* Main Package */}
        <div className="card mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Catering Package</h2>
          <div className="max-w-2xl mx-auto">
            <div className="border-2 border-pizza-red rounded-lg p-8 hover:shadow-lg transition-shadow">
              <div className="text-center mb-6">
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{mainPackage.name}</h3>
                <p className="text-xl text-gray-600 mb-4">{mainPackage.description}</p>
                <div className="text-4xl font-bold text-pizza-red">{mainPackage.price}</div>
              </div>
              
              <ul className="space-y-3">
                {mainPackage.includes.map((item: string, itemIndex: number) => (
                  <li key={itemIndex} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-pizza-red rounded-full"></div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Pizza Varieties */}
        <div className="card mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Pizza Varieties</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pizzaVarieties.map((pizza, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{pizza.name}</h3>
                <p className="text-gray-600">{pizza.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Salad */}
        <div className="card mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Salad</h2>
          <div className="max-w-2xl mx-auto">
            <div className="border border-gray-200 rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Mixed Greens Salad</h3>
              <p className="text-gray-600">Mixed greens, carrots, tomato, sweet peppers, cucumber, Italian dressing</p>
            </div>
          </div>
        </div>

        {/* Additions */}
        <div className="card mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Additional Options</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {additions.map((addition, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">{addition.name}</h3>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-pizza-red">{addition.price}</div>
                    <div className="text-sm text-gray-600">{addition.serving}</div>
                  </div>
                </div>
                <p className="text-gray-600">{addition.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Important Notes */}
        <div className="card">
          <div className="text-center space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Important Information</h3>
              <p className="text-gray-700 mb-4">Please let us know of any food allergies or restrictions</p>
              <p className="text-sm text-gray-600 italic">(Prices subject to change based on market prices and availability)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu; 