import { uploadObject, deleteObject, getObjectStream } from "../../../../shared/infra/s3/s3-service";

const bucket = process.env.BUCKET_NAME || "";

export const uploadImage = async (file: Express.Multer.File, key: string) => {
  return await uploadObject({
    bucket,
    key,
    body: file.buffer,
    contentType: file.mimetype,
  });
};

export const deleteImage = async (key: string) => {
  return await deleteObject({ bucket, key });
};

export const getImageStream = async (key: string) => {
  return await getObjectStream({ bucket, key });
};
