from django.db import models

# spotify local api
class SpotifyToken(models.Model):
  user = models.CharField(max_length=50, unique=True)
  created_at = models.DateField(auto_now_add=True)
  refresh_token = models.CharField(max_length=150)
  access_token = models.CharField(max_length=150)
  expires_in = models.DateTimeField()
  token_type = models.CharField(max_length=50)