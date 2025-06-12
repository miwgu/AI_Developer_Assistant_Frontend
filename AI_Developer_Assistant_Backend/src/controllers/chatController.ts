import { Request, Response } from 'express';
import { handleChatQuery } from '../domain/chatHandler';
import { getAllChatLogs } from '../db/chatRepository';

interface ChatRequestBody {
  message: string;
}

export const postQuery= async(req: Request<{}, {}, ChatRequestBody>, res: Response) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
     const stream = await handleChatQuery(message);

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    for await (const token of stream) {
      res.write(token);
    }
    res.end();

  } catch (error) {
    console.error('❌ Controller error:',error);
    res.status(500).json({ error: 'Server error during chat handling' });
  }
}

export const getChats = async (req: Request, res: Response) => {
  try {
    const chatLogs = await getAllChatLogs();
    res.json(chatLogs);
  } catch (error) {
    console.error('❌ Error fetching chat logs:', error);
    res.status(500).json({ error: 'Failed to fetch chat logs' });
  }
};