# from django.http import response
from django.shortcuts import redirect, render
# import requests
# from requests.models import Response
from .credentials import REDIRECT_URI, CLIENT_ID, CLIENT_SECRET
from rest_framework.views import APIView
from requests import Request, post
from rest_framework import status
from rest_framework.response import Response
from .util import *
from api.models import Room
from .models import Vote

# generates a url foprm sending a request to the spotify api
class AuthURL(APIView):
  def get(self, request, format=None):
    # spottily scopes taken from documentation for the functionality of the app
    scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'

    #paramaters needed to authenticate the spotify application
    url = Request('GET', 'https://accounts.spotify.com/authorize', params={
      'scope': scopes,
      'response_type': 'code',
      'redirect_uri': REDIRECT_URI,
      'client_id': CLIENT_ID,
    }).prepare().url

    return Response({'url': url}, status=status.HTTP_200_OK)

# send a request to get the spotify api
def spotity_callback(request, format=None):
  code = request.GET.get('code')
  error = request.GET.get('error')

  response = post('https://accounts.spotify.com/api/token', data={
    'grant_type': 'authorization_code',
    'code': code,
    'redirect_uri': REDIRECT_URI,
    'client_id': CLIENT_ID,
    'client_secret' : CLIENT_SECRET
  }).json()

  access_token = response.get('access_token')
  token_type = response.get('token_type')
  refresh_token = response.get('refresh_token')
  expires_in = response.get('expires_in')
  error = response.get('error')

  if not request.session.exists(request.session.session_key):
    request.session.create()

  update_or_create_user_tokens(request.session.session_key, access_token, token_type, expires_in, refresh_token)

  return redirect('frontend:')

#to check if user is authenticated
class IsAuthenticated(APIView):
  def get(self, request, format=None):
    is_authenticted = is_spotify_authenticated(self.request.session.session_key)
    return Response({'status': is_authenticted}, status=status.HTTP_200_OK)

# get the song that is playing info
class CurrentSong(APIView):
  def get(self, request, format=None):
    room_code = self.request.session.get('room_code')
    room = Room.objects.filter(code=room_code)
    if room.exists():
      room = room[0]
    else:
      return Response({}, status=status.HTTP_404_NOT_FOUND)
    host = room.host
    endpoint = "player/currently-playing"
    # request spotify api
    response = execute_spotify_api_request(host, endpoint)
    # print(response)

    if 'error' in response or 'item' not in response:
      return Response({}, status=status.HTTP_204_NO_CONTENT)

    # save data in diferent variables
    item = response.get('item')
    duration = item.get('duration_ms')
    progress = response.get('progress_ms')
    album_cover = item.get('album').get('images')[0].get('url')
    is_playing = response.get('is_playing')
    song_id = item.get('id')

    #join artist array
    artist_string = ""
    for i, artist in enumerate(item.get('artists')):
      if i > 0:
        artist_string += ", "
      name = artist.get('name')
      artist_string += name

    votes = len(Vote.objects.filter(room=room, song_id=song_id))
    # data object for frontend
    song = {
      'title' : item.get('name'),
      'artist': artist_string,
      'duration': duration,
      'time': progress,
      'image_url': album_cover,
      'is_playing': is_playing,
      'votes': votes,
      'votes_required': room.votes_to_skip,
      'id':song_id
    }

    self.update_room_song(room, song_id)

    return Response(song, status=status.HTTP_200_OK)

  def update_room_song(self, room, song_id):
    current_song = room.current_song

    if current_song != song_id:
      room.current_song = song_id
      room.save(update_fields=['current_song'])
      votes = Vote.objects.filter(room=room).delete()


#pause song class to connect with frontend 
class PauseSong(APIView):
  def put(self, response, format=None):
    #check if session exists
    if not self.request.session.exists(self.request.session.session_key):
      self.request.session.create()

    room_code = self.request.session.get('room_code')
    room = Room.objects.filter(code=room_code)
    #check if room exists
    if room.exists():
      room = room[0]
    else:
      return Response({}, status=status.HTTP_404_NOT_FOUND)

    # call function to pause song if user is host or can pause
    if self.request.session.session_key == room.host or room.guest_can_pause:
      pause_song(room.host)
      return Response({}, status=status.HTTP_204_NO_CONTENT)

    return Response({}, status=status.HTTP_403_FORBIDDEN)

#play song class to connect with frontend 
class PlaySong(APIView):
  def put(self, response, format=None):
    #check if session exists
    if not self.request.session.exists(self.request.session.session_key):
      self.request.session.create()

    room_code = self.request.session.get('room_code')
    room = Room.objects.filter(code=room_code)
     #check if room exists
    if room.exists():
      room = room[0]
    else:
      return Response({}, status=status.HTTP_404_NOT_FOUND)

    # call function to play song if user is host or can pause
    if self.request.session.session_key == room.host or room.guest_can_pause:
      play_song(room.host)
      return Response({}, status=status.HTTP_204_NO_CONTENT)

    return Response({}, status=status.HTTP_403_FORBIDDEN)

#skip song class to connect with frontend  
class SkipSong(APIView):
  def post(self, request, format=None):
    #check if session exists
    if not self.request.session.exists(self.request.session.session_key):
      self.request.session.create()

    room_code = self.request.session.get('room_code')
    room = Room.objects.filter(code=room_code)
     #check if room exists
    if room.exists():
      room = room[0]
    else:
      return Response({}, status=status.HTTP_404_NOT_FOUND)

    votes = Vote.objects.filter(room=room, song_id = room.current_song)
    votes_needed = room.votes_to_skip

    # call function to skip song if user is host or depending on votes to skip
    if self.request.session.session_key == room.host or len(votes) + 1 >= votes_needed:
      votes.delete()
      skip_song(room.host)
    else:
      vote = Vote(user=self.request.session.session_key, room=room, song_id=room.current_song)
      vote.save()
      
    return Response({}, status.HTTP_204_NO_CONTENT)