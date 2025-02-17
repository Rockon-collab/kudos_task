from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import Organization, User, Kudo


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "created_at")
    search_fields = ("name",)
    ordering = ("name",)


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = (
        "id",
        "email",
        "organization",
        "kudos_balance",
        "is_staff",
        "is_active",
    )
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("User Info", {"fields": ("organization", "kudos_balance")}),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "password1", "password2"),
            },
        ),
    )
    search_fields = ("email",)
    ordering = ("email",)


@admin.register(Kudo)
class KudosAdmin(admin.ModelAdmin):
    list_display = ("id", "sender", "receiver", "created_at")
    search_fields = ("sender__username", "receiver__username", "message")
    list_filter = ("created_at",)
