from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from debug_toolbar.toolbar import debug_toolbar_urls

from users import views

urlpatterns = (
    [
        path("", views.index, name='index'),
        path("admin/", admin.site.urls),
        path("", include("partners.urls", namespace="partners")),
        path("", include("users.urls", namespace="users")),

    ]
    + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    #+debug_toolbar_urls()
)

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += debug_toolbar_urls()