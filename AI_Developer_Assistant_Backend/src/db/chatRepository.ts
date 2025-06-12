
import { db } from './db'; 

export async function saveChatLog(question: string, response: string) {
  const sql = 'INSERT INTO chat_logs (question, response) VALUES (?, ?)';
  
  try {
     const result= await db.execute(sql, [question, response]);
     console.log('✅ Insert result:', result);
  } catch (error)  {
    console.error('❌ DB Insert Error:', error);
    throw error;

  }
  
}

export async function getAllChatLogs() {
  const sql = 'SELECT id, question, response, created_at FROM chat_logs ORDER BY created_at DESC';

  try {
    const [rows] = await db.query(sql);
    return rows;
  } catch (error) {
    console.error('❌ DB Fetch Error:', error);
    throw error;
  }
}