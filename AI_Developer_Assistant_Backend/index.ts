import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import router from './src/routes/chatRoutes';
import './src/db/db';





const app = express();
const port = process.env.PORT || 3000;

const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173'

app.use(cors({
  origin: frontendOrigin,
}));

app.use(express.json());

app.use('/api', router);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
