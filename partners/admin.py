from django.contrib import admin
from .models import Category, Product

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'icon', 'order', 'color')
    ordering = ('order',)
    fields = ('name', 'description', 'icon', 'color', 'order')

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'count_offers', 'is_active', 'order')
    list_filter = ('category', 'is_active')
    search_fields = ('name', 'description')
    ordering = ('order',)
    fieldsets = (
        ('Основная информация', {
            'fields': ('name', 'category', 'short_description')
        }),
        ('Описание и ссылки', {
            'fields': ('description', 'marketplace_url', 'image_url')
        }),
        ('Параметры', {
            'fields': ('count_offers', 'is_active', 'order')
        }),
    )
