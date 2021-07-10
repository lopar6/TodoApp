from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets, status, mixins
from rest_framework.parsers import JSONParser
from rest_framework.decorators import action
from rest_framework.response import Response



from todoApp.models import Task
from todoApp.serializers import TaskSerializer

class TaskViewSet(viewsets.ViewSet):

    def list(self, request):
        tasks = Task.objects.all()
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data , status=status.HTTP_200_OK)

    def retrieve(self, request, pk):
        task = Task.objects.filter(id=pk).first()
        serializer = TaskSerializer(task, many=False)
        return Response(serializer.data , status=status.HTTP_200_OK)

    # todo add delete

    # example of good pattern
    @action(detail = True, methods = ['get'])
    def title(self, request, pk):
        task = Task.objects.filter(id=pk).first()
        if task is None:
            return Response(None, status=status.HTTP_404_NOT_FOUND)
        return Response(task.title , status=status.HTTP_200_OK)

    @action(detail = False, methods = ['post'])
    def batch(self, request):
        ids = []
        for _task in request.data:
            if _task.get('pk'):
                pk = _task.pop('pk')
                Task.objects.filter(id=pk).update(**_task)
                ids.append(pk)
            else:
                task = Task()
                task.index = _task.get('index')
                task.title = _task.get('title')
                task.priority = _task.get('priority')
                task.save()
                ids.append(task.id)
        tasks = Task.objects.filter(id__in = ids)
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data , status=status.HTTP_200_OK)

    # todo return all user's tasks, not only updated tasks

# ! todo remove this csrf exemption! not secure
@csrf_exempt
def task_list(request):
    """
    List all tasks, or create a new task
    """
    if request.method == 'GET':
        tasks = Task.objects.all()
        serializer = TaskSerializer(tasks, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = TaskSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)

#! todo remove this
@csrf_exempt
def task_detail(request, pk):
    """
    Retrieve, update, or delete a task
    """
    try:
        task = Task.objects.get(pk=pk)
    except Task.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == 'GET':
        serializer = TaskSerializer(task)
        return JsonResponse(serializer.data)
    
    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = TaskSerializer(task, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)

    elif request.method == 'DELETE':
        task.delete()
        return HttpResponse(stats=204)