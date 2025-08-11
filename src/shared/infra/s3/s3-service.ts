import {
  S3Client,
  PutObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

export type S3GetObjectResult = {
  stream: any;
  contentType?: string;
  contentLength?: number;
} | null;

let memoizedClient: S3Client | null = null;

const getClient = (): S3Client => {
  if (memoizedClient) return memoizedClient;
  memoizedClient = new S3Client({
    region: process.env.BUCKET_REGION,
    credentials: process.env.ACCESS_KEY
      ? {
          accessKeyId: process.env.ACCESS_KEY,
          secretAccessKey: process.env.SECRET_ACCESS_KEY || "",
        }
      : undefined,
  });
  return memoizedClient;
};

export const uploadObject = async (params: {
  bucket: string;
  key: string;
  body: Buffer;
  contentType?: string;
}): Promise<boolean> => {
  try {
    await getClient().send(
      new PutObjectCommand({
        Bucket: params.bucket,
        Key: params.key,
        Body: params.body,
        ContentType: params.contentType,
      })
    );
    return true;
  } catch (err: any) {
    console.error("S3 upload error", err);
    return false;
  }
};

export const deleteObject = async (params: {
  bucket: string;
  key: string;
}): Promise<boolean> => {
  try {
    await getClient().send(
      new DeleteObjectsCommand({
        Bucket: params.bucket,
        Delete: { Objects: [{ Key: params.key }] },
      })
    );
    return true;
  } catch (err: any) {
    console.error("S3 delete error", err);
    return false;
  }
};

export const getObjectStream = async (params: {
  bucket: string;
  key: string;
}): Promise<S3GetObjectResult> => {
  try {
    const res = await getClient().send(
      new GetObjectCommand({ Bucket: params.bucket, Key: params.key })
    );
    if (!res.Body) return null;
    return {
      stream: res.Body as any,
      contentType: (res as any).ContentType,
      contentLength: (res as any).ContentLength,
    };
  } catch (err: any) {
    console.error("S3 get object error", err);
    return null;
  }
};
