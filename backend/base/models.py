from django.db import models
from django.contrib.auth.models import User
import uuid

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()

    def __str__(self):
        return self.user.username


class Item(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    weapon_name = models.CharField(max_length=100)
    skin_name = models.CharField(max_length=200)
    rarity = models.CharField(max_length=50)
    steam_image = models.CharField(max_length=500)

    def as_json(self):
        return dict(
            weapon_name=self.weapon_name,
            skin_name=self.skin_name, 
            rarity=self.rarity,
            steam_image=self.steam_image)


class Slot(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False , unique=False)
    slot_name = models.CharField(max_length=100)
    Item = models.ManyToManyField(Item)


class Game(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False , unique=False)
    slot = models.ForeignKey(Slot,  on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    time = models.DateTimeField(auto_now_add=True)