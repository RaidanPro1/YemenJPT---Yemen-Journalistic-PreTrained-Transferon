
import os
import shutil
import logging
from typing import Optional

class StorageManager:
    """
    Hybrid Storage Manager (Sovereign Vault)
    Supports both Local Disk and S3 (MinIO/AWS).
    Configured via ENABLE_S3 env var.
    """
    def __init__(self):
        self.use_s3 = os.getenv("ENABLE_S3", "false").lower() == "true"
        self.local_storage_path = "/app/uploads"
        # Determine base URL for local files (Localhost or Domain)
        self.host_url = os.getenv("API_BASE_URL", "http://localhost:8000")
        
        if self.use_s3:
            import boto3
            from botocore.client import Config
            self.access_key = os.getenv("AWS_ACCESS_KEY_ID")
            self.secret_key = os.getenv("AWS_SECRET_ACCESS_KEY")
            self.bucket_name = os.getenv("AWS_BUCKET", "raidanpro")
            self.endpoint_url = os.getenv("AWS_ENDPOINT")
            
            try:
                self.s3_client = boto3.client(
                    's3',
                    aws_access_key_id=self.access_key,
                    aws_secret_access_key=self.secret_key,
                    endpoint_url=self.endpoint_url,
                    config=Config(signature_version='s3v4')
                )
            except Exception as e:
                logging.error(f"Failed to init S3: {e}")
                self.use_s3 = False # Fallback to local

        # Ensure local dir exists
        if not self.use_s3:
            os.makedirs(self.local_storage_path, exist_ok=True)

    def upload_file(self, file_path: str, object_name: Optional[str] = None) -> bool:
        if object_name is None:
            object_name = os.path.basename(file_path)

        if self.use_s3:
            try:
                self.s3_client.upload_file(file_path, self.bucket_name, object_name)
                return True
            except Exception as e:
                logging.error(f"S3 Upload Error: {e}")
                return False
        else:
            # Local Storage Strategy
            try:
                target_path = os.path.join(self.local_storage_path, object_name)
                shutil.copy(file_path, target_path)
                return True
            except Exception as e:
                logging.error(f"Local Save Error: {e}")
                return False

    def get_file_url(self, object_name: str) -> Optional[str]:
        """Returns a viewable URL for the file"""
        if self.use_s3:
            try:
                return self.s3_client.generate_presigned_url(
                    'get_object',
                    Params={'Bucket': self.bucket_name, 'Key': object_name},
                    ExpiresIn=3600
                )
            except Exception as e:
                logging.error(f"S3 URL Gen Error: {e}")
                return None
        else:
            # Return Localhost URL served by FastAPI StaticFiles
            return f"{self.host_url}/uploads/{object_name}"

    def list_files(self):
        if self.use_s3:
            try:
                response = self.s3_client.list_objects_v2(Bucket=self.bucket_name)
                return [obj['Key'] for obj in response.get('Contents', [])]
            except Exception as e:
                logging.error(f"S3 List Error: {e}")
                return []
        else:
            try:
                return os.listdir(self.local_storage_path)
            except Exception as e:
                logging.error(f"Local List Error: {e}")
                return []
