from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes 
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView 
from django.core import serializers
from django.http import HttpResponse
import json
from base.models import Slot , Game , User
from base.serializer import ProfileSerializer , MyTokenObtainPairSerializer , ItemSerializer
from .utils import get_winner_weapon


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    user = request.user
    profile = user.profile
    serializer = ProfileSerializer(profile, many=False)
    return Response(serializer.data)


class Weapon(APIView):

    def get(self,request,format=None):
        slot_name = request.GET.get('slot_name')
        slot = Slot.objects.get(slot_name=slot_name)
        weapons = slot.Item.all()

        results = [obj.as_json() for obj in weapons]

        return HttpResponse(json.dumps(results), content_type="application/json")


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def run_roulette(request):
    user = request.user
    print(user)
    profile = user.profile
    slot_name = request.GET.get('slot_name')
    
    weapon = get_winner_weapon(slot_name)

    game = Game()

    game.item = weapon
    game.slot = Slot.objects.get(slot_name=slot_name)
    game.user = User.objects.get(username=user)
    game.save()

    return HttpResponse(json.dumps(weapon.as_json()), content_type="application/json")

