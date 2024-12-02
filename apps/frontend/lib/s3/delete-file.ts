import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/s3";

export async function deleteFileS3(fileName: string): Promise<string> {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME as string,
    Key: fileName,
  };

  const command = new DeleteObjectCommand(params);
  await s3Client.send(command);

  return fileName;
}
