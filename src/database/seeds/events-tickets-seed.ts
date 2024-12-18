import { Knex } from 'knex';
import { faker } from '@faker-js/faker';

/**
 * Seed function to populate 'events' and 'tickets' tables.
 * @param knex - Knex instance.
 */
export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('tickets').del();
  await knex('events').del();
  const batchSize = 10;

  // Insert events
  const events = [];
  for (let i = 0; i < 100; i++) {
    events.push({
      name: faker.lorem.words(),
      description: faker.lorem.paragraph(),
      date: faker.date.future(),
      location: faker.location.city(),
      created_at: new Date(),
      updated_at: new Date(),
    });
    if (events.length === batchSize) {
      await knex('events').insert(events);
      events.length = 0;
    }
  }

  if (events.length > 0) await knex('events').insert(events);

  const insertedEvents = await knex('events').select('id');

  // Insert tickets for each event
  const tickets = [];
  for (const event of insertedEvents) {
    for (let j = 0; j < 500; j++) {
      tickets.push({
        event_id: event.id,
        status: faker.helpers.arrayElement(['available', 'sold', 'reserved']),
        type: 'general',
        price: faker.datatype.number({ min: 500, max: 10000 }),
        created_at: new Date(),
        updated_at: new Date(),
      });
      if (tickets.length === batchSize) {
        await knex('tickets').insert(tickets);
        tickets.length = 0;
      }
    }
  }

  if (tickets.length > 0) await knex('tickets').insert(tickets);
}
