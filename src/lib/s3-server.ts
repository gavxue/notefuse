import { S3 } from "@aws-sdk/client-s3";
import fs from "fs";

export async function downloadFromS3(file_key: string) {
  return new Promise(async (resolve, reject) => {
    try {
      const s3 = new S3({
        region: "us-east-2",
        credentials: {
          accessKeyId: process.env.NEXT_PUBLIC_S3_AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.NEXT_PUBLIC_S3_AWS_SECRET_ACCESS_KEY!,
        },
      });

      const params = {
        Bucket: process.env.NEXT_PUBLIC_S3_AWS_BUCKET_NAME!,
        Key: file_key,
      };

      // get the file
      const obj = await s3.getObject(params);
      const file_name = `/tmp/pdf-${Date.now().toString()}.pdf`;

      // return the file
      if (obj.Body instanceof require("stream").Readable) {
        const file = fs.createWriteStream(file_name);
        // @ts-ignore
        obj.Body?.pipe(file).on("finish", () => {
          return resolve(file_name);
        });
      }
    } catch (error) {
      console.log(error);
      reject(error);
      return null;
    }
  });
}
