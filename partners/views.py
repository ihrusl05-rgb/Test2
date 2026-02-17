#from os import name
from django.core.paginator import Paginator
from django.shortcuts import get_object_or_404, render
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from .models import Category, Product
from .utils import q_search

def sales_page(request, category_slug=None, category_id=None):
    """Страница товаров и категорий"""
    categories = Category.objects.all()
    products = Product.objects.filter(is_active=True).select_related('category')  #Оптимизация запросов к базе данных, чтобы избежать N+1 проблемы при отображении товаров и их категорий"""
    selected_category_slug = None

    if category_slug:
        category = get_object_or_404(Category, slug=category_slug)
        products = products.filter(category=category)
        selected_category_slug = category.slug

    elif category_id:
        category = get_object_or_404(Category, id=category_id)
        products = products.filter(category=category)

    """ Поиск товаров """
    search_query = request.GET.get('q', '').strip()
    if search_query:
        products = q_search(search_query)


    """ Тестовая пагинация """
    paginator = Paginator(products, 4)
    page_number = request.GET.get("page", 1)
    products = paginator.get_page(page_number)

    context = {
        'categories': categories,
        'products': products,
        'selected_category_slug': selected_category_slug,
        'search_query': search_query,
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


def test_page(request):
    context  = {
    'title': 'Партнеры',
    'content': 'Уфанефть'
    }
    return render(request, 'test.html', context)