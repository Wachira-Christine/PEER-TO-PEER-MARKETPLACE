from werkzeug.security import generate_password_hash, check_password_hash
from models.database import supabase


def create_user(email, password, name):
    """Create a new user in the database"""
    if not supabase:
        return None, "Database connection failed"

    # Check if user already exists
    existing = supabase.table('users').select('*').eq('email', email).execute()
    if existing.data:
        return None, "Email already exists"

    hashed_password = generate_password_hash(password)

    try:
        result = supabase.table('users').insert({
            'email': email,
            'password': hashed_password,
            'name': name
        }).execute()

        if result.data:
            return result.data[0], None
        return None, "Failed to create user"
    except Exception as e:
        return None, str(e)


def authenticate_user(email, password):
    """Authenticate user and return user data if successful"""
    if not supabase:
        return None, "Database connection failed"

    result = supabase.table('users').select('*').eq('email', email).execute()

    if not result.data:
        return None, "Invalid credentials"

    user = result.data[0]

    if check_password_hash(user['password'], password):
        # Remove password from returned user data
        user_data = {
            'id': user['id'],
            'email': user['email'],
            'name': user['name'],
            'phone': user.get('phone'),
            'mpesa_number': user.get('mpesa_number'),
            'description': user.get('description')
        }
        return user_data, None

    return None, "Invalid credentials"