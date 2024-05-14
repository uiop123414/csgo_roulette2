from django.contrib import admin
from .models import *
from import_export.admin import ImportExportModelAdmin

# Register your models here.


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    pass


@admin.register(Item)
class ItemAdmin(ImportExportModelAdmin):
    list_display = ('weapon_name', 'skin_name', 'rarity',)


@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    list_display = ('slot', 'user', 'time','item')


@admin.register(Slot)
class SlotAdmin(admin.ModelAdmin):
    list_display = ('slot_name',)

