import { postgres } from 'postgres';

const sql = postgres(process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/mydb', {
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function migrate() {
  try {
    console.log('🔄 Running database migrations...');

    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create posts table
    await sql`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create indexes for better performance
    await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at)`;

    // Create updated_at trigger function
    await sql`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql'
    `;

    // Create triggers for updated_at
    await sql`
      DROP TRIGGER IF EXISTS update_users_updated_at ON users
    `;
    await sql`
      CREATE TRIGGER update_users_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column()
    `;

    await sql`
      DROP TRIGGER IF EXISTS update_posts_updated_at ON posts
    `;
    await sql`
      CREATE TRIGGER update_posts_updated_at
        BEFORE UPDATE ON posts
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column()
    `;

    console.log('✅ Database migrations completed successfully');
    await sql.end();
  } catch (error) {
    console.error('❌ Database migration failed:', error);
    process.exit(1);
  }
}

// Run migrations if this file is executed directly
if (import.meta.main) {
  migrate();
}

export { migrate };
