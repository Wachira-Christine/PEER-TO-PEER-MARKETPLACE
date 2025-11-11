from django.contrib import admin
from .models import Conversation, Message


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ['id', 'created_at', 'updated_at', 'get_participants']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['participants__username']

    def get_participants(self, obj):
        return ", ".join([p.username for p in obj.participants.all()])

    get_participants.short_description = 'Participants'


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['id', 'sender', 'conversation', 'timestamp', 'is_read', 'short_content']
    list_filter = ['timestamp', 'is_read']
    search_fields = ['sender__username', 'content']

    def short_content(self, obj):
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content

    short_content.short_description = 'Content'