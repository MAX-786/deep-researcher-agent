from flask import Flask, request, jsonify, render_template, send_from_directory
import os
from azure.storage.blob import BlobServiceClient
from azure.core.exceptions import ResourceExistsError
from azure.ai.documentintelligence import DocumentIntelligenceClient
from azure.core.credentials import AzureKeyCredential
import tempfile
import uuid
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__, template_folder='.', static_folder='.')

# Azure Storage configuration
AZURE_STORAGE_CONNECTION_STRING = os.environ.get("AZURE_STORAGE_CONNECTION_STRING")
CONTAINER_NAME = "pdf-documents"  # Name of your container

# Initialize the blob service client
blob_service_client = BlobServiceClient.from_connection_string(AZURE_STORAGE_CONNECTION_STRING)

# Create container if it doesn't exist
try:
    container_client = blob_service_client.create_container(CONTAINER_NAME)
except ResourceExistsError:
    container_client = blob_service_client.get_container_client(CONTAINER_NAME)


@app.route('/upload-pdf', methods=['POST'])
def upload_pdf():
    """
    Endpoint to upload a PDF file to Azure Blob Storage
    """
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file and file.filename.endswith('.pdf'):
        # Generate a unique blob name
        blob_name = f"{uuid.uuid4()}.pdf"
        
        # Upload the file to Azure Blob Storage
        blob_client = container_client.get_blob_client(blob_name)
        blob_client.upload_blob(file)
        
        # Return the blob URL and name
        return jsonify({
            "message": "File uploaded successfully",
            "blob_name": blob_name,
            "blob_url": blob_client.url
        }), 200
    
    return jsonify({"error": "File must be a PDF"}), 400

@app.route('/')
def index():
    """
    Serve the upload form
    """
    return render_template('upload-form.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))