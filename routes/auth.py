from flask import Blueprint, request, session, jsonify
from utils.auth import create_user, authenticate_user
from models.database import supabase, get_current_user_id

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')

    if not all([email, password, name]):
        return jsonify({'error': 'Missing required fields'}), 400

    user, error = create_user(email, password, name)
    if error:
        return jsonify({'error': error}), 400

    return jsonify({'message': 'User created successfully'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Missing email or password'}), 400

    user, error = authenticate_user(email, password)
    if error:
        return jsonify({'error': error}), 401

    # Set session
    session.permanent = True
    session['user_id'] = user['id']

    return jsonify(user), 200

@auth_bp.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logged out successfully'}), 200

@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    user_id = get_current_user_id()

    if not user_id:
        return jsonify({'error': 'Not authenticated'}), 401

    if not supabase:
        return jsonify({'error': 'Database connection failed'}), 500

    result = supabase.table('users').select(
        'id, email, name, phone, mpesa_number, description'
    ).eq('id', user_id).execute()

    if result.data:
        return jsonify(result.data[0]), 200
    return jsonify({'error': 'User not found'}), 404