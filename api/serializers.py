from rest_framework import serializers
from .models import Room


class RoomSerializer(serializers.ModelSerializer):
  class Meta:
    model = Room
    fields = ('id', 'code', 'host', 'guest_can_pause', 'votes_to_skip', 'created_at', 'host_name', 'description')

class CreateRoomSerializer(serializers.ModelSerializer):
  class Meta:
    model = Room
    fields = ('guest_can_pause', 'votes_to_skip', 'host_name', 'description' )

class UpdateRoomSerializer(serializers.ModelSerializer):
    code = serializers.CharField(validators=[])

    class Meta:
        model = Room
        fields = ('guest_can_pause', 'votes_to_skip', 'code', 'host_name', 'description')