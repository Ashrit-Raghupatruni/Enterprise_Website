import prisma from '../src/config/prisma.js';
import bcrypt from 'bcrypt';

async function createAdminUser() {
  try {
    console.log('👤 Creating admin user...\n');

    const email = 'kishor@gmail.com';
    const password = '12345678';
    const username = 'kishor_admin';

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      if (existingUser.role === 'ADMIN') {
        console.log(`⚠️  Admin user already exists with email: ${email}`);
        console.log(`    Username: ${existingUser.username}`);
        console.log(`    Role: ${existingUser.role}`);
      } else {
        console.log(`✓ Updating user ${email} to ADMIN role`);
        const updated = await prisma.user.update({
          where: { email },
          data: { role: 'ADMIN' }
        });
        console.log(`✓ User upgraded to ADMIN`);
        console.log(`\n📋 Admin User Created:`);
        console.log(`   Email: ${updated.email}`);
        console.log(`   Username: ${updated.username}`);
        console.log(`   Role: ${updated.role}`);
      }
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        email,
        username,
        password_hash: hashedPassword,
        role: 'ADMIN',
        phone_number: '9876543210', // Unique phone number for admin
        gender: 'PREFER_NOT_TO_SAY'
      }
    });

    console.log(`✅ Admin user created successfully!\n`);
    console.log(`📋 Login Credentials:`);
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Username: ${adminUser.username}`);
    console.log(`   Password: ${password}`);
    console.log(`   Role: ${adminUser.role}`);
    console.log(`   ID: ${adminUser.id}`);
    console.log(`\n✓ You can now login at /auth with these credentials`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to create admin user:', err.message);
    process.exit(1);
  }
}

createAdminUser();
