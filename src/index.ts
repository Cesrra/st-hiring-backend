import express from 'express';
import { knex } from 'knex';
import dbConfig from './knexfile';
import { createEventDAL } from './dal/events.dal';
import { createTicketDAL } from './dal/tickets.dal';
import { createGetEventsController } from './controllers/get-events';
import { connectToMongo } from './database/mongoClient';
import { SettingsDAL } from './dal/settings.dal';
import { SettingsController } from './controllers/SettingsController';
import { settingsRoutes } from './routes/settingsRoutes';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Express App
const app = express();
app.use(express.json());

// CORS Configuration
const corsOrigin = process?.env.CORS_ORIGIN;
app.use(cors({ origin: corsOrigin }));

// initialize Knex
const Knex = knex(dbConfig.development);

// Initialize DALs
const eventDAL = createEventDAL(Knex);
const TicketDAL = createTicketDAL(Knex);

// Connect to MongoDB and Initialize Settings DAL/Controller
const initializeRoutes = async () => {
  const mongoDb = await connectToMongo();
  const settingsDAL = new SettingsDAL(mongoDb);
  const settingsController = new SettingsController(settingsDAL);

  // Routes
  app.use('/health', (_req, res) => res.json({ status: 'ok' }));
  app.use('/events', createGetEventsController({ eventsDAL: eventDAL, ticketsDAL: TicketDAL }));
  app.use('/', settingsRoutes(settingsController));
};

initializeRoutes()
  .then(() => {
    app.listen(3000, () => {
      console.log('Server Started');
    });
  })
  .catch((err) => {
    console.error('Error initializing routes:', err);
  });
