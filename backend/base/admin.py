from django.contrib import admin
from .models import *
from import_export.admin import ImportExportModelAdmin

# Register your models here.



@admin.register(Item)
class ItemAdmin(ImportExportModelAdmin):
    list_display = (
        "weapon_name",
        "skin_name",
        "rarity",
    )

    list_filter = ("rarity", "weapon_name",)



@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    list_display = ("slot", "user", "time", "item",)
    list_filter = ("slot",)

@admin.register(Slot)
class SlotAdmin(admin.ModelAdmin):
    list_display = ("slot_name",)
