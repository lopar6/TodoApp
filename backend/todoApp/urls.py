from django.urls import path
from django.urls import include
from django.conf.urls import url
from django.contrib import admin
from rest_framework.routers import DefaultRouter

from todoApp.views import TaskViewSet

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename=r'tasks')

urlpatterns = [
    # path('tasks/', views.task_list),
    # path('tasks/<int:pk>/', views.task_detail),
    url(r'', include(router.urls)),
    path(r'admin/', admin.site.urls),
]