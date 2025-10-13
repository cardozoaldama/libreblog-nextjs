const { Client } = require('pg')
const fs = require('fs')
require('dotenv').config()

const client = new Client({
  connectionString: process.env.DIRECT_URL,
})

async function applyMigration() {
  try {
    await client.connect()
    console.log('Conectado a la base de datos')

    const sql = fs.readFileSync('add-social-links.sql', 'utf8')
    const queries = sql.split(';').filter(q => q.trim())

    for (const query of queries) {
      await client.query(query)
      console.log('✓ Query ejecutada')
    }

    console.log('\n✅ Migración aplicada exitosamente')
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await client.end()
  }
}

applyMigration()
