const { Client } = require('pg');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

async function runMigration() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
  });

  try {
    await client.connect();
    console.log('Conectado a la base de datos');

    const sql = fs.readFileSync('add-github.sql', 'utf8');
    await client.query(sql);
    console.log('Migración ejecutada exitosamente');
  } catch (error) {
    console.error('Error ejecutando migración:', error);
  } finally {
    await client.end();
  }
}

runMigration();
