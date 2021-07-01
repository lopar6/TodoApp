from rest_framework import serializers
from todoApp.models import Task, PriorityChoices

# modelSerializer creates simple create and update methods based on Django model
class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['index', 'title', 'priority', 'pk']

# this another, more verbose and versital method
# class TaskSerializer(serializers.Serializer):
#     indexKey = serializers.IntegerField()
#     title = serializers.CharField(max_length=100, default='Unknown Task')
#     priority = serializers.IntegerField()

#     def create(self, validated_data):
#         """
#         Create and return a new Task instance with the validated data
#         """
#         return Task.objects.create(**validated_data)

#     def update(self, instance, validated_data):
#         """
#         Update and return an existing Task instance with the validated data
#         """
#         instance.indexKey = validated_data.get('indexKey', instance.indexKey)
#         instance.title = validated_data.get('title', instance.title)
#         instance.priority = validated_data.get('priority', instance.priority)
#         instance.save()
#         return instance
        