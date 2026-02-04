from django.db import models

class Category(models.Model):
    """Категория товаров"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, default="📦")  # emoji или класс иконки
    color = models.CharField(max_length=7, default="#FF6B00")  # hex цвет
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name_plural = "Категории"

    def __str__(self):
        return self.name


class Product(models.Model):
    """Товар/Услуга партнера"""
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=200)
    description = models.TextField()
    short_description = models.CharField(max_length=100)  # Для карточки
    marketplace_url = models.URLField()  # Ссылка на маркетплейс
    image_url = models.URLField(blank=True)  # URL изображения
    count_offers = models.IntegerField(default=0)  # Кол-во предложений
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name_plural = "Товары"

    def __str__(self):
        return f"{self.name} ({self.category.name})"# Create your models here.
