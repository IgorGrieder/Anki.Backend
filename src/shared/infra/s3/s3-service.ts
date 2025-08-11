import {
  S3Client,
  PutObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

type S3GetObjectResult = {
  stream: any;
  contentType?: string;
  contentLength?: number;
};

export class S3Service {
  private client: S3Client;

  constructor() {
    this.client = new S3Client({
      region: process.env.BUCKET_REGION,
      credentials: process.env.ACCESS_KEY
        ? {
            accessKeyId: process.env.ACCESS_KEY,
            secretAccessKey: process.env.SECRET_ACCESS_KEY || "",
          }
        : undefined,
    });
  }

  async uploadObject(params: {
    bucket: string;
    key: string;
    body: Buffer;
    contentType?: string;
  }): Promise<boolean> {
    try {
      await this.client.send(
        new PutObjectCommand({
          Bucket: params.bucket,
          Key: params.key,
          Body: params.body,
          ContentType: params.contentType,
        })
      );
      return true;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("S3 upload error", err);
      return false;
    }
  }

  async deleteObject(params: { bucket: string; key: string }): Promise<boolean> {
    try {
      await this.client.send(
        new DeleteObjectsCommand({
          Bucket: params.bucket,
          Delete: { Objects: [{ Key: params.key }] },
        })
      );
      return true;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("S3 delete error", err);
      return false;
    }
  }

  async getObjectStream(params: {
    bucket: string;
    key: string;
  }): Promise<S3GetObjectResult | null> {
    try {
      const res = await this.client.send(
        new GetObjectCommand({ Bucket: params.bucket, Key: params.key })
      );

      if (!res.Body) return null;
      return {
        stream: res.Body as any,
        contentType: (res as any).ContentType,
        contentLength: (res as any).ContentLength,
      };
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("S3 get object error", err);
      return null;
    }
  }
}

export default S3Service;
