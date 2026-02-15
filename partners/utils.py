
from django.db.models import Q
from partners.models import Product
# from django.contrib.postgres.search import SearchVector, SearchQuery,SearchRank


def q_search(query):
    query = (query or "").strip()
    if not query:
        return Product.objects.none()

    """ Ищем по id товар """
    if query.isdigit() and len(query) <= 5:
        return Product.objects.filter(id=int(query))

    
    return Product.objects.filter(
        Q(name__icontains=query) |
        Q(description__icontains=query)
    )
#    #searchrank
#     vector = SearchVector('name', 'description')
#     query = SearchQuery(query)

#     return (Product.objects.annotate(rank=SearchRank(vector, query)).filter(rank__gt = 0)).order_by("-rank")
