import prisma from '../src/config/prisma.js';

const defaultAttributes = [
  {
    name: 'Color',
    displayName: 'Color',
    values: [
      { value: 'red', displayValue: 'Red' },
      { value: 'blue', displayValue: 'Blue' },
      { value: 'black', displayValue: 'Black' },
      { value: 'silver', displayValue: 'Silver' },
      { value: 'titanium', displayValue: 'Titanium' }
    ]
  },
  {
    name: 'Size',
    displayName: 'Size',
    values: [
      { value: 'S', displayValue: 'Small' },
      { value: 'M', displayValue: 'Medium' },
      { value: 'L', displayValue: 'Large' },
      { value: 'XL', displayValue: 'Extra Large' },
      { value: 'XXL', displayValue: 'XXL' }
    ]
  },
  {
    name: 'Storage',
    displayName: 'Storage',
    values: [
      { value: '128gb', displayValue: '128GB' },
      { value: '256gb', displayValue: '256GB' },
      { value: '512gb', displayValue: '512GB' },
      { value: '1tb', displayValue: '1TB' }
    ]
  },
  {
    name: 'RAM',
    displayName: 'RAM',
    values: [
      { value: '4gb', displayValue: '4GB' },
      { value: '6gb', displayValue: '6GB' },
      { value: '8gb', displayValue: '8GB' },
      { value: '12gb', displayValue: '12GB' },
      { value: '16gb', displayValue: '16GB' }
    ]
  }
];

async function seedAttributes() {
  try {
    console.log('🌱 Seeding default variant attributes...\n');

    for (const attrData of defaultAttributes) {
      // Check if attribute already exists
      const existing = await prisma.variantAttribute.findUnique({
        where: { name: attrData.name }
      });

      if (existing) {
        console.log(`✓ Attribute "${attrData.name}" already exists, skipping...`);
        continue;
      }

      // Create attribute with values
      const attribute = await prisma.variantAttribute.create({
        data: {
          name: attrData.name,
          displayName: attrData.displayName,
          values: {
            createMany: {
              data: attrData.values
            }
          }
        },
        include: { values: true }
      });

      console.log(`✓ Created attribute: "${attribute.name}" with ${attribute.values.length} values`);
      attribute.values.forEach(val => {
        console.log(`  - ${val.value} (${val.displayValue})`);
      });
      console.log();
    }

    console.log('✅ Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seedAttributes();
