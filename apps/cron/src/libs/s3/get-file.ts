import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from ".";

export default function getS3Object(fileKey: string) {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME as string,
    Key: fileKey,
  };

  const fileResponse = s3Client.send(new GetObjectCommand(params));
  return fileResponse;
}
