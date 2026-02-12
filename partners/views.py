#from os import name
from django.shortcuts import get_object_or_404, render
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from .models import Category, Product

def sales_page(request, category_slug=None):
    """Страница товаров и категорий"""
    categories = Category.objects.all()
    products = Product.objects.filter(is_active=True).select_related('category')
    selected_category_slug = None

    if category_slug:
        category = get_object_or_404(Category, slug=category_slug)
        products = products.filter(category=category)
        selected_category_slug = category.slug

    context = {
        'categories': categories,
        'products': products,
        'selected_category_slug': selected_category_slug,
    }
    return render(request, 'partners/sales.html', context)

@require_http_methods(["GET"])
def get_product_details(request, product_id):
    """API для получения деталей товара (для модального окна)"""
    try:
        product = Product.objects.get(id=product_id, is_active=True,)
        data = {
            'success': True,
            'name': product.name,
            'description': product.description,
            'count_offers': product.count_offers,
            'marketplace_url': product.marketplace_url,
            'image_url': product.image.url if product.image else (product.image_url or ""),
        }
    except Product.DoesNotExist:
        data = {
            'success': False,
            'message': 'Товар не найден'
        }

    return JsonResponse(data)


"""Страница входа партнеров"""
def login_page(request):
    context  = {
    'title': 'Партнеры',
    'content': 'Уфанефть'
    }
    return render(request, 'partners/login.html', context)


"""О нас"""
def about(request):
    context  = {
    'title': 'Партнеры-о нас',
    'content': 'О нас',
    'text_on_page': 'Уфанефть - это экосистема для партнеров и клиентов, которая объединяет в себе широкий спектр услуг и продуктов. Наша миссия - создавать ценность для наших партнеров, предоставляя им доступ к инновационным решениям и поддержке на каждом этапе сотрудничества.'
    }
    return render(request, 'partners/about.html', context)
