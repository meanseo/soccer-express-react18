import express from 'express';
import cors from 'cors';

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
}
const app = express()
app.use(cors());

export default app