export const cafe = {
  name: 'LUME CAFE',
  neighbourhood: 'Colombo 07',
  country: 'Sri Lanka',
  hours: '7:30 AM – 10:00 PM',
  days: 'Every day',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=Colombo+07+Sri+Lanka',
  // Provisional business details and proposed menu, approved for this design.
  // Replace with the exact address, real hours and ordering endpoint before commercial launch.
};
export const flavours = [
  { id: 'strawberry', name: 'Strawberry Cream', note: 'Real strawberry. Velvet cream. Ice-cold obsession.', price: 1450, tag: 'BRIGHT · VELVETY · JOYFUL', accent: '#ff5561', lightAccent: '#b8172e', glow: '215, 24, 51', tint: 0 },
  { id: 'caramel', name: 'Caramel Cloud', note: 'Golden caramel. Silky milk. A little above ordinary.', price: 1550, tag: 'GOLDEN · SILKY · INDULGENT', accent: '#e6ad60', lightAccent: '#925716', glow: '200, 128, 39', tint: 1 },
  { id: 'mocha', name: 'Dark Mocha', note: 'Deep espresso. Dark chocolate. Beautifully bold.', price: 1550, tag: 'RICH · DARK · UNFORGETTABLE', accent: '#c3957a', lightAccent: '#784932', glow: '131, 76, 46', tint: 2 },
];
export const categories = ['Coffee', 'Frappés', 'Tea & coolers', 'Breakfast', 'Bakes'] as const;
export type Category = typeof categories[number];
export type MenuItem = { id: string; name: string; description: string; price: number; category: Category; badge?: string };
export const menu: MenuItem[] = [
  { id: 'espresso', name: 'Double Espresso', description: 'A short, rich double shot with a caramel finish.', price: 650, category: 'Coffee' },
  { id: 'americano', name: 'Americano', description: 'Double espresso, lengthened. Hot or over ice.', price: 750, category: 'Coffee' },
  { id: 'flat-white', name: 'Flat White', description: 'Velvety microfoam meets a bold double shot.', price: 950, category: 'Coffee', badge: 'HOUSE FAVOURITE' },
  { id: 'cappuccino', name: 'Cappuccino', description: 'Espresso, steamed milk and a cloud of foam.', price: 950, category: 'Coffee' },
  { id: 'latte', name: 'Café Latte', description: 'Smooth espresso and silky milk. Hot or iced.', price: 1050, category: 'Coffee' },
  { id: 'iced-mocha', name: 'Iced Chocolate Mocha', description: 'Espresso, cocoa and cold milk, poured over ice.', price: 1250, category: 'Coffee' },
  { id: 'strawberry', name: 'Strawberry Cream', description: 'Strawberries, blended milk and whipped cream.', price: 1450, category: 'Frappés', badge: 'LUME SIGNATURE' },
  { id: 'caramel', name: 'Caramel Cloud', description: 'Caramel, espresso and cream with a golden drizzle.', price: 1550, category: 'Frappés' },
  { id: 'mocha', name: 'Dark Mocha', description: 'Dark cocoa, espresso and a whipped cream finish.', price: 1550, category: 'Frappés' },
  { id: 'vanilla', name: 'Vanilla Bean', description: 'Vanilla, chilled milk and soft whipped cream.', price: 1350, category: 'Frappés' },
  { id: 'ceylon', name: 'Ceylon Breakfast Tea', description: 'A full-bodied island classic, served by the pot.', price: 550, category: 'Tea & coolers', badge: 'ISLAND CLASSIC' },
  { id: 'chai', name: 'Ceylon Spiced Chai', description: 'Black tea, warming spices and steamed milk.', price: 850, category: 'Tea & coolers' },
  { id: 'matcha', name: 'Iced Matcha Latte', description: 'Earthy matcha whisked with cold milk and ice.', price: 1250, category: 'Tea & coolers' },
  { id: 'passion', name: 'Passion Fruit Fizz', description: 'Passion fruit, fresh lime and sparkling water.', price: 850, category: 'Tea & coolers' },
  { id: 'lime', name: 'Mint & Lime Cooler', description: 'Fresh lime, mint and a little island refreshment.', price: 750, category: 'Tea & coolers' },
  { id: 'peach', name: 'Peach Ceylon Iced Tea', description: 'Cold Ceylon tea with peach and a lemon finish.', price: 800, category: 'Tea & coolers' },
  { id: 'avo', name: 'Avocado on Sourdough', description: 'Smashed avocado, cherry tomato and chilli flakes.', price: 1650, category: 'Breakfast', badge: 'VEGETARIAN' },
  { id: 'eggs', name: 'Eggs Your Way', description: 'Two eggs, sourdough, roasted tomato and greens.', price: 1450, category: 'Breakfast' },
  { id: 'chicken', name: 'Grilled Chicken Melt', description: 'Herbed chicken, cheddar and tomato on toasted sourdough.', price: 1850, category: 'Breakfast' },
  { id: 'mushroom', name: 'Creamy Mushroom Toast', description: 'Garlic mushrooms, cream and herbs on sourdough.', price: 1550, category: 'Breakfast', badge: 'VEGETARIAN' },
  { id: 'croissant', name: 'Butter Croissant', description: 'Golden, crisp layers. Soft and buttery inside.', price: 650, category: 'Bakes' },
  { id: 'cinnamon', name: 'Cinnamon Swirl', description: 'Soft dough, cinnamon sugar and a light glaze.', price: 750, category: 'Bakes' },
  { id: 'chocolate-cake', name: 'Dark Chocolate Cake', description: 'A generous slice with silky chocolate ganache.', price: 1100, category: 'Bakes', badge: 'SOMETHING SWEET' },
  { id: 'cheesecake', name: 'Baked Cheesecake', description: 'Creamy vanilla filling on a buttery biscuit base.', price: 1200, category: 'Bakes' },
  { id: 'brownie', name: 'Fudgy Chocolate Brownie', description: 'Deep cocoa, a delicate crust and a soft centre.', price: 750, category: 'Bakes' },
];
export type Bag = Record<string, number>;
export const rupees = (amount: number) => `Rs. ${amount.toLocaleString('en-LK')}`;
export const chapters = ['First sip', 'Real ingredients', 'Signature flavours', 'Our craft', 'The menu', 'The café', 'See you soon'];
