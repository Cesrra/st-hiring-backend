import { Db, Collection, UpdateResult } from 'mongodb';
import { getDefaultSettings } from './defaultSettings';
import { Settings } from '../interfaces/Settings';

export class SettingsDAL {
  private collection: Collection<Settings>;

  constructor(db: Db) {
    this.collection = db.collection('settings');
  }

  /**
   * Search configuration by clientId.
   * @param clientId - Client ID.
   */
  async findSettingsByClientId(clientId: number): Promise<Settings | null> {
    return this.collection.findOne({ clientId });
  }

  /**
   * Save a default document for a client.
   * @param clientId - Client ID.
   */
  async saveDefaultSettings(clientId: number): Promise<Settings> {
    const defaultSettings = getDefaultSettings(clientId);
    await this.collection.insertOne(defaultSettings);
    return defaultSettings;
  }

  /**
   * Update existing configuration by clientId.
   * @param clientId - Client ID.
   * @param updateData - New data to update.
   */
  async updateSettingsByClientId(clientId: number, updateData: Partial<Settings>): Promise<UpdateResult> {
    const result = await this.collection.updateOne({ clientId }, { $set: updateData });
    return result;
  }
}
