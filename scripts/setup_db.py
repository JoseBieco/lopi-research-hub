#!/usr/bin/env python3
import os
import sys
import requests
import json
from pathlib import Path

# Get environment variables
supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

if not supabase_url or not supabase_key:
    print("❌ Missing environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
    sys.exit(1)

# Read the SQL file
sql_file = Path(__file__).parent / '001_create_main_tables.sql'
with open(sql_file, 'r') as f:
    sql_content = f.read()

# Split into statements
statements = [s.strip() for s in sql_content.split(';') if s.strip()]

print(f"🚀 Running {len(statements)} SQL statements...")

headers = {
    'Authorization': f'Bearer {supabase_key}',
    'Content-Type': 'application/json',
    'apikey': supabase_key
}

for i, statement in enumerate(statements, 1):
    print(f"[{i}/{len(statements)}] {statement[:60]}...")
    
    payload = {
        "query": statement
    }
    
    try:
        response = requests.post(
            f"{supabase_url}/rest/v1/rpc/exec",
            headers=headers,
            json=payload
        )
        
        if response.status_code not in [200, 201, 204]:
            print(f"  ⚠️  Status {response.status_code}: {response.text}")
        else:
            print(f"  ✅ OK")
    except Exception as e:
        print(f"  ❌ Error: {str(e)}")

print("\n✅ Database setup completed!")
