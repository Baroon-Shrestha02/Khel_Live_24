import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

const ALLOWED_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/avif",
  "image/heic",
]);

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

const streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "inquiries", resource_type: "image" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const uploadMedias = async (files) => {
  const fileArray = Array.isArray(files) ? files : [files];
  const isSingleFile = fileArray.length === 1;

  const uploadedFiles = await Promise.all(
    fileArray.map(async (file) => {
      if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
        throw new Error(
          `Invalid file type: "${file.mimetype}". Allowed: ${[...ALLOWED_MIME_TYPES].join(", ")}`,
        );
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        throw new Error(
          `File "${file.originalname}" exceeds the ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB limit`,
        );
      }

      try {
        const result = await streamUpload(file.buffer);
        return {
          public_id: result.public_id,
          url: result.secure_url,
        };
      } catch (error) {
        throw new Error(
          `Failed to upload "${file.originalname}": ${error.message ?? "Unknown Cloudinary error"}`,
        );
      }
    }),
  );

  return isSingleFile ? uploadedFiles[0] : uploadedFiles;
};

const deleteMedia = async (public_id) => {
  try {
    await cloudinary.uploader.destroy(public_id);
  } catch (error) {
    throw new Error(`Failed to delete media: ${error.message}`);
  }
};

export { uploadMedias, deleteMedia };
