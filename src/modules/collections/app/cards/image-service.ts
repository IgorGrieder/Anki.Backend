import S3Service from "../../../../shared/infra/s3/s3-service";

const bucket = process.env.BUCKET_NAME || "";

export const uploadImage = async (file: Express.Multer.File, key: string) => {
  const s3 = new S3Service();
  return await s3.uploadObject({
    bucket,
    key,
    body: file.buffer,
    contentType: file.mimetype,
  });
};

export const deleteImage = async (key: string) => {
  const s3 = new S3Service();
  return await s3.deleteObject({ bucket, key });
};

export const getImageStream = async (key: string) => {
  const s3 = new S3Service();
  return await s3.getObjectStream({ bucket, key });
};
