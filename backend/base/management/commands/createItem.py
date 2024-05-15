from django.core.management.base import BaseCommand, CommandError
from base.models import Item


class Command(BaseCommand):
    help = "Closes the specified poll for voting"

    def add_arguments(self, parser):
        parser.add_argument("-w", "--weapon_name", type=str)
        parser.add_argument("-s", "--skin_name", type=str)
        parser.add_argument("-r", "--rarity", type=str)
        parser.add_argument("-si", "--steam_image", type=str)

    def handle(self, *args, **options):
        item = Item()

        item.weapon_name = options["weapon_name"]
        item.skin_name = options["skin_name"]
        item.rarity = options["rarity"]
        item.steam_image = options["steam_image"]

        item.save()
