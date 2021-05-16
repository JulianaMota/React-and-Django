from django.urls import path
from .views import AuthURL, spotity_callback, IsAuthenticated

urlpatterns = [
    path('get-auth-url', AuthURL.as_view()),
    path('redirect', spotity_callback),
    path('is-authenticated', IsAuthenticated.as_view())
]