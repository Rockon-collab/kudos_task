from rest_framework import generics, status, serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apis.models import Kudo, User, Organization
from apis.serializers import (
    KudosSerializer,
    UserListSerializer,
    OrganizationSerializer,
)
from django.db.models import Count


class OrganizationListView(generics.ListAPIView):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer


class UserListView(generics.ListAPIView):
    """List all users in the same organization"""

    serializer_class = UserListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_org = self.request.user.organization
        if not user_org:
            return User.objects.none()
        return User.objects.filter(organization=user_org)


class KudosListView(generics.ListAPIView):
    """Retrieve kudos received by the logged-in user"""

    serializer_class = KudosSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Kudo.objects.filter(receiver=self.request.user)


class GiveKudosView(generics.CreateAPIView):
    """Allow users to send kudos, enforcing weekly limits"""

    serializer_class = KudosSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user

        if user.kudos_balance <= 0:
            raise serializers.ValidationError("You have no kudos left for this week.")

        user.kudos_balance -= 1
        user.save(update_fields=["kudos_balance"])

        serializer.save(sender=user)


class ReceiverKudosView(APIView):
    """Retrieve all kudos received by the logged-in user along with a kudos count"""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        kudos_received = Kudo.objects.filter(receiver=user)
        kudos_count = kudos_received.count()
        serializer = KudosSerializer(kudos_received, many=True)

        return Response(
            {"kudos_count": kudos_count, "kudos_received": serializer.data},
            status=status.HTTP_200_OK,
        )


class KudosSentListView(generics.ListAPIView):
    """List all kudos sent by the logged-in user"""

    serializer_class = KudosSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filter kudos by the logged-in user as sender"""
        return Kudo.objects.filter(sender=self.request.user)


class SummaryView(generics.GenericAPIView):
    """
    API View to return summary statistics of the kudos system within an organization.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        organization = user.organization

        if not organization:
            return Response(
                {"error": "User is not part of any organization."}, status=400
            )

        # users in the organization
        users_in_org = User.objects.filter(organization=organization)

        total_kudos_sent = Kudo.objects.filter(sender__in=users_in_org).count()

        kudos_received = Kudo.objects.filter(receiver__in=users_in_org).count()

        team_members = users_in_org.count()

        # Fetch top receivers of kudos (sorted by kudos count)
        top_receivers = (
            Kudo.objects.filter(receiver__in=users_in_org)
            .values(
                "receiver__id",
                "receiver__email",
                "receiver__first_name",
                "receiver__last_name",
                "receiver__organization__name",
            )
            .annotate(total_received=Count("id"))
            .order_by("-total_received")[:5]  # Get top 5
        )

        # Format top receivers data
        top_receivers_data = [
            {
                "id": receiver["receiver__id"],
                "email": receiver["receiver__email"],
                "name": f"{receiver['receiver__first_name']} {receiver['receiver__last_name']}",
                "organization": receiver["receiver__organization__name"],
                "kudos_received": receiver["total_received"],
            }
            for receiver in top_receivers
        ]

        # Serialize response data
        response_data = {
            "user_name": f"{request.user.first_name} {request.user.last_name}",
            "user_email": request.user.email,
            "user_organization": request.user.organization.name,
            "user_kudos_balance": request.user.kudos_balance,
            "total_kudos_sent": total_kudos_sent,
            "kudos_received": kudos_received,
            "team_members": team_members,
            "top_receivers": top_receivers_data,
        }

        return Response(response_data)
