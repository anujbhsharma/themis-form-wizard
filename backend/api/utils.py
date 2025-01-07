from django.conf import settings
from googleapiclient.http import MediaIoBaseUpload
import io
import os
from googleapiclient.discovery import build
from google.oauth2 import service_account


# Constants for Google Drive
SCOPES = ['https://www.googleapis.com/auth/drive']
SERVICE_ACCOUNT_FILE = os.path.join(settings.BASE_DIR, 'themis-core-aab73dca5e4e.json')
PARENT_FOLDER_ID = "1nUD6noJtjP4pKKv02mF2mebjFZInuLME"

def authenticate():
    """Authenticate with Google Drive API using service account."""
    creds = service_account.Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    return creds

def upload_to_drive(file_content, file_name):
    """Upload the JSON data as a file to Google Drive."""
    creds = authenticate()
    service = build('drive', 'v3', credentials=creds)

    file_metadata = {
        'name': file_name,
        'parents': [PARENT_FOLDER_ID]
    }

    # Create a file-like object from the JSON data
    file_data = io.BytesIO(file_content.encode('utf-8'))
    media = MediaIoBaseUpload(file_data, mimetype='application/json')

    # Upload the file to Google Drive
    file = service.files().create(
        body=file_metadata,
        media_body=media,
        fields='id'
    ).execute()

    return file.get('id')