import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';
import { SettingsDAL } from '../../dal/settings.dal';
import { getDefaultSettings } from '../../dal/defaultSettings';

let mongoServer: MongoMemoryServer;
let client: MongoClient;
let dal: SettingsDAL;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  client = new MongoClient(mongoServer.getUri());
  await client.connect();

  dal = new SettingsDAL(client.db());
});

afterAll(async () => {
  await client.close();
  await mongoServer.stop();
});

test('findSettingsByClientId: Should return null if no settings exist', async () => {
  const result = await dal.findSettingsByClientId(1);
  expect(result).toBeNull();
});

test('findSettingsByClientId: Should return settings for a given clientId', async () => {
  const clientId = 1;
  const mockSettings = getDefaultSettings(clientId);
  await dal.saveDefaultSettings(clientId);

  const result = await dal.findSettingsByClientId(clientId);
  expect(result).toMatchObject(mockSettings);
});
