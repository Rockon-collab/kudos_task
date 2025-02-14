import uuid
from datetime import date, timedelta

from django.contrib.auth.models import AbstractUser
from django.db import models
from apis.managers import CustomUserManager
from django.core.exceptions import ValidationError


class TimestampedModel(models.Model):
    """Abstract model for created_at and updated_at timestamps."""

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Organization(TimestampedModel):
    """An organization that users belong to."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name


class User(AbstractUser, TimestampedModel):
    """Custom User model with unique email-based authentication."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    username = None

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name="users",
        null=True,
        blank=True,
    )
    kudos_balance = models.PositiveIntegerField(default=3)

    def kudos_given_this_week(self):
        """Count kudos given by the user in the current week."""
        start_of_week = date.today() - timedelta(days=date.today().weekday())
        return self.given_kudos.filter(
            created_at__date__gte=start_of_week
        ).count()

    def has_kudos_remaining(self):
        """Check if the user has remaining kudos for the current week."""
        return self.kudos_given_this_week() < 3

    def __str__(self):
        return f"{self.email} ({self.organization.name if self.organization else 'No Org'})"


class Kudo(TimestampedModel):
    """A Kudos represents a recognition given from one user to another."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sender = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="given_kudos"
    )
    receiver = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="received_kudos"
    )
    message = models.TextField()

    def __str__(self):
        return f"{self.sender} → {self.receiver} ({self.created_at.date()})"

    def clean(self):
        """Ensure that a user cannot send a kudo to themselves."""
        if self.sender == self.receiver:
            raise ValidationError("You cannot give kudos to yourself.")

    def save(self, *args, **kwargs):
        """Validate before saving to ensure business logic constraints."""
        self.clean()
        super().save(*args, **kwargs)

    class Meta:
        ordering = ["-created_at"]
