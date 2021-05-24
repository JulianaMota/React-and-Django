from django.db.models.query import QuerySet
from django.http.response import JsonResponse
from django.shortcuts import render
from rest_framework import generics, serializers, status
from .serializers import RoomSerializer, CreateRoomSerializer, UpdateRoomSerializer
from .models import Room
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse


# Create your views here.
class RoomView(generics.ListAPIView):
  queryset = Room.objects.all()
  serializer_class = RoomSerializer

# GET A ROOM
class GetRoom(APIView):
  serializer_class = RoomSerializer
  lookup_url_kwarg = 'code'

  def get(self, request, format=None):
    #GET ROOM CODE
    code = request.GET.get(self.lookup_url_kwarg)

    #FIND IF ROOM CODE EXISTS AND IF IT HAS DATA
    if code != None:
      room = Room.objects.filter(code=code)
      if len(room) > 0:
        data = RoomSerializer(room[0]).data
        data['is_host'] = self.request.session.session_key == room[0].host
        return Response(data, status=status.HTTP_200_OK)
      return Response({'Room Not Found': 'Invalid Room Code.'}, status=status.HTTP_404_NOT_FOUND)

    return Response({'Bad Request': 'Code paramater not found in request'}, status=status.HTTP_400_BAD_REQUEST)

# JOIN A ROOM
class JoinRoom(APIView):
  lookup_url_kwarg = 'code'

  def post(self, request, format=None):
    #CHECK SESSION CREATED
    if not self.request.session.exists(self.request.session.session_key):
      self.request.session.create()

    #GET ROOM CODE
    code = request.data.get(self.lookup_url_kwarg)

    #FIND ROOM BY CODE AND JOIN ROOM
    if code != None:
      room_result = Room.objects.filter(code=code)
      if len(room_result) > 0:
        room = room_result[0]
        self.request.session['room_code'] = code
        return Response({'message': 'Room Joined!'}, status=status.HTTP_200_OK)

      return Response({'Bad Request': 'Invalid Room Code'}, status=status.HTTP_400_BAD_REQUEST)

    return Response({'Bad Request': 'Invalid post data, did not find a code key'}, status=status.HTTP_400_BAD_REQUEST)

# CREATE A ROOM
class CreateRoomView(APIView):
  serializer_class = CreateRoomSerializer

  #FIND IF HAS SESSION
  def post(self, request, format=None):
    if not self.request.session.exists(self.request.session.session_key):
      self.request.session.create()

    # CHECK IF FIELDS ARE VALID
    serializer = self.serializer_class(data=request.data)
    if serializer.is_valid():
      guest_can_pause = serializer.data.get('guest_can_pause')
      votes_to_skip = serializer.data.get('votes_to_skip')
      host_name = serializer.data.get('host_name')
      description = serializer.data.get('description')
      host = self.request.session.session_key

      #fIND ROOM AND UPDATE INFO ELSE CRETE A NEW ONE
      queryset = Room.objects.filter(host=host)
      if queryset.exists():
        room = queryset[0]
        room.guest_can_pause = guest_can_pause
        room.votes_to_skip = votes_to_skip
        room.host_name = host_name
        room.description = description
        room.save(update_fields=['guest_can_pause', 'votes_to_skip', 'host_name', 'description'])
        self.request.session["room_code"] = room.code
        return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
      else:
        room = Room(host=host, guest_can_pause=guest_can_pause, votes_to_skip=votes_to_skip, host_name=host_name, description=description)
        room.save()
        self.request.session["room_code"] = room.code
        return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)

    return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

# CHECK IF USER IS IN ROOM
class UserInRoom(APIView):
  def get(self, request, format=None):
    #CHECK IF SESSION EXISTS
    if not self.request.session.exists(self.request.session.session_key):
      self.request.session.create()

    
    data={
      'code': self.request.session.get('room_code')
    }
    return JsonResponse(data, status=status.HTTP_200_OK)

# LEAVE A ROOM
class LeaveRoom(APIView):
  def post(self, request, format=None):
    # CHEKC IF SESSION HAS ROOM CODE
    if 'room_code' in self.request.session:
      #REMOVE CODE FORM SESSION
      self.request.session.pop('room_code')
      host_id = self.request.session.session_key
      # FIND THE ROOM IF IS THE HOST AND THEN DELETE THE ROOM
      room_results = Room.objects.filter(host = host_id)
      if len(room_results) > 0:
        room = room_results[0]
        room.delete()
    
    return Response({'message': 'Success'}, status=status.HTTP_200_OK)

# UPDATE A ROOM
class UpdateRoom(APIView):
  serializer_class = UpdateRoomSerializer

  def patch(self, request, format=None):
    if not self.request.session.exists(self.request.session.session_key):
      self.request.session.create()

    serializer = self.serializer_class(data=request.data)
    if serializer.is_valid():
      guest_can_pause = serializer.data.get('guest_can_pause')
      votes_to_skip = serializer.data.get('votes_to_skip')
      code = serializer.data.get('code')
      host_name = serializer.data.get('host_name')
      description = serializer.data.get('description')

      queryset = Room.objects.filter(code=code)
      if not queryset.exists():
          return Response({'msg': 'Room not found.'}, status=status.HTTP_404_NOT_FOUND)

      room = queryset[0]
      user_id = self.request.session.session_key
      if room.host != user_id:
        return Response({'msg': 'You are not the host of this room.'}, status=status.HTTP_403_FORBIDDEN)

      room.guest_can_pause = guest_can_pause
      room.votes_to_skip = votes_to_skip
      room.host_name = host_name
      room.description = description
      room.save(update_fields=['guest_can_pause', 'votes_to_skip', 'host_name', 'description'])
      return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)

    return Response({'Bad Request': "Invalid Data..."}, status=status.HTTP_400_BAD_REQUEST)