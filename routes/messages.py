from flask import Blueprint, request, jsonify
from models.database import supabase, get_current_user_id

messages_bp = Blueprint('messages', __name__)

@messages_bp.route('/messages', methods=['GET', 'POST'])
def messages():
    user_id = get_current_user_id()

    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    if not supabase:
        return jsonify({'error': 'Database connection failed'}), 500

    if request.method == 'POST':
        data = request.json

        if not all([data.get('receiver_id'), data.get('message')]):
            return jsonify({'error': 'Missing required fields'}), 400

        result = supabase.table('messages').insert({
            'sender_id': user_id,
            'receiver_id': data['receiver_id'],
            'message': data['message']
        }).execute()

        return jsonify({'message': 'Message sent'}), 201

    elif request.method == 'GET':
        other_user_id = request.args.get('user_id')

        if not other_user_id:
            return jsonify({'error': 'Missing user_id parameter'}), 400

        result = supabase.table('messages').select(
            '*, users!messages_sender_id_fkey(name)'
        ).or_(
            f'and(sender_id.eq.{user_id},receiver_id.eq.{other_user_id}),and(sender_id.eq.{other_user_id},receiver_id.eq.{user_id})'
        ).order('created_at', desc=False).execute()

        messages_list = []
        for msg in result.data:
            messages_list.append({
                'id': msg['id'],
                'sender_id': msg['sender_id'],
                'receiver_id': msg['receiver_id'],
                'message': msg['message'],
                'created_at': msg['created_at'],
                'sender_name': msg['users']['name']
            })

        return jsonify(messages_list), 200

@messages_bp.route('/conversations', methods=['GET'])
def conversations():
    user_id = get_current_user_id()

    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    if not supabase:
        return jsonify({'error': 'Database connection failed'}), 500

    result = supabase.table('messages').select('*').or_(
        f'sender_id.eq.{user_id},receiver_id.eq.{user_id}'
    ).order('created_at', desc=True).execute()

    partners = {}
    last_messages = {}

    for msg in result.data:
        other_user_id = msg['receiver_id'] if msg['sender_id'] == user_id else msg['sender_id']
        if other_user_id not in partners:
            partners[other_user_id] = msg['created_at']
            last_messages[other_user_id] = msg['message']

    conversations_list = []
    for partner_id, last_time in partners.items():
        user_result = supabase.table('users').select('id, name, email').eq('id', partner_id).execute()
        if user_result.data:
            conversations_list.append({
                'user_id': partner_id,
                'user_name': user_result.data[0]['name'],
                'user_email': user_result.data[0].get('email'),
                'last_message': last_messages[partner_id],
                'last_message_time': last_time
            })

    conversations_list.sort(key=lambda x: x['last_message_time'], reverse=True)

    return jsonify(conversations_list), 200

@messages_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    if not supabase:
        return jsonify({'error': 'Database connection failed'}), 500

    result = supabase.table('users').select(
        'id, name, email, phone, mpesa_number, description'
    ).eq('id', user_id).execute()

    if result.data:
        return jsonify(result.data[0]), 200
    return jsonify({'error': 'User not found'}), 404