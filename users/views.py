from django.shortcuts import render


"""Страница входа партнеров"""
def login_page(request):
    context  = {
    'title': 'Партнеры',
    'content': 'Уфанефть'
    }
    return render(request, 'users/login.html', context)


def registration(request):
    context  = {
    'title': 'Партнеры',
    'content': 'Уфанефть'
    }
    return render(request, 'users/registration.html', context)


def profile(request):
    context  = {
    'title': 'Партнеры',
    'content': 'Уфанефть'
    }
    return render(request, 'users/profile.html', context)

"""О нас"""
def about(request):
    context  = {
    'title': 'Партнеры-о нас',
    'content': 'О нас',
    'text_on_page': 'Уфанефть - это экосистема для партнеров и клиентов, которая объединяет в себе широкий спектр услуг и продуктов. Наша миссия - создавать ценность для наших партнеров, предоставляя им доступ к инновационным решениям и поддержке на каждом этапе сотрудничества.'
    }
    return render(request, 'users/about.html', context)