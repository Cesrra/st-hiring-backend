import { z } from 'zod';

export const settingsSchema = z.object({
  deliveryMethods: z
    .array(
      z.object({
        name: z.string(),
        enum: z.string(),
        order: z.number(),
        isDefault: z.boolean(),
        selected: z.boolean(),
      })
    )
    .nonempty(),

  fulfillmentFormat: z.object({
    rfid: z.boolean(),
    print: z.boolean(),
  }),

  printer: z.object({
    id: z.number().nullable(),
  }),

  printingFormat: z.object({
    formatA: z.boolean(),
    formatB: z.boolean(),
  }),

  scanning: z.object({
    scanManually: z.boolean(),
    scanWhenComplete: z.boolean(),
  }),

  paymentMethods: z.object({
    cash: z.boolean(),
    creditCard: z.boolean(),
    comp: z.boolean(),
  }),

  ticketDisplay: z.object({
    leftInAllotment: z.boolean(),
    soldOut: z.boolean(),
  }),

  customerInfo: z.object({
    active: z.boolean(),
    basicInfo: z.boolean(),
    addressInfo: z.boolean(),
  }),
});
