import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'yourpassword',
  database: process.env.DB_NAME || 'ai_chat_db2025',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});


// Retry logic for the connection
async function connectWithRetry(attemptsRemaining: number) {
  if (attemptsRemaining === 0) {
    console.error('❌ Max attempts reached. Could not connect to the database.');
    return;
  }

  try {
    const connection = await db.getConnection();
    await connection.ping(); // simple lightweight check
    console.log('✅ Connected to the database.');
    connection.release();
  } catch (err: any) {
    console.error('⚠️ Error connecting to the database:', err.message);
    console.log(`🔁 Retrying... Attempts remaining: ${attemptsRemaining - 1}`);
    setTimeout(() => connectWithRetry(attemptsRemaining - 1), 2000); // Retry after 2 seconds
  }
}

// Start connection attempts
connectWithRetry(5);