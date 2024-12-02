import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/s3";

export async function uploadFileToS3(
  file: Buffer,
  fileName: string
): Promise<string> {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME as string,
    Key: fileName,
    Body: file,
    ContentType: "text/txt", // Change the content type accordingly
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  // get signed url for file uploaded

  return fileName;
}
