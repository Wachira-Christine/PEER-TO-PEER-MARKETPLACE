import os
from supabase import create_client, Client
from config import Config

# Simple global Supabase client - just like your original working code
try:
    supabase = create_client(Config.SUPABASE_URL, Config.SUPABASE_KEY)
    print("✅ Supabase client initialized successfully!")
except Exception as e:
    print(f"❌ Error initializing Supabase client. {e}")
    supabase = None

def get_current_user_id():
    """Get current user ID from session"""
    from flask import session
    return session.get('user_id')