from flask import Blueprint, request, jsonify
from models.database import supabase, get_current_user_id

services_bp = Blueprint('services', __name__)

@services_bp.route('/services', methods=['GET', 'POST'])
def services():
    if request.method == 'GET':
        if not supabase:
            return jsonify({'error': 'Database connection failed'}), 500

        # Get all services with user info and ratings
        result = supabase.table('services').select(
            '*, users!services_seller_id_fkey(name, mpesa_number)'
        ).order('created_at', desc=True).execute()

        services_list = []
        for service in result.data:
            # Get average rating for this service
            rating_result = supabase.table('ratings').select('rating').eq('service_id', service['id']).execute()
            ratings = [r['rating'] for r in rating_result.data]
            avg_rating = sum(ratings) / len(ratings) if ratings else None

            service_dict = {
                'id': service['id'],
                'seller_id': service['seller_id'],
                'title': service['title'],
                'description': service['description'],
                'price': float(service['price']),
                'category': service['category'],
                'created_at': service['created_at'],
                'seller_name': service['users']['name'],
                'mpesa_number': service['users'].get('mpesa_number'),
                'rating': round(avg_rating, 1) if avg_rating else None
            }
            services_list.append(service_dict)

        return jsonify(services_list), 200

    elif request.method == 'POST':
        user_id = get_current_user_id()

        if not user_id:
            return jsonify({'error': 'Unauthorized'}), 401

        if not supabase:
            return jsonify({'error': 'Database connection failed'}), 500

        data = request.json

        if not all([data.get('title'), data.get('description'), data.get('price')]):
            return jsonify({'error': 'Missing required fields'}), 400

        result = supabase.table('services').insert({
            'seller_id': user_id,
            'title': data['title'],
            'description': data['description'],
            'price': data['price'],
            'category': data.get('category', 'General')
        }).execute()

        return jsonify({'message': 'Service created'}), 201

@services_bp.route('/services/<int:service_id>', methods=['GET', 'DELETE'])
def service_detail(service_id):
    if request.method == 'GET':
        if not supabase:
            return jsonify({'error': 'Database connection failed'}), 500

        result = supabase.table('services').select(
            '*, users!services_seller_id_fkey(name, email, phone, mpesa_number, description)'
        ).eq('id', service_id).execute()

        if not result.data:
            return jsonify({'error': 'Service not found'}), 404

        service = result.data[0]
        service_dict = {
            'id': service['id'],
            'seller_id': service['seller_id'],
            'title': service['title'],
            'description': service['description'],
            'price': float(service['price']),
            'category': service['category'],
            'created_at': service['created_at'],
            'seller_name': service['users']['name'],
            'seller_email': service['users']['email'],
            'seller_phone': service['users'].get('phone'),
            'mpesa_number': service['users'].get('mpesa_number'),
            'seller_description': service['users'].get('description')
        }

        return jsonify(service_dict), 200

    elif request.method == 'DELETE':
        user_id = get_current_user_id()

        if not user_id:
            return jsonify({'error': 'Unauthorized'}), 401

        if not supabase:
            return jsonify({'error': 'Database connection failed'}), 500

        result = supabase.table('services').select('seller_id').eq('id', service_id).execute()

        if not result.data:
            return jsonify({'error': 'Service not found'}), 404

        if result.data[0]['seller_id'] != user_id:
            return jsonify({'error': 'Unauthorized'}), 403

        supabase.table('services').delete().eq('id', service_id).execute()
        return jsonify({'message': 'Service deleted'}), 200

@services_bp.route('/my-services', methods=['GET'])
def my_services():
    user_id = get_current_user_id()

    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    if not supabase:
        return jsonify({'error': 'Database connection failed'}), 500

    result = supabase.table('services').select('*').eq('seller_id', user_id).order('created_at', desc=True).execute()

    services_list = []
    for service in result.data:
        services_list.append({
            'id': service['id'],
            'seller_id': service['seller_id'],
            'title': service['title'],
            'description': service['description'],
            'price': float(service['price']),
            'category': service['category'],
            'created_at': service['created_at']
        })

    return jsonify(services_list), 200

@services_bp.route('/rate-service', methods=['POST'])
def rate_service():
    user_id = get_current_user_id()

    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    if not supabase:
        return jsonify({'error': 'Database connection failed'}), 500

    data = request.json
    service_id = data.get('service_id')
    rating = data.get('rating')
    review = data.get('review', '')

    if not all([service_id, rating]):
        return jsonify({'error': 'Missing required fields'}), 400

    if rating < 1 or rating > 5:
        return jsonify({'error': 'Rating must be between 1 and 5'}), 400

    # Check if user already rated
    existing = supabase.table('ratings').select('*').eq('service_id', service_id).eq('user_id', user_id).execute()

    if existing.data:
        # Update existing rating
        supabase.table('ratings').update({
            'rating': rating,
            'review': review
        }).eq('id', existing.data[0]['id']).execute()
    else:
        # Create new rating
        supabase.table('ratings').insert({
            'service_id': service_id,
            'user_id': user_id,
            'rating': rating,
            'review': review
        }).execute()

    return jsonify({'message': 'Rating submitted'}), 201