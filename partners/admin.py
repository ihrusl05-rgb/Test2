from django.contrib import admin
from .models import Category, Product

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'order', 'icon', 'color')
    list_editable = ('order',)
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['order']
    search_fields = ('name', 'description')
    list_filter = ('order',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'quantity', 'is_active', 'count_offers', 'order')
    list_filter = ('category', 'is_active', 'category__name')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['category', 'order']
    list_editable = ('is_active', 'price', 'quantity', 'order')
    fieldsets = (
        ('Основная информация', {
            'fields': ('name', 'slug', 'category', 'description')
        }),
        ('Медиа', {
            'fields': ('image', 'image_url')
        }),
        ('Цена и количество', {
            'fields': ('price', 'quantity')
        }),
        ('Дополнительно', {
            'fields': ('marketplace_url', 'count_offers', 'is_active', 'order')
        }),
    )