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
from base.models import Slot, Game, User, Item
from base.serializer import (
    ProfileSerializer,
    MyTokenObtainPairSerializer,
    ItemSerializer,
    SlotsSerializer,
)
from .utils import get_winner_weapon , decimal_to_float_default
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_cookie, vary_on_headers
from django.utils.decorators import method_decorator


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


# @cache_page(60 * 15)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_profile(request):
    user = request.user
    profile = user.profile
    # money = Credit.objects.get(id=profile)
    # profile.money
    serializer = ProfileSerializer(profile, many=False)

    data = serializer.data
    # data["money"] = int(money.credit)
    return HttpResponse(json.dumps(data), content_type="application/json")


class Weapon(APIView):

    def get(self, request, format=None):
        slot_name = request.GET.get("slot_name")
        slot = Slot.objects.get(slot_name=slot_name)
        weapons = slot.Item.all()

        results = [obj.as_json() for obj in weapons]

        return HttpResponse(json.dumps(results, 
                                default=decimal_to_float_default),
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

    return HttpResponse(json.dumps(weapon.as_json(), default=decimal_to_float_default),
                        content_type="application/json")


# @cache_page(60 * 15)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def get_profile_history(request):
    print("Hello")
    user = request.user
    item_status = request.data["item_status"]
    print("Hello",item_status)

    User.objects.get(username=user)

    games = Game.objects.filter(user=user,
                                item_status=item_status,).order_by("-time")

    weapons = []

    for game in games:
        weapon = game.item.as_json()
        weapon['game_id'] = game.id.hex
        weapons.append(weapon)
        

    return HttpResponse(json.dumps(weapons , default=decimal_to_float_default), content_type="application/json")


class Slots(generics.ListCreateAPIView):

    serializer_class = SlotsSerializer

    def get(self, request, format=None):
        slots = Slot.objects.all()


        return HttpResponse(json.dumps([slot.as_json() for slot in slots]), content_type="application/json")


class Balance(APIView):

    def get(self, request, format=None):
        pass


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def sell_item(request):
    user = request.user
    game_id = request.data['game_id']
    profile = user.profile
    
    game = Game.objects.get(id=game_id)
    print("game.user", game.user)
    print("user", user)
    if game.user == user:
        game.item_status = True


        profile.credit += game.item.cost

        profile.save()
        game.save()

        return Response("Item was sold",status=status.HTTP_200_OK)
    return Response("Bad request", status=status.HTTP_400_BAD_REQUEST)

