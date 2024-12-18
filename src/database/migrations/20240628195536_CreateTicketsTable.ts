import { Knex } from 'knex';

/**
 * Create 'tickets' table.
 * @param {Knex} knex - Knex instance for running queries.
 * @returns {Promise<void>}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('tickets', (table) => {
    table.increments('id').primary();
    table.integer('event_id').unsigned().notNullable();
    table.string('status').notNullable();
    table.string('type').notNullable();
    table.integer('price').notNullable();
    table.timestamps(true, true);

    // Foreign key referencing 'events' table
    table.foreign('event_id').references('id').inTable('events').onDelete('CASCADE');
  });
}

/**
 * Drop 'tickets' table.
 * @param {Knex} knex - Knex instance for running queries.
 * @returns {Promise<void>}
 */
export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('tickets');
}
