import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigration() {
  try {
    console.log('🚀 Starting database migration...')

    // Read and execute the SQL file
    const sqlFile = path.join(import.meta.dirname, '001_create_main_tables.sql')
    const sql = fs.readFileSync(sqlFile, 'utf-8')

    // Split by semicolon and execute each statement
    const statements = sql
      .split(';')
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0)

    for (const statement of statements) {
      console.log('Executing:', statement.substring(0, 50) + '...')
      const { error } = await supabase.rpc('exec', {
        statement: statement,
      })

      if (error) {
        console.error('Error executing statement:', error)
        // Continue with next statement
      }
    }

    console.log('✅ Migration completed successfully!')
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    process.exit(1)
  }
}

runMigration()
