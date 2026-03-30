from django import db
from django.db import models

class Category(models.Model):
    """Категория товаров"""
    name = models.CharField(max_length=150, unique=True, verbose_name ='Название категории')
    slug = models.SlugField(max_length=200,unique=True, blank=True, null=True, verbose_name ='URL категория')
    description = models.TextField(blank=True, null=True, verbose_name ='Описание категории')
    icon = models.CharField(max_length=50, default="📦")
    color = models.CharField(max_length=7, default="#FF6B00")
    order = models.IntegerField(default=0)

    class Meta:
        db_table = 'category'
        ordering = ['id']
        verbose_name ='Категории'
        verbose_name_plural = "Категории"

    def __str__(self):
        return self.name

    def Category_id(self):
        return f"{self.id:03}"


class Product(models.Model):
    """Товар/Услуга партнера"""
    name = models.CharField(max_length=200, verbose_name ='Название товара')
    slug = models.SlugField(max_length=200,unique=True, blank=True, null=True, verbose_name ='URL категория')
    description = models.TextField(blank=True, null=True, verbose_name ='Описание товара')
    image = models.ImageField(upload_to='products/', height_field=None, width_field=None, max_length=None, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name='Цена')
    quantity = models.PositiveIntegerField(default=0, verbose_name='Количество')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, verbose_name='Категория')

    marketplace_url = models.URLField()  # Ссылка на маркетплейс
    image_url = models.URLField(blank=True)  # URL изображения
    count_offers = models.IntegerField(default=0)  # Кол-во предложений
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']
        db_table = 'product'
        verbose_name ='Товар'
        verbose_name_plural = "Товары"


    def display_id(self):
        return f"{self.id:03}"
