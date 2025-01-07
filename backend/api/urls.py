from django.urls import path
from .views import SaveDataToGoogleDriveView

urlpatterns = [
    path("save/", SaveDataToGoogleDriveView.as_view(), name="save-to-onedrive"),
]
