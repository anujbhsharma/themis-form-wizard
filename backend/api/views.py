import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .utils import upload_to_drive


class SaveDataToGoogleDriveView(APIView):
    def post(self, request):
        try:
            # Get the form data from the request
            form_data = request.data

            # Convert the form data to JSON string
            file_content = json.dumps(form_data)

            # Use the phone number as the file name (you can sanitize it if necessary)
            phone = form_data.get("phone", "")
            if phone:
                # remove non-numeric characters
                file_name = f"{phone.replace('-', '')}.json"
            else:
                file_name = "form_data.json" 

            # Upload the JSON data to Google Drive
            file_id = upload_to_drive(file_content, file_name)

            return Response(
                {"message": "Form data saved to Google Drive successfully!", "file_id": file_id},
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
