from flask import Blueprint, request, jsonify
from models.database import supabase, get_current_user_id

profile_bp = Blueprint('profile', __name__)


@profile_bp.route('/profile', methods=['GET', 'PUT'])
def profile():
    user_id = get_current_user_id()

    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    if not supabase:
        return jsonify({'error': 'Database connection failed'}), 500

    if request.method == 'GET':
        result = supabase.table('users').select(
            'id, email, name, phone, mpesa_number, description'
        ).eq('id', user_id).execute()

        if result.data:
            return jsonify(result.data[0]), 200
        return jsonify({'error': 'User not found'}), 404

    elif request.method == 'PUT':
        data = request.json
        update_data = {}

        if 'name' in data:
            update_data['name'] = data['name']
        if 'phone' in data:
            update_data['phone'] = data['phone']
        if 'mpesa_number' in data:
            update_data['mpesa_number'] = data['mpesa_number']
        if 'description' in data:
            update_data['description'] = data['description']

        result = supabase.table('users').update(update_data).eq('id', user_id).execute()
        return jsonify({'message': 'Profile updated'}), 200


@profile_bp.route('/user-earnings', methods=['GET'])
def get_user_earnings():
    user_id = get_current_user_id()

    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    if not supabase:
        return jsonify({'error': 'Database connection failed'}), 500

    # Get all completed service requests for the user's services
    result = supabase.table('service_requests').select(
        '*, services!service_requests_service_id_fkey(price, seller_id)'
    ).eq('status', 'completed').execute()

    total_earnings = 0
    for req in result.data:
        if req.get('services') and req['services'].get('seller_id') == user_id:
            total_earnings += float(req['services']['price'])

    return jsonify({'total_earnings': total_earnings}), 200