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

    class Meta:
        verbose_name = 'Item'
        verbose_name_plural = 'Items'

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
    
    def __str__(self) -> str:
        return self.weapon_name + " " + self.skin_name + " " + self.rarity


class Slot(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False , unique=False)
    slot_name = models.CharField(max_length=100)
    Item = models.ManyToManyField(Item)

    def as_json(self):
        return dict(
            id=self.id,
            slot_name=self.slot_name, 
            Item=self.Item
            )

    def __str__(self) -> str:
        return self.slot_name


class Game(models.Model):


    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False , unique=False)
    slot = models.ForeignKey(Slot,  on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    time = models.DateTimeField(auto_now_add=True)

    def as_json(self):
        return dict(
            slot=self.slot,
            user=self.user, 
            item=self.item,
            time=self.time)
    
class Credit(models.Model):

    id = models.ForeignKey(Profile, primary_key=True, on_delete=models.CASCADE)
    credit = models.DecimalField(max_digits=10, decimal_places=2)


class Cost(models.Model):
    
    id = models.ForeignKey(Item, primary_key=True, on_delete=models.CASCADE)
    cost = models.DecimalField(max_digits=10, decimal_places=2)