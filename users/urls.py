from django.urls import path
from users import views

app_name = 'users'

urlpatterns = [
    path('login/', views.login_page, name='login'),
    path('registration/', views.registration, name='registration'),
    path('logout/', views.logout_view, name='logout'),
    path('about/', views.about, name='about'),
]