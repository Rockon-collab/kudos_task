from django.urls import path
from apis.views import (
    UserListView,
    KudosListView,
    GiveKudosView,
    ReceiverKudosView,
    KudosSentListView,
    OrganizationListView,
    SummaryView,
)

urlpatterns = [
    path("users/", UserListView.as_view(), name="user-list"),
    path("kudos-list/", KudosListView.as_view(), name="kudos-list"),
    path("give-kudos/", GiveKudosView.as_view(), name="give-kudos"),
    path("kudos-received/", ReceiverKudosView.as_view(), name="receiver-kudos"),
    path("kudos/sent/", KudosSentListView.as_view(), name="kudos-sent-list"),
    path("organizations/", OrganizationListView.as_view(), name="organizations"),
    path("summary/", SummaryView.as_view(), name="summary"),
]
