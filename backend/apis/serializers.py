from rest_framework import serializers
from apis.models import Kudo, Organization, User
from django.utils.timezone import now
from datetime import timedelta


class OrganizationSerializer(serializers.ModelSerializer):
    """Serializer for Organization model"""

    class Meta:
        model = Organization
        fields = ["id", "name"]


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ["first_name", "last_name", "email", "organization", "password"]

    def create(self, validated_data):
        validated_data.pop("organization", None)
        user = User(**validated_data)
        user.set_password(validated_data["password"])
        user.save()
        return user


class KudosSerializer(serializers.ModelSerializer):
    """Serializer for Kudos model"""

    receiver = serializers.EmailField()
    sender = serializers.EmailField(read_only=True)
    sender_full_name = serializers.SerializerMethodField()
    receiver_full_name = serializers.SerializerMethodField()

    class Meta:
        model = Kudo
        fields = [
            "sender_full_name",
            "sender",
            "receiver_full_name",
            "receiver",
            "message",
        ]

    def get_sender_full_name(self, obj):
        """Return sender's full name"""
        return f"{obj.sender.first_name} {obj.sender.last_name}".strip()

    def get_receiver_full_name(self, obj):
        """Return receiver's full name"""
        return f"{obj.receiver.first_name} {obj.receiver.last_name}".strip()

    def validate(self, data):
        """Ensure user has remaining kudos for the current week and sender is correct"""
        request = self.context["request"]
        sender = request.user
        receiver_email = data["receiver"]

        # Get the receiver object from email
        try:
            receiver = User.objects.get(email=receiver_email)
        except User.DoesNotExist:
            raise serializers.ValidationError(
                {"receiver": "No user found with this email."}
            )

        # Get the start of the current week (Monday at 00:00:00)
        today = now().date()
        start_of_week = today - timedelta(days=today.weekday())

        # Ensure sender and receiver belong to the same organization
        if sender.organization != receiver.organization:
            raise serializers.ValidationError(
                "You can only give kudos to users from your organization."
            )

        # Ensure sender's kudos count resets weekly and does not roll over
        if not sender.has_kudos_remaining():
            raise serializers.ValidationError(
                "You have no remaining kudos for this week."
            )

        # Prevent sending kudos to self
        if sender == receiver:
            raise serializers.ValidationError("You cannot give kudos to yourself.")

        # Prevent sending kudos to the same user twice in a week
        if Kudo.objects.filter(
            sender=sender,
            receiver=receiver,
            created_at__date__gte=start_of_week,
        ).exists():
            raise serializers.ValidationError(
                "You have already given kudos to this user this week."
            )

        # Replace the email with the actual user instance
        data["receiver"] = receiver
        return data

    def create(self, validated_data):
        """Automatically set the sender as the logged-in user"""
        validated_data["sender"] = self.context["request"].user
        return super().create(validated_data)


class UserListSerializer(serializers.ModelSerializer):
    """Serializer for listing users in the same organization"""

    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "email"]
