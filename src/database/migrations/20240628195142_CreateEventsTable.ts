import { Knex } from 'knex';

/**
 * Create 'events' table.
 * @param {Knex} knex - Knex instance for running queries.
 * @returns {Promise<void>}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('events', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('description').notNullable();
    table.string('location').nullable();
    table.dateTime('date').notNullable();
    table.timestamps(true, true);
  });
}

/**
 * Drop 'events' table.
 * @param {Knex} knex - Knex instance for running queries.
 * @returns {Promise<void>}
 */
export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('events');
}
