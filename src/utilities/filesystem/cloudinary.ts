import cloudinary from "cloudinary";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload file to Cloudinary
 *
 * @param file - Multer file
 * @param directory - Directory path
 * @returns
 */
export const upload = async (
  file: Express.Multer.File,
  directory: string = "uploads"
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      if (!file || !file.buffer) {
        return reject(new Error("Invalid or empty file"));
      }

      const uploadOptions: any = {
        folder: directory,
        format: "webp",
        resource_type: "image",
        quality: "auto",
        fetch_format: "auto",
      };

      const stream = cloudinary.v2.uploader.upload_stream(
        uploadOptions,
        (error: any, result: any) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return reject(error);
          }
          resolve(result.secure_url);
        }
      );

      stream.end(file.buffer);
    } catch (error) {
      console.error("Upload error:", error);
      reject(error);
    }
  });
};

/**
 * Remove file from Cloudinary
 *
 * @param filePath - Public Cloudinary URL or relative path
 * @returns
 */
export const remove = async (filePath: string): Promise<void> => {
  try {
    // Extract public_id from Cloudinary URL
    const urlParts = filePath.split("/");
    const fileNameWithExtension = urlParts[urlParts.length - 1];
    const publicId = urlParts
      .slice(-2)
      .join("/")
      .replace(/\.[^/.]+$/, "");

    await cloudinary.v2.uploader.destroy(publicId, {
      resource_type: "image",
      invalidate: true,
    });
  } catch (error: any) {
    console.error("Cloudinary remove error:", error);
    throw new Error(`Error removing Cloudinary file: ${error.message}`);
  }
};

/**
 * Update Cloudinary file
 *
 * @param oldFilePath
 * @param newFile
 * @param directory
 * @returns
 */
export const update = async (
  oldFilePath: string,
  newFile: Express.Multer.File,
  directory: string = "uploads"
): Promise<string> => {
  try {
    // Remove old file if exists
    if (oldFilePath) {
      await remove(oldFilePath);
    }

    // Upload new file
    return await upload(newFile, directory);
  } catch (error: any) {
    console.error("Cloudinary update error:", error);
    throw new Error(`Error updating Cloudinary file: ${error.message}`);
  }
};
