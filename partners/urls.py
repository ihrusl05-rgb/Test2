from django.urls import path
from . import views

app_name = 'partners'

urlpatterns = [
    path('test/', views.test_page, name='test'),
    path('sales/', views.sales_page, name='sales'),
    path('sales/<int:category_id>/', views.sales_page, name='sales_by_id'),
    path('sales/<slug:category_slug>/', views.sales_page, name='sales_by_category'),
    path('api/product/<int:product_id>/', views.get_product_details, name='product_api'),
]
