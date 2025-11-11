from django.urls import path
from . import views

app_name = 'chat'

urlpatterns = [
    path('conversations/', views.conversation_list, name='conversation_list'),
    path('conversations/get-or-create/', views.get_or_create_conversation, name='get_or_create_conversation'),
    path('conversations/<int:conversation_id>/messages/', views.conversation_messages, name='conversation_messages'),
    path('messages/send/', views.send_message, name='send_message'),
    path('conversations/<int:conversation_id>/mark-read/', views.mark_messages_read, name='mark_messages_read'),
    path('login/', views.login_user, name='login'),  # Add this line
]