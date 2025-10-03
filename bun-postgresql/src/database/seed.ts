import { postgres } from 'postgres';

const sql = postgres(process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/mydb', {
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function seed() {
  try {
    console.log('🌱 Seeding database with sample data...');

    // Check if users table has data
    const userCount = await sql`SELECT COUNT(*) as count FROM users`;
    
    if (userCount[0].count > 0) {
      console.log('ℹ️  Database already has data, skipping seed');
      await sql.end();
      return;
    }

    // Insert sample users
    const users = await sql`
      INSERT INTO users (name, email) VALUES
        ('John Doe', 'john@example.com'),
        ('Jane Smith', 'jane@example.com'),
        ('Bob Johnson', 'bob@example.com')
      RETURNING *
    `;

    console.log(`✅ Created ${users.length} sample users`);

    // Insert sample posts
    const posts = await sql`
      INSERT INTO posts (title, content, user_id) VALUES
        ('Welcome to Bun + PostgreSQL', 'This is the first post in our Bun + PostgreSQL API template!', ${users[0].id}),
        ('Getting Started with Railway', 'Learn how to deploy your Bun applications to Railway with ease.', ${users[1].id}),
        ('TypeScript Best Practices', 'Discover the best practices for writing TypeScript applications with Bun.', ${users[2].id}),
        ('Database Design Tips', 'Essential tips for designing efficient PostgreSQL databases.', ${users[0].id}),
        ('API Development Patterns', 'Common patterns and best practices for REST API development.', ${users[1].id})
      RETURNING *
    `;

    console.log(`✅ Created ${posts.length} sample posts`);
    console.log('🌱 Database seeding completed successfully');
    
    await sql.end();
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
}

// Run seed if this file is executed directly
if (import.meta.main) {
  seed();
}

export { seed };
