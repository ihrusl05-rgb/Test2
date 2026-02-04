from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from .models import Category, Product

def sales_page(request):
    """Страница товаров и категорий"""
    categories = Category.objects.all()
    products = Product.objects.filter(is_active=True)

    context = {
        'categories': categories,
        'products': products,
    }
    return render(request, 'partners/sales.html', context)

@require_http_methods(["GET"])
def get_product_details(request, product_id):
    """API для получения деталей товара (для модального окна)"""
    try:
        product = Product.objects.get(id=product_id, is_active=True)
        data = {
            'success': True,
            'name': product.name,
            'description': product.description,
            'count_offers': product.count_offers,
            'marketplace_url': product.marketplace_url,
            'image_url': product.image_url or '',
        }
    except Product.DoesNotExist:
        data = {
            'success': False,
            'message': 'Товар не найден'
        }

    return JsonResponse(data)

def login_page(request):
    """Страница входа партнеров"""
    return render(request, 'partners/login.html')


