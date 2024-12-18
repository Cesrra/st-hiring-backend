import type { Knex } from 'knex';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });
console.log(process.env.DATABASE_URL)

const dbConfig: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: path.resolve(__dirname, './database/migrations'),
    },
    seeds: {
      directory: path.resolve(__dirname, './database/seeds'),
    },
  },
};

export default dbConfig;
