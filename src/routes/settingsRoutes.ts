import express from 'express';
import { SettingsController } from '../controllers/SettingsController';

export const settingsRoutes = (settingsController: SettingsController) => {
  const router = express.Router();

  router.get('/settings/:clientId', settingsController.getSettings);
  router.put('/settings/:clientId', settingsController.updateSettings);

  return router;
};
