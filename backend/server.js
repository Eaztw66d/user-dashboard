import express from 'express';
import colors from 'colors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

import userRoutes from './routes/userRoutes.js'


dotenv.config();

connectDB();

const app = express();

app.use(morgan('dev'));

app.use(express.json());

app.use('/api/users', userRoutes);

app.use(notFound);
app.use(errorHandler);


const Port = process.env.PORT || 5000;

app.listen(Port, console.log(`Server running on PORT: ${Port}....`.green.bold));