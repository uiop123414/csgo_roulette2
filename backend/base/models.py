from django.db import models
from django.contrib.auth.models import User
import uuid
from simple_history.models import HistoricalRecords
from django.core.validators import MinValueValidator


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    credit = models.DecimalField(default=0,max_digits=10, decimal_places=2 , validators=[MinValueValidator(0.0)])

    def __str__(self):
        return self.user.username
    
    


class Item(models.Model):

    class Meta:
        verbose_name = "Item"
        verbose_name_plural = "Items"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    weapon_name = models.CharField(max_length=100)
    skin_name = models.CharField(max_length=200)
    rarity = models.CharField(max_length=50)
    steam_image = models.CharField(max_length=500)
    cost = models.DecimalField(default=1,max_digits=10, decimal_places=2 , validators=[MinValueValidator(0.01)])


    def as_json(self):
        return dict(
            id=self.id.hex,
            weapon_name=self.weapon_name,
            skin_name=self.skin_name,
            rarity=self.rarity,
            steam_image=self.steam_image,
            cost = self.cost,
        )

    def __str__(self) -> str:
        return self.weapon_name + " " + self.skin_name + " " + self.rarity


class Slot(models.Model):
    id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False, unique=False
    )
    slot_name = models.CharField(max_length=100)
    Item = models.ManyToManyField(Item)
    image = models.CharField(max_length=500,blank=True)

    def as_json(self):
        return dict(
            # id=self.id, 
                    slot_name=self.slot_name, 
                    image=self.image
                    )

    def __str__(self) -> str:
        return self.slot_name


class Game(models.Model):

    id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False, unique=False
    )
    slot = models.ForeignKey(Slot, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    time = models.DateTimeField(auto_now_add=True)
    count = models.PositiveBigIntegerField(default=1)
    item_status = models.BooleanField(default=False) # true - sold , false - player has it 

    history = HistoricalRecords()


    def as_json(self):
        return dict(
                    id = self.id.hex,
                    slot=self.slot, 
                    user=self.user, 
                    item=self.item,  
                    time=self.time,
                    )


class Rarity(models.Model):
    id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False, unique=False
    )
    name = models.CharField(max_length=50)
    probability = models.DecimalField(default=0,max_digits=2, decimal_places=2, validators=[MinValueValidator(0.01)])

    def as_json(self):
        return dict(
            id = self.id.hex,
            name = self.name,
            probability = self.probability,
        )