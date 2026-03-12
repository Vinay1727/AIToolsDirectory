from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

def get_supabase_client():
    url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    key = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
    if not url or not key:
        print("Supabase credentials not found in .env")
        return None
    return create_client(url, key)

def insert_to_supabase(data):
    supabase = get_supabase_client()
    if not supabase:
        return
    
    print(f"Upserting {len(data)} tools to Supabase...")
    try:
        # Using upsert with on_conflict on website_url or name
        # Assuming table name is 'tools'
        response = supabase.table("tools").upsert(data, on_conflict="website_url").execute()
        print("Supabase update complete.")
    except Exception as e:
        print(f"Error inserting to Supabase: {e}")
