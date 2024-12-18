import { Request, Response } from 'express';
import { SettingsDAL } from '../dal/settings.dal';
import { settingsSchema } from '../validators/settingsCalidator';

export class SettingsController {
  private settingsDAL: SettingsDAL;

  constructor(settingsDAL: SettingsDAL) {
    this.settingsDAL = settingsDAL;
  }

  /**
   * Handles the GET to obtain configuration by clientId.
   */
  public getSettings = async (req: Request, res: Response): Promise<void> => {
    const clientId = parseInt(req.params.clientId, 10);

    if (isNaN(clientId)) {
      res.status(400).json({ error: 'Invalid clientId' });
      return;
    }

    try {
      let settings = await this.settingsDAL.findSettingsByClientId(clientId);

      if (!settings) {
        settings = await this.settingsDAL.saveDefaultSettings(clientId);
      }

      res.status(200).json(settings);
    } catch (error) {
      console.error('Error retrieving settings:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  /**
   * Handles the PUT to update configuration by clientId.
   */
  public updateSettings = async (req: Request, res: Response): Promise<void> => {
    const clientId = parseInt(req.params.clientId, 10);
    const updateData = req.body;

    if (isNaN(clientId)) {
      res.status(400).json({ error: 'Invalid clientId' });
      return;
    }

    const validationResult = settingsSchema.safeParse(updateData);
    if (!validationResult.success) {
      res.status(400).json({
        error: 'Invalid data format',
        details: validationResult.error.errors,
      });
      return;
    }

    try {
      const result = await this.settingsDAL.updateSettingsByClientId(clientId, updateData);

      if (result.matchedCount === 0) {
        res.status(404).json({ error: 'Settings not found for the given clientId' });
        return;
      }

      res.status(200).json({ message: 'Settings updated successfully' });
    } catch (error) {
      console.error('Error updating settings:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}
