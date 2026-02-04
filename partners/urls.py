from django.urls import path
from . import views

app_name = 'partners'

urlpatterns = [
    path('login/', views.login_page, name='login'),
    path('sales/', views.sales_page, name='sales'),
    path('api/product/<int:product_id>/', views.get_product_details, name='product_api'),
]
