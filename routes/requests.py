from flask import Blueprint, request, jsonify
from models.database import supabase, get_current_user_id

requests_bp = Blueprint('requests', __name__)

@requests_bp.route('/request-service', methods=['POST'])
def request_service():
    user_id = get_current_user_id()

    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    if not supabase:
        return jsonify({'error': 'Database connection failed'}), 500

    data = request.json
    service_id = data.get('service_id')

    if not service_id:
        return jsonify({'error': 'Missing service_id'}), 400

    # Check if already requested
    existing = supabase.table('service_requests').select('*').eq('service_id', service_id).eq('buyer_id', user_id).execute()

    if existing.data:
        return jsonify({'error': 'Service already requested'}), 400

    result = supabase.table('service_requests').insert({
        'service_id': service_id,
        'buyer_id': user_id,
        'status': 'pending'
    }).execute()

    return jsonify({'message': 'Service requested successfully'}), 201

@requests_bp.route('/service-requests', methods=['GET'])
def get_service_requests():
    user_id = get_current_user_id()

    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    if not supabase:
        return jsonify({'error': 'Database connection failed'}), 500

    # Get all service requests for the user's services
    result = supabase.table('service_requests').select(
        '*, services!service_requests_service_id_fkey(*), users!service_requests_buyer_id_fkey(name, email)'
    ).execute()

    # Filter for services owned by current user
    requests_list = []
    for req in result.data:
        if req.get('services') and req['services'].get('seller_id') == user_id:
            requests_list.append({
                'id': req['id'],
                'service_id': req['service_id'],
                'buyer_id': req['buyer_id'],
                'buyer_name': req['users']['name'] if req.get('users') else 'Unknown',
                'seller_id': req['services']['seller_id'],
                'title': req['services']['title'],
                'description': req['services']['description'],
                'price': float(req['services']['price']),
                'category': req['services']['category'],
                'status': req['status'],
                'created_at': req['created_at']
            })

    return jsonify(requests_list), 200

@requests_bp.route('/requested-services', methods=['GET'])
def get_requested_services():
    user_id = get_current_user_id()

    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    if not supabase:
        return jsonify({'error': 'Database connection failed'}), 500

    # Get services the user has requested
    result = supabase.table('service_requests').select(
        '*, services!service_requests_service_id_fkey(*)'
    ).eq('buyer_id', user_id).execute()

    services_list = []
    for req in result.data:
        if req.get('services'):
            services_list.append({
                'id': req['id'],
                'service_id': req['service_id'],
                'title': req['services']['title'],
                'description': req['services']['description'],
                'price': float(req['services']['price']),
                'category': req['services']['category'],
                'status': req['status'],
                'created_at': req['created_at']
            })

    return jsonify(services_list), 200

@requests_bp.route('/complete-service', methods=['POST'])
def complete_service():
    user_id = get_current_user_id()

    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    if not supabase:
        return jsonify({'error': 'Database connection failed'}), 500

    data = request.json
    request_id = data.get('request_id')

    if not request_id:
        return jsonify({'error': 'Missing request_id'}), 400

    # Verify the user owns the service being requested
    result = supabase.table('service_requests').select(
        '*, services!service_requests_service_id_fkey(seller_id)'
    ).eq('id', request_id).execute()

    if not result.data:
        return jsonify({'error': 'Service request not found'}), 404

    service_seller_id = result.data[0]['services']['seller_id']

    if service_seller_id != user_id:
        return jsonify({'error': 'Unauthorized - you do not own this service'}), 403

    # Update the service request status to completed
    supabase.table('service_requests').update({
        'status': 'completed'
    }).eq('id', request_id).execute()

    return jsonify({'message': 'Service marked as complete'}), 200