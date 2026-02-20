from django.urls import path
from users import views

app_name = 'users'

urlpatterns = [
    path('', views.login_page, name='login'),
    # """ path('registration/', views.registration, name='registration'), """
    path('profile/', views.profile, name='profile'),
    #path('logout/', views.logout, name='logout'),
    path('about/', views.about, name='about'),
]