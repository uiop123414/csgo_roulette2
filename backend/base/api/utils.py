from base.models import *
import random
import json
from decimal import Decimal

# uncommon = white


# milspec = blue = 80 %

# restricted  = purple = 10 %

# classified = pink = 5 %

# covert = red = 3 %

# rare = gold = 2 %


def get_winner_weapon(slot_name):
    rarities = {
        "milspec": 0.8,
        "restricted": 0.1,
        "classified": 0.05,
        "covert": 0.03,
        "rare": 0.01,
    }

    slot = Slot.objects.get(slot_name=slot_name)

    weapon = random.choice(slot.Item.filter(rarity="milspec"))

    return weapon

    # for rarity in rarities:

    #     print(weapon.rarity)



def decimal_to_float_default(obj):
    if isinstance(obj, Decimal):
        return float(obj)