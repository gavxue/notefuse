import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

const s3Client = new S3Client({
  region: "us-east-2",
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_S3_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_S3_AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToS3(file: File) {
  try {
    const file_key =
      "uploads/" + Date.now().toString() + file.name.replace(" ", "-");

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
  }
}

export function getS3Url(file_key: string) {
  const url = `https://${process.env.NEXT_PUBLIC_S3_AWS_BUCKET_NAME}.s3.us-east-2.amazonaws.com/${file_key}`;

  return url;
}
