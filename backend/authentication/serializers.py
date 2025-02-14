from django.contrib.auth import authenticate
from rest_framework import serializers

from apis.models import Organization, User


class UserSignupSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(
        style={"input_type": "password"}, write_only=True
    )
    organization = serializers.CharField(
        write_only=True
    )  # Accept org name instead of UUID

    class Meta:
        model = User
        fields = [
            "first_name",
            "last_name",
            "email",
            "password",
            "password2",
            "organization",
        ]
        extra_kwargs = {"password": {"write_only": True}}

    def validate(self, attrs):
        password = attrs.get("password")
        password2 = attrs.get("password2")
        if password != password2:
            raise serializers.ValidationError(
                {"password2": "Passwords do not match!"}
            )
        return attrs

    def create(self, validated_data):
        validated_data.pop("password2")  # Remove password2 before saving

        # Get or create the Organization based on name
        organization_name = validated_data.pop("organization")
        organization, _ = Organization.objects.get_or_create(
            name=organization_name
        )

        # Assign the found/created organization to the user
        user = User.objects.create_user(
            **validated_data, organization=organization
        )
        return user


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(
        write_only=True, style={"input_type": "password"}
    )

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        if not email or not password:
            raise serializers.ValidationError(
                "Both email and password are required!"
            )

        user = authenticate(email=email, password=password)
        if user is None:
            raise serializers.ValidationError("Invalid email or password!")

        if not user.is_active:
            raise serializers.ValidationError(
                "This account is inactive. Please contact support."
            )

        attrs["user"] = user
        return attrs
