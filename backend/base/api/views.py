from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated , IsAdminUser 
from rest_framework.views import APIView 
from rest_framework import status
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.core import serializers
from django.http import HttpResponse
import json
from rest_framework import generics
from base.models import Slot, Game, User, Item , Rarity
from base.serializer import (
    ProfileSerializer,
    MyTokenObtainPairSerializer,
    ItemSerializer,
    SlotsSerializer,
)
from .utils import get_winner_weapon , decimal_to_float_default
from django.views.decorators.cache import cache_page


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_profile(request):
    user = request.user
    profile = user.profile

    user = request.user

    User.objects.get(username=user)

    games = Game.objects.filter(user=user,).order_by("-time")

    weapons = []

    for game in games:
        weapon = game.item.as_json()
        weapon['game_id'] = game.id.hex
        weapons.append(weapon)

    serializer = ProfileSerializer(profile, many=False)

    data = serializer.data
    
    data['count'] = len(weapons)

    print(data)

    return HttpResponse(json.dumps(data), content_type="application/json")


class WeaponView(APIView):

    def get(self, request, format=None):
        slot_name = request.GET.get("slot_name")
        print(slot_name)
        if(slot_name==None):
            items = Item.objects.all()
            data = list()
            for item in items:
                data.append(item.as_json())

            return HttpResponse(json.dumps(data, 
                                default=decimal_to_float_default),
                                content_type="application/json")

        else:    
            slot = Slot.objects.get(slot_name=slot_name)

            items = slot.Item.all()

            return HttpResponse(json.dumps([item.as_json() for item in items], 
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
    user = request.user
    item_status = request.data["item_status"]
    page_number = request.data["pageNumber"]
    items_per_page = request.data["itemsPerPage"]
    start_text = request.data["startText"]

    User.objects.get(username=user)

    games = Game.objects.filter(user=user,
                                item_status=item_status,).order_by("-time")

    weapons = []

    for game in games:
        weapon = game.item.as_json()
        weapon['game_id'] = game.id.hex
        if weapon['weapon_name'].lower().startswith(start_text.lower()):
            weapons.append(weapon)
        
    return HttpResponse(json.dumps({"items":weapons[(page_number-1)*items_per_page: (page_number)*items_per_page] ,"count":len(weapons)}, default=decimal_to_float_default), content_type="application/json")


class SlotsView(generics.ListCreateAPIView):

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

    if game.user == user:
        game.item_status = True

        profile.credit += game.item.cost

        profile.save()
        game.save()

        return Response("Item was sold",status=status.HTTP_200_OK)
    return Response("Bad request", status=status.HTTP_400_BAD_REQUEST)



class RarityView(generics.ListAPIView):

    def get(self, request, format=None):
        
        rarities = Rarity.objects.all()

        return HttpResponse(json.dumps([rarity.as_json() for rarity in rarities],default=decimal_to_float_default),status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAdminUser])
def create_item(request):
    name = request.data['name']
    skin = request.data['skin']
    rarity = request.data['rarity']
    slot_name = request.data['slot_name']
    steam_image = request.data['steam_image']
    cost = request.data['price']

    item = Item()

    item.weapon_name = name
    item.skin_name = skin
    item.rarity = rarity
    item.steam_image = steam_image
    item.cost = cost

    item.save()

    if slot_name != "None":
        slot = Slot.objects.get(slot_name=slot_name)
        slot.Item.add(item)

    return HttpResponse(json.dumps(item.as_json(), default=decimal_to_float_default),
                        content_type="application/json")


@api_view(["POST"])
@permission_classes([IsAdminUser])
def update_item(request):
    id = request.data["id"]
    name = request.data['name']
    skin = request.data['skin']
    rarity = request.data['rarity']
    steam_image = request.data['steam_image']
    cost = request.data['price']

    item = Item.objects.get(id=id)

    item.weapon_name = name
    item.skin_name = skin
    item.rarity = rarity
    item.steam_image = steam_image
    item.cost = cost

    item.save()

    return HttpResponse(json.dumps(item.as_json(), default=decimal_to_float_default),
                        content_type="application/json")
