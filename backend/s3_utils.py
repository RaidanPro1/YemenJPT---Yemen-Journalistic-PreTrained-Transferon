import os
import boto3
from botocore.client import Config
from typing import Optional

class S3Manager:
    def __init__(self):
        self.access_key = os.getenv("AWS_ACCESS_KEY_ID")
        self.secret_key = os.getenv("AWS_SECRET_ACCESS_KEY")
        self.region = os.getenv("AWS_REGION", "US-central")
        self.bucket_name = os.getenv("AWS_BUCKET", "raidanpro")
        self.endpoint_url = os.getenv("AWS_ENDPOINT", "https://usc1.contabostorage.com")
        self.path_style = os.getenv("S3_PATH_STYLE", "true").lower() == "true"

        self.s3_client = None
        if self.access_key and self.secret_key:
            self.s3_client = boto3.client(
                's3',
                aws_access_key_id=self.access_key,
                aws_secret_access_key=self.secret_key,
                endpoint_url=self.endpoint_url,
                region_name=self.region,
                config=Config(signature_version='s3v4', s3={'addressing_style': 'path' if self.path_style else 'auto'})
            )

    def upload_file(self, file_path: str, object_name: Optional[str] = None):
        if not self.s3_client:
            return False
        if object_name is None:
            object_name = os.path.basename(file_path)
        try:
            self.s3_client.upload_file(file_path, self.bucket_name, object_name)
            return True
        except Exception as e:
            print(f"S3 Upload Error: {e}")
            return False

    def generate_presigned_url(self, object_name: str, expiration=3600):
        if not self.s3_client:
            return None
        try:
            url = self.s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': self.bucket_name, 'Key': object_name},
                ExpiresIn=expiration
            )
            return url
        except Exception as e:
            print(f"S3 URL Error: {e}")
            return None

    def list_files(self):
        if not self.s3_client:
            return []
        try:
            response = self.s3_client.list_objects_v2(Bucket=self.bucket_name)
            return [obj['Key'] for obj in response.get('Contents', [])]
        except Exception as e:
            print(f"S3 List Error: {e}")
            return []