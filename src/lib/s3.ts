import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

const s3Client = new S3Client({
  region: "us-east-2",
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_S3_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_S3_AWS_SECRET_ACCESS_KEY!,
  },
});

function sanitizeFileName(fileName: string): string {
  // replace any special characters and spaces with hyphens
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '-') 
    .replace(/-+/g, '-')             
    .toLowerCase();                  
}

export async function uploadToS3(file: File) {
  try {
    const sanitizedName = sanitizeFileName(file.name);
    const file_key = `uploads/${Date.now().toString()}-${sanitizedName}`;

    const uploadParams = {
      Bucket: process.env.NEXT_PUBLIC_S3_AWS_BUCKET_NAME!,
      Key: file_key,
      Body: file,
    };

    const upload = new Upload({
      client: s3Client,
      params: uploadParams,
    });

    upload.on("httpUploadProgress", (progress) => {
      const percentage = (progress.loaded / progress.total) * 100;
      console.log(`Upload progress: ${percentage.toFixed(2)}%`);
    });

    const response = await upload.done();
    console.log("File uploaded successfully:", response);

    return Promise.resolve({
      file_key,
      file_name: file.name,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error; 
  }
}

export function getS3Url(file_key: string) {
  const bucketName = process.env.NEXT_PUBLIC_S3_AWS_BUCKET_NAME;
  const s3Domain = `https://${bucketName}.s3.us-east-2.amazonaws.com`;
  
  // check if file_key already has proper encoding
  const encodedKey = file_key.includes('%') ? 
    file_key : 
    encodeURIComponent(file_key).replace(/%2F/g, '/');
  
  return `${s3Domain}/${encodedKey}`;
}
