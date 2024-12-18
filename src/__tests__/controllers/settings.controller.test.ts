import { Request, Response } from 'express';
import { SettingsDAL } from '../../dal/settings.dal';
import { SettingsController } from '../../controllers/SettingsController';
import { getDefaultSettings } from '../../dal/defaultSettings';

let mockDAL: Partial<SettingsDAL>;
let controller: SettingsController;

beforeEach(() => {
  mockDAL = {
    findSettingsByClientId: jest.fn(),
    saveDefaultSettings: jest.fn(),
    updateSettingsByClientId: jest.fn(),
  };
  controller = new SettingsController(mockDAL as SettingsDAL);
});

test('getSettings: Should return settings for a valid clientId', async () => {
  const clientId = 1;
  const mockSettings = getDefaultSettings(clientId);

  const mockRequest = { params: { clientId: '1' } } as unknown as Request;
  const mockResponse = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  } as unknown as Response;

  (mockDAL.findSettingsByClientId as jest.Mock).mockResolvedValue(mockSettings);

  await controller.getSettings(mockRequest, mockResponse);
  expect(mockResponse.json).toHaveBeenCalledWith(mockSettings);
});

test('getSettings: Should create default settings for a missing clientId', async () => {
  const clientId = 2;
  const defaultSettings = getDefaultSettings(clientId);

  const mockRequest = { params: { clientId: '2' } } as unknown as Request;
  const mockResponse = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  } as unknown as Response;

  (mockDAL.findSettingsByClientId as jest.Mock).mockResolvedValue(null);
  (mockDAL.saveDefaultSettings as jest.Mock).mockResolvedValue(defaultSettings);

  await controller.getSettings(mockRequest, mockResponse);
  expect(mockResponse.json).toHaveBeenCalledWith(defaultSettings);
});

test('getSettings: Should return 400 for invalid clientId', async () => {
  const mockRequest = { params: { clientId: 'abc' } } as unknown as Request;
  const mockResponse = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  } as unknown as Response;

  await controller.getSettings(mockRequest, mockResponse);
  expect(mockResponse.status).toHaveBeenCalledWith(400);
  expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid clientId' });
});

test('updateSettings: Should update settings for a valid clientId', async () => {
  const updateData = {
    deliveryMethods: [
      {
        name: 'Print Now',
        enum: 'PRINT_NOW',
        order: 1,
        isDefault: true,
        selected: true,
      },
    ],
    fulfillmentFormat: { rfid: true, print: false },
    printer: { id: null },
    printingFormat: { formatA: true, formatB: false },
    scanning: { scanManually: true, scanWhenComplete: false },
    paymentMethods: { cash: false, creditCard: true, comp: false },
    ticketDisplay: { leftInAllotment: true, soldOut: false },
    customerInfo: { active: true, basicInfo: false, addressInfo: false },
  };

  const mockRequest = {
    params: { clientId: '1' },
    body: updateData,
  } as unknown as Request;

  const mockResponse = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  } as unknown as Response;

  (mockDAL.updateSettingsByClientId as jest.Mock).mockResolvedValue({ matchedCount: 1 });

  await controller.updateSettings(mockRequest, mockResponse);
  expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Settings updated successfully' });
});

test('updateSettings: Should return 404 if clientId does not exist', async () => {
  const mockRequest = {
    params: { clientId: '2' },
    body: {
      deliveryMethods: [
        {
          name: 'Print Now',
          enum: 'PRINT_NOW',
          order: 1,
          isDefault: true,
          selected: true,
        },
      ],
      fulfillmentFormat: { rfid: true, print: false },
      printer: { id: null },
      printingFormat: { formatA: true, formatB: false },
      scanning: { scanManually: true, scanWhenComplete: false },
      paymentMethods: { cash: false, creditCard: true, comp: false },
      ticketDisplay: { leftInAllotment: true, soldOut: false },
      customerInfo: { active: true, basicInfo: false, addressInfo: false },
    },
  } as unknown as Request;

  const mockResponse = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  } as unknown as Response;

  (mockDAL.updateSettingsByClientId as jest.Mock).mockResolvedValue({ matchedCount: 0 });

  await controller.updateSettings(mockRequest, mockResponse);
  expect(mockResponse.status).toHaveBeenCalledWith(404);
  expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Settings not found for the given clientId' });
});

test('updateSettings: Should return 400 for invalid data', async () => {
  const mockRequest = {
    params: { clientId: '1' },
    body: { scanning: { scanManually: 'notBoolean' } },
  } as unknown as Request;

  const mockResponse = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  } as unknown as Response;

  await controller.updateSettings(mockRequest, mockResponse);
  expect(mockResponse.status).toHaveBeenCalledWith(400);
  expect(mockResponse.json).toHaveBeenCalledWith({
    error: 'Invalid data format',
    details: expect.any(Array),
  });
});
