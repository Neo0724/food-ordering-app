export type FoodType = {
  id: string;
  name: string;
  description: string;
  imgUrl?: string;
  createdAt: string;
  ingredients: string[];
  calories: number;
  quantity: number;
  sizeWithPrice: Record<string, number>;
};

export const sampleFoods: FoodType[] = [
  {
    id: '1',
    name: 'Spaghetti Bolognese',
    description: 'Classic Italian pasta with rich meat sauce.',
    imgUrl: 'https://example.com/spaghetti.jpg',
    createdAt: new Date().toISOString(),
    ingredients: ['Pasta', 'Tomato Sauce', 'Beef', 'Garlic', 'Parmesan'],
    calories: 650,
    quantity: 20,
    sizeWithPrice: {S: 12.99, M: 13.99, L: 15.99},
  },
  {
    id: '2',
    name: 'Cheeseburger',
    description:
      'Juicy beef patty with melted cheddar cheese, lettuce, and pickles.',
    imgUrl: 'https://example.com/cheeseburger.jpg',
    createdAt: new Date().toISOString(),
    ingredients: ['Beef Patty', 'Cheddar Cheese', 'Lettuce', 'Pickles', 'Bun'],
    calories: 850,
    quantity: 15,
    sizeWithPrice: {S: 8.99, M: 9.99, L: 11.99},
  },
  {
    id: '3',
    name: 'Caesar Salad',
    description:
      'Fresh romaine lettuce with Caesar dressing, croutons, and parmesan.',
    imgUrl: 'https://example.com/caesarsalad.jpg',
    createdAt: new Date().toISOString(),
    ingredients: ['Romaine Lettuce', 'Caesar Dressing', 'Croutons', 'Parmesan'],
    calories: 450,
    quantity: 25,
    sizeWithPrice: {S: 7.99, M: 9.99, L: 11.99},
  },
  {
    id: '4',
    name: 'Margherita Pizza',
    description: 'Classic pizza with fresh mozzarella, tomatoes, and basil.',
    imgUrl: 'https://example.com/margheritapizza.jpg',
    createdAt: new Date().toISOString(),
    ingredients: ['Mozzarella', 'Tomatoes', 'Basil', 'Olive Oil'],
    calories: 900,
    quantity: 30,
    sizeWithPrice: {S: 10.99, M: 12.99, L: 14.99},
  },
  {
    id: '5',
    name: 'Chicken Alfredo',
    description: 'Creamy pasta with grilled chicken and Alfredo sauce.',
    imgUrl: 'https://example.com/chickenalfredo.jpg',
    createdAt: new Date().toISOString(),
    ingredients: ['Chicken', 'Alfredo Sauce', 'Pasta', 'Garlic', 'Parmesan'],
    calories: 700,
    quantity: 18,
    sizeWithPrice: {S: 13.99, M: 15.99, L: 17.99},
  },
  {
    id: '6',
    name: 'Beef Tacos',
    description: 'Soft tacos with seasoned beef, lettuce, cheese, and salsa.',
    imgUrl: 'https://example.com/beeftacos.jpg',
    createdAt: new Date().toISOString(),
    ingredients: ['Ground Beef', 'Lettuce', 'Cheese', 'Taco Shells', 'Salsa'],
    calories: 500,
    quantity: 40,
    sizeWithPrice: {S: 5.99, M: 6.99, L: 7.99},
  },
  {
    id: '7',
    name: 'Vegetarian Pizza',
    description:
      'Pizza loaded with vegetables like mushrooms, peppers, and onions.',
    imgUrl: 'https://example.com/vegetarianpizza.jpg',
    createdAt: new Date().toISOString(),
    ingredients: [
      'Mushrooms',
      'Bell Peppers',
      'Olives',
      'Onions',
      'Mozzarella',
    ],
    calories: 750,
    quantity: 20,
    sizeWithPrice: {S: 9.99, M: 11.99, L: 13.99},
  },
  {
    id: '8',
    name: 'Chicken Wings',
    description: 'Crispy chicken wings tossed in hot buffalo sauce.',
    imgUrl: 'https://example.com/chickenwings.jpg',
    createdAt: new Date().toISOString(),
    ingredients: ['Chicken Wings', 'Buffalo Sauce', 'Garlic', 'Butter'],
    calories: 600,
    quantity: 35,
    sizeWithPrice: {S: 7.99, M: 9.99, L: 11.99},
  },
  {
    id: '9',
    name: 'Fish and Chips',
    description: 'Battered fish fillets with crispy golden fries.',
    imgUrl: 'https://example.com/fishandchips.jpg',
    createdAt: new Date().toISOString(),
    ingredients: ['Fish', 'Batter', 'Fries', 'Tartar Sauce'],
    calories: 950,
    quantity: 30,
    sizeWithPrice: {S: 11.99, M: 13.99, L: 15.99},
  },
  {
    id: '10',
    name: 'Pasta Primavera',
    description:
      'Pasta with a mix of fresh vegetables and a light garlic sauce.',
    imgUrl: 'https://example.com/pastaprimavera.jpg',
    createdAt: new Date().toISOString(),
    ingredients: ['Pasta', 'Tomatoes', 'Bell Peppers', 'Zucchini', 'Garlic'],
    calories: 550,
    quantity: 20,
    sizeWithPrice: {S: 10.99, M: 12.99, L: 14.99},
  },
];
