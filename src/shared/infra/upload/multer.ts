import multer from "multer";

export const createUpload = () => multer({ storage: multer.memoryStorage() });

export const upload = createUpload();

export default upload;
