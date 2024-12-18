import { Db, Collection, UpdateResult } from 'mongodb';
import { getDefaultSettings } from './defaultSettings';

export class SettingsDAL {
  private collection: Collection;

  constructor(db: Db) {
    this.collection = db.collection('settings');
  }

  /**
   * Search configuration by clientId.
   * @param clientId - Client ID.
   */
  async findSettingsByClientId(clientId: number): Promise<any | null> {
    return this.collection.findOne({ clientId });
  }

  /**
   * Save a default document for a client.
   * @param clientId - Client ID.
   */
  async saveDefaultSettings(clientId: number): Promise<any> {
    const defaultSettings = getDefaultSettings(clientId);
    await this.collection.insertOne(defaultSettings);
    return defaultSettings;
  }

  /**
   * Update existing configuration by clientId.
   * @param clientId - Client ID.
   * @param updateData - New data to update.
   */
  async updateSettingsByClientId(clientId: number, updateData: any): Promise<UpdateResult> {
    const result = await this.collection.updateOne(
      { clientId },
      { $set: updateData }
    );
    return result;
  }
}
