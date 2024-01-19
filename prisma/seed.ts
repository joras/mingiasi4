import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
async function main() {
  // create random toys
  await Promise.all(
    // TODO: add more adjectives to the function to allow more than 100 toys.
    createRandomToys(100).map((toy) =>
      prisma.product.upsert({
        where: { name: toy.name, id: undefined },
        update: {},
        create: { ...toy },
      }),
    ),
  );

  // TODO: create fixed toys, for testing
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

function createRandomToys(count: number) {
  const toyTypes = [
    'Teddy Bear',
    'Lego',
    'Car',
    'Doll',
    'Puzzle',
    'Figure',
    'Drone',
    'Train',
    'Robot',
    'Unicorn',
    'Rocket',
  ];
  const adjectives = [
    'Cuddly',
    'Speedy',
    'Delightful',
    'Magical',
    'Mini',
    'Giant',
    'Flying',
    'Dancing',
    'Remote-Controlled',
    'Interactive',
  ];
  const colors = [
    'Red',
    'Blue',
    'Green',
    'Yellow',
    'Pink',
    'Purple',
    'Orange',
    'Black',
    'White',
    'Silver',
  ];
  const sizes = ['Small', 'Medium', 'Large', 'Extra Large'];
  const priceRange = { min: 5, max: 1000 };

  // Helper function to get a random integer
  const getRandomInt = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  // Helper function to get a random item from an array
  const getRandomItem = <T>(array: T[]): T =>
    array[Math.floor(Math.random() * array.length)];

  // Helper function that uses a Set to generate unique names
  const generateUniqueNames = (
    count: number,
    toyTypes: string[],
    adjectives: string[],
  ): string[] => {
    const nameSet = new Set<string>();
    while (nameSet.size < count) {
      const name = `${getRandomItem(adjectives)} ${getRandomItem(toyTypes)}`;
      nameSet.add(name);
    }
    return Array.from(nameSet);
  };

  const uniqueNames = generateUniqueNames(count, toyTypes, adjectives);
  return uniqueNames.map((name) => {
    return {
      name,
      color: getRandomItem(colors),
      size: getRandomItem(sizes),
      price: getRandomInt(priceRange.min, priceRange.max),
    };
  });
}
