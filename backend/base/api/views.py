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
from rest_framework import generics
from base.models import Slot, Game, User, Item, Credit
from base.serializer import (
    ProfileSerializer,
    MyTokenObtainPairSerializer,
    ItemSerializer,
    SlotsSerializer,
)
from .utils import get_winner_weapon


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_profile(request):
    user = request.user
    profile = user.profile
    money = Credit.objects.get(id=profile)
    # profile.money
    serializer = ProfileSerializer(profile, many=False)

    data = serializer.data
    data["money"] = int(money.credit)
    return HttpResponse(json.dumps(data), content_type="application/json")


class Weapon(APIView):

    def get(self, request, format=None):
        slot_name = request.GET.get("slot_name")
        slot = Slot.objects.get(slot_name=slot_name)
        weapons = slot.Item.all()

        results = [obj.as_json() for obj in weapons]

        return HttpResponse(json.dumps(results), 
                            content_type="application/json")


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def run_roulette(request):
    user = request.user
    slot_name = request.GET.get("slot_name")

    weapon = get_winner_weapon(slot_name)

    game = Game()

    game.item = weapon
    game.slot = Slot.objects.get(slot_name=slot_name)
    game.user = User.objects.get(username=user)
    game.save()

    return HttpResponse(json.dumps(weapon.as_json()),
                        content_type="application/json")


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_profile_history(request):
    user = request.user
    User.objects.get(username=user)

    games = Game.objects.filter(user=user).order_by("-time")

    weapons = []

    for game in games:
        weapons.append(game.item.as_json())

    return HttpResponse(json.dumps(weapons), content_type="application/json")


class Slots(generics.ListCreateAPIView):

    # serializer_class = SlotsSerializer

    def get(self, request, format=None):
        slots = Slot.objects.all()

        names = list()
        for slot in slots:
            print(slot.slot_name)
            names.append(slot.slot_name)

        return HttpResponse(json.dumps(names), content_type="application/json")


class Balance(APIView):

    def get(self, request, format=None):
        pass
